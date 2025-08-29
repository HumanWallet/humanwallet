import { createConnector } from "@wagmi/core"
import type { CreateConnectorFn } from "@wagmi/core"
import { toWebAuthnKey, toPasskeyValidator, PasskeyValidatorContractVersion } from "@zerodev/passkey-validator"
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants"
import type { TransactionRequest, EIP1193Parameters, WalletRpcSchema, Call } from "viem"
import { UserRejectedRequestError, createPublicClient, http, hashMessage } from "viem"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
  verifyEIP6492Signature,
} from "@zerodev/sdk"
import { get, set, del } from "idb-keyval"
import type { KernelClient, PublicClient, SessionKeyAccount, WebAuthenticationKey } from "@humanwallet/types"
import { WEB_AUTHENTICATION_MODE_KEY } from "@humanwallet/types"
/**
 * Configuration options for the HumanWallet connector
 */
export interface HumanWalletOptions {
  /** ZeroDev project ID for accessing bundler and paymaster services */
  projectId: string
  /** Application name displayed to users (default: "HumanWallet") */
  appName?: string
  /** Custom passkey name for this specific connector instance */
  passkeyName?: string
  /** Dapp metadata for better user experience during connection flows */
  dappMetadata?: {
    /** Display name of the dapp */
    name: string
    /** URL of the dapp */
    url?: string
    /** Icon URL for the dapp */
    iconUrl?: string
    /** Brief description of the dapp */
    description?: string
  }
  /** Logging configuration for debugging and monitoring */
  logging?: {
    /** Enable detailed logging for development */
    developerMode?: boolean
    /** Enable SDK-level logging */
    sdk?: boolean
  }
  /** Custom passkey server URL (overrides default ZeroDev passkey service) */
  passkeyServerUrl?: string
  /** Custom bundler RPC URL pattern (default: "https://rpc.zerodev.app/api/v3") */
  bundlerRpcPattern?: string
}

/**
 * Creates a HumanWallet connector for wagmi that enables account abstraction
 * through passkey authentication and ZeroDev infrastructure.
 *
 * This connector provides:
 * - Passkey-based authentication (WebAuthn)
 * - Account abstraction with gasless transactions
 * - Automatic session management and reconnection
 * - Batch transaction support via EIP-5792
 * - Comprehensive logging and error handling
 *
 * @param options - Configuration options for the connector
 * @returns A wagmi-compatible connector function
 *
 * @example
 * ```typescript
 * import { humanWalletConnector } from '@humanwallet/connector'
 *
 * const connector = humanWalletConnector({
 *   projectId: 'your-zerodev-project-id',
 *   appName: 'My DApp',
 *   dappMetadata: {
 *     name: 'My DApp',
 *     url: 'https://mydapp.com',
 *     iconUrl: 'https://mydapp.com/icon.png'
 *   },
 *   logging: {
 *     developerMode: true
 *   }
 * })
 * ```
 */
export function humanWalletConnector(options: HumanWalletOptions): CreateConnectorFn {
  const {
    projectId,
    appName = "HumanWallet",
    passkeyName,
    dappMetadata,
    logging,
    passkeyServerUrl: customPasskeyServerUrl,
    bundlerRpcPattern = "https://rpc.zerodev.app/api/v3",
  } = options

  const displayName = passkeyName || dappMetadata?.name || `${appName} - Passkey`

  // Logging utility
  const log = (level: "info" | "warn" | "error", message: string, data?: unknown) => {
    if (logging?.developerMode) {
      console[level](`[HumanWallet] ${message}`, data || "")
    }
  }

  return createConnector((config) => {
    let kernelClient: KernelClient | undefined
    let kernelAccount: Awaited<SessionKeyAccount> | undefined
    let publicClient: PublicClient | undefined
    let isConnecting = false

    // Use custom passkey server URL if provided
    const passkeyServerUrl = customPasskeyServerUrl || `https://passkeys.zerodev.app/api/v3/${projectId}`

    const webAuthnStorageKey = `hw-webauthn-${projectId}`
    const passkeyNameStorageKey = `hw-passkey-name-${projectId}`

    /**
     * Creates a kernel account and client for the specified chain using the provided WebAuthn key.
     * Sets up the complete infrastructure including bundler, paymaster, and account abstraction.
     *
     * @param webAuthnKey - The WebAuthn key for passkey authentication
     * @param chainId - Optional chain ID to connect to (defaults to first configured chain)
     * @returns Promise resolving to connection result with accounts and chain ID
     * @throws Error if account creation fails
     */
    async function createKernelAccountAndClient(webAuthnKey: Awaited<WebAuthenticationKey>, chainId?: number) {
      try {
        log("info", "Creating kernel account and client", { chainId })

        const chain = config.chains.find((c) => c.id === chainId) || config.chains[0]
        const bundlerTransport = http(`${bundlerRpcPattern}/${projectId}/chain/${chain.id}`)
        const paymasterUrl = `${bundlerRpcPattern}/${projectId}/chain/${chain.id}`

        const paymasterClient = createZeroDevPaymasterClient({
          chain,
          transport: http(paymasterUrl),
        })

        publicClient = createPublicClient({
          chain,
          transport: bundlerTransport,
          name: "Passkeys",
        })

        const entryPoint = getEntryPoint("0.7")

        const passkeyValidator = await toPasskeyValidator(publicClient, {
          webAuthnKey,
          entryPoint,
          kernelVersion: KERNEL_V3_1,
          validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
        })

        kernelAccount = await createKernelAccount(publicClient, {
          entryPoint,
          kernelVersion: KERNEL_V3_1,
          plugins: { sudo: passkeyValidator },
        })

        kernelClient = createKernelAccountClient({
          account: kernelAccount,
          chain,
          client: publicClient,
          bundlerTransport,
          userOperation: {
            estimateFeesPerGas: ({ bundlerClient }) => getUserOperationGasPrice(bundlerClient),
          },
          paymaster: {
            getPaymasterData: (userOperation) => paymasterClient.sponsorUserOperation({ userOperation }),
          },
        })

        log("info", "Kernel account and client created successfully", {
          address: kernelAccount.address,
          chainId: chain.id,
        })

        return {
          accounts: [kernelAccount.address as `0x${string}`],
          chainId: chain.id,
        }
      } catch (error) {
        log("error", "Failed to create kernel account and client", error)
        throw error
      }
    }

    /**
     * Authenticates using an existing passkey without requiring a username.
     * This allows users to login with any existing passkey, even if not stored in IndexedDB.
     *
     * @returns Promise resolving to WebAuthn key for account creation
     * @throws UserRejectedRequestError if user cancels the operation
     * @throws Error if authentication fails
     */
    async function loginWithExistingPasskey() {
      try {
        log("info", "Attempting to authenticate with existing passkey")

        const webAuthnKey = await toWebAuthnKey({
          passkeyName: displayName,
          passkeyServerUrl,
          mode: WEB_AUTHENTICATION_MODE_KEY.LOGIN,
          passkeyServerHeaders: {},
        })

        log("info", "Successfully authenticated with existing passkey")
        return webAuthnKey
      } catch (error) {
        if (error instanceof Error && error.message.includes("cancelled")) {
          log("warn", "User cancelled passkey authentication")
          throw new UserRejectedRequestError(error)
        }
        log("error", "Failed to authenticate with existing passkey", error)
        throw new Error(
          "Failed to authenticate with existing passkey. Please ensure you have a passkey registered for this site.",
        )
      }
    }

    /**
     * Registers a new passkey with the provided username.
     * The username will be used as both the passkey name and stored for future reference.
     *
     * @param username - Username for the new passkey
     * @returns Promise resolving to WebAuthn key for account creation
     * @throws UserRejectedRequestError if user cancels the operation
     * @throws Error if registration fails
     */
    async function registerNewPasskey(username: string) {
      try {
        log("info", "Registering new passkey", { username })

        // Store the username for future reference
        await set(passkeyNameStorageKey, username)

        const webAuthnKey = await toWebAuthnKey({
          passkeyName: username,
          passkeyServerUrl,
          mode: WEB_AUTHENTICATION_MODE_KEY.REGISTER,
          passkeyServerHeaders: {},
        })

        log("info", "Successfully registered new passkey", { username })
        return webAuthnKey
      } catch (error) {
        if (error instanceof Error && error.message.includes("cancelled")) {
          log("warn", "User cancelled passkey creation")
          throw new UserRejectedRequestError(error)
        }
        log("error", "Failed to register new passkey", error)
        // Clean up stored username if registration failed
        await del(passkeyNameStorageKey)
        const errorMessage =
          error instanceof Error ? `Failed to create passkey: ${error.message}` : "Failed to create passkey"
        throw new Error(errorMessage)
      }
    }

    /**
     * Prompts user for wallet name using native browser prompt and registers a new passkey.
     * This function provides a seamless experience by using the browser's native prompt.
     *
     * @returns Promise resolving to WebAuthn key for account creation
     * @throws UserRejectedRequestError if user cancels the operation
     * @throws Error if registration fails or no name provided
     */
    async function registerNewPasskeyWithPrompt() {
      const walletName = (globalThis as { prompt?: (message: string) => string | null }).prompt?.(
        "Enter a name for your new wallet:",
      )

      // Check if prompt is available (SSR-safe) or user cancelled
      if (!walletName || walletName.trim() === "") {
        log("warn", "Cannot prompt for wallet name - not available in SSR or user cancelled")
        throw new UserRejectedRequestError(new Error("Wallet name is required"))
      }

      const trimmedName = walletName.trim()
      log("info", "User provided wallet name via prompt", { walletName: trimmedName })

      return await registerNewPasskey(trimmedName)
    }

    return {
      id: "humanWallet",
      name: dappMetadata?.name || "HumanWallet",
      type: "humanWallet" as const,
      icon:
        dappMetadata?.iconUrl ||
        "https://cdn.prod.website-files.com/64bfe0b7cf5ceb8900f47cfc/680b8e17b39c506ec5a8098f_hw-logo.svg",

      /**
       * Initializes the connector and attempts auto-connection if stored credentials exist.
       * Called automatically by wagmi when the connector is first loaded.
       *
       * @returns Promise that resolves when setup is complete
       */
      async setup() {
        try {
          log("info", "Setting up connector")
          const storedWebAuthnKey = await get(webAuthnStorageKey)
          if (storedWebAuthnKey && !kernelClient && !kernelAccount) {
            const result = await createKernelAccountAndClient(storedWebAuthnKey)
            config.emitter.emit("connect", result)
            log("info", "Auto-connected with stored credentials")
          }
        } catch (error) {
          log("warn", "Failed to auto-connect, clearing stored credentials", error)
          await del(webAuthnStorageKey)
          await del(passkeyNameStorageKey)
        }
      },

      /**
       * Establishes connection to the HumanWallet using passkey authentication.
       * Intelligently chooses between login and registration based on available passkeys.
       *
       * @param options - Connection options
       * @param options.chainId - Optional chain ID to connect to
       * @param options.username - Optional username for creating a new passkey. If provided, registers a new passkey.
       * @param options.forceCreate - If true, forces creation of a new wallet with prompt for name
       * @returns Promise resolving to connection result with accounts and chain ID
       * @throws Error if connection is already in progress
       * @throws UserRejectedRequestError if user cancels passkey creation/authentication
       */
      async connect({
        chainId,
        username,
        forceCreate,
      }: {
        chainId?: number
        username?: string
        forceCreate?: boolean
      } = {}) {
        if (isConnecting) {
          throw new Error("Connection already in progress")
        }

        isConnecting = true

        const mode = forceCreate ? "force-create" : username ? "register" : "auto"
        log("info", "Attempting to connect", { chainId, mode })

        try {
          // Validate project ID
          if (!projectId || projectId === "test-project-id") {
            throw new Error(
              "ZeroDev project ID is required. Please set VITE_ZERODEV_PROJECT_ID in your environment variables.",
            )
          }

          if (kernelClient && kernelAccount) {
            log("info", "Already connected, returning existing connection")
            const chain = config.chains.find((c) => c.id === chainId) || config.chains[0]
            return {
              accounts: [kernelAccount.address as `0x${string}`],
              chainId: chain.id,
            }
          }

          let webAuthnKey

          if (forceCreate) {
            // Force create new wallet with prompt
            log("info", "Force creating new wallet with prompt")
            webAuthnKey = await registerNewPasskeyWithPrompt()
          } else if (username && username.trim() !== "") {
            // Username provided - register new passkey with this username
            const trimmedUsername = username.trim()
            log("info", "Registering new passkey for user", { username: trimmedUsername })
            webAuthnKey = await registerNewPasskey(trimmedUsername)
          } else {
            // Auto mode - try login first, fallback to registration with prompt
            try {
              // First try stored credentials
              webAuthnKey = await get(webAuthnStorageKey)
              if (webAuthnKey) {
                log("info", "Using existing stored credentials")
              } else {
                // Try to authenticate with existing passkey
                log("info", "No stored credentials, attempting passkey authentication")
                webAuthnKey = await loginWithExistingPasskey()
              }
            } catch (loginError) {
              // If login fails, offer to create new wallet
              log("info", "Login failed, prompting to create new wallet")
              try {
                webAuthnKey = await registerNewPasskeyWithPrompt()
              } catch (createError) {
                // If user cancels creation, throw the original login error
                if (createError instanceof UserRejectedRequestError) {
                  throw createError
                }
                // Otherwise throw the login error as it's more informative
                throw loginError
              }
            }
          }

          // Store the webAuthnKey for future use
          await set(webAuthnStorageKey, webAuthnKey)

          const result = await createKernelAccountAndClient(webAuthnKey, chainId)
          config.emitter.emit("connect", result)
          log("info", "Successfully connected", result)
          return result
        } finally {
          isConnecting = false
        }
      },

      /**
       * Disconnects from the HumanWallet and clears all stored credentials.
       * Resets the connector to its initial state.
       *
       * @returns Promise that resolves when disconnection is complete
       */
      async disconnect() {
        log("info", "Disconnecting")
        kernelClient = undefined
        kernelAccount = undefined
        isConnecting = false
        await del(webAuthnStorageKey)
        await del(passkeyNameStorageKey)
        config.emitter.emit("disconnect")
        log("info", "Successfully disconnected")
      },

      /**
       * Reconnects using stored credentials without requiring user interaction.
       * Used for automatic reconnection after page reload or app restart.
       *
       * @returns Promise resolving to connection result with accounts and chain ID
       * @throws Error if no stored credentials are found
       */
      async reconnect() {
        log("info", "Attempting to reconnect")
        const storedWebAuthnKey = await get(webAuthnStorageKey)
        if (!storedWebAuthnKey) {
          log("error", "No stored WebAuthn key found for reconnection")
          throw new Error("No stored WebAuthn key found")
        }
        const result = await createKernelAccountAndClient(storedWebAuthnKey)
        config.emitter.emit("connect", result)
        log("info", "Successfully reconnected", result)
        return result
      },

      /**
       * Returns the currently connected account addresses.
       *
       * @returns Array of account addresses (empty if not connected)
       */
      async getAccounts() {
        return kernelAccount ? [kernelAccount.address as `0x${string}`] : []
      },

      /**
       * Returns the currently connected chain ID.
       *
       * @returns The chain ID of the current connection
       * @throws Error if not connected to any chain
       */
      async getChainId() {
        if (!kernelClient?.chain) throw new Error("Kernel client not initialized. Connect first.")

        return kernelClient?.chain.id || config.chains[0]?.id || 1
      },

      /**
       * Returns an EIP-1193 compatible provider for interacting with the blockchain.
       * The provider handles transaction signing through account abstraction.
       *
       * @returns EIP-1193 provider with request method
       * @throws Error if not connected
       */
      async getProvider() {
        if (!kernelClient || !kernelAccount) {
          throw new Error("Kernel client not initialized. Connect first.")
        }

        return {
          request: async (args: EIP1193Parameters<WalletRpcSchema>) => {
            const { method, params } = args
            log("info", `RPC request: ${method}`, params)

            try {
              switch (method) {
                case "eth_sendTransaction": {
                  if (!kernelClient?.account || !kernelAccount) {
                    log("error", "eth_sendTransaction called but kernel client not initialized")
                    throw new Error("Kernel client not initialized. Connect first.")
                  }

                  if (!params || !Array.isArray(params)) {
                    log("error", "eth_sendTransaction missing transaction parameter")
                    throw new Error("eth_sendTransaction missing transaction parameter")
                  }
                  const tx = params[0]! as TransactionRequest
                  if (!tx || !tx.to) {
                    log("error", "eth_sendTransaction missing tx params")
                    throw new Error("eth_sendTransaction missing tx params")
                  }

                  log("info", "Sending transaction", { to: tx.to, value: tx.value })

                  // Encode the call
                  const callData = await kernelClient.account.encodeCalls([
                    {
                      to: tx.to,
                      value: tx.value,
                      data: tx.data ?? "0x",
                    },
                  ])

                  // Send as user operation
                  const userOpHash = await kernelClient.sendUserOperation({ callData })
                  log("info", "User operation sent", { userOpHash })

                  // Wait for bundler → actual tx
                  const receipt = await kernelClient.waitForUserOperationReceipt({ hash: userOpHash })
                  log("info", "Transaction confirmed", { transactionHash: receipt.receipt.transactionHash })

                  return receipt.receipt.transactionHash
                }
                case "wallet_sendCalls": {
                  if (!kernelClient || !kernelClient?.account) {
                    log("error", "wallet_sendCalls called but kernel client not initialized")
                    throw new Error("Kernel client not initialized. Connect first.")
                  }
                  const calls = args.params?.[0]?.calls as Call[]
                  if (!calls) {
                    log("error", "wallet_sendCalls missing calls parameter")
                    throw new Error("wallet_sendCalls missing calls parameter")
                  }

                  log("info", "Sending batch calls", { callCount: calls.length })

                  const callData = await kernelClient.account.encodeCalls(calls)
                  const userOpHash = await kernelClient.sendUserOperation({ callData })
                  log("info", "Batch user operation sent", { userOpHash })

                  const receipt = await kernelClient.waitForUserOperationReceipt({ hash: userOpHash })
                  log("info", "Batch transaction confirmed", { transactionHash: receipt.receipt.transactionHash })

                  return receipt.receipt.transactionHash
                }
                case "eth_accounts": {
                  const accounts = kernelAccount ? [kernelAccount.address] : []
                  log("info", "Returning accounts", { accounts })
                  return accounts
                }
                case "eth_chainId": {
                  const chainId = kernelClient?.chain?.id || config.chains[0]?.id || 1
                  log("info", "Returning chain ID", { chainId })
                  return `0x${chainId.toString(16)}`
                }
                case "personal_sign": {
                  if (!kernelAccount) {
                    log("error", "personal_sign called but kernel account not initialized")
                    throw new Error("Kernel account not initialized. Connect first.")
                  }

                  if (!params || !Array.isArray(params) || params.length < 2) {
                    log("error", "personal_sign missing required parameters")
                    throw new Error("personal_sign requires message and address parameters")
                  }

                  const [message, address] = params as [string, string]

                  // Verify the address matches the current account
                  if (address.toLowerCase() !== kernelAccount.address.toLowerCase()) {
                    log("error", "personal_sign address mismatch", {
                      requested: address,
                      current: kernelAccount.address,
                    })
                    throw new Error("Address mismatch: can only sign with current account")
                  }

                  log("info", "Signing personal message", {
                    messageLength: message.length,
                    address: kernelAccount.address,
                  })

                  try {
                    // Use the kernel account's sign message method
                    // This leverages the passkey for signing through the smart wallet
                    const signature = await kernelAccount.signMessage({ message })

                    log("info", "Successfully signed personal message", {
                      signatureLength: signature.length,
                    })

                    // Verify the signature using EIP-1271 isValidSignature
                    try {
                      if (publicClient) {
                        const isValid = await verifyEIP6492Signature({
                          signer: kernelAccount.address, // your smart account address
                          hash: hashMessage(message),
                          signature: signature,
                          client: publicClient,
                        })

                        if (!isValid) {
                          log("error", "Signature validation failed via isValidSignature")
                          throw new Error("Generated signature is invalid according to smart contract validation")
                        }

                        log("info", "Signature verified successfully via EIP-1271 isValidSignature")
                      } else {
                        log("warn", "Client not available for signature verification")
                      }
                    } catch (validationError) {
                      log("warn", "Could not verify signature via isValidSignature, proceeding anyway", validationError)
                      // Don't throw here as some contracts might not implement EIP-1271 properly
                      // or the validation might fail for other reasons while the signature is still valid
                    }

                    return signature
                  } catch (signError) {
                    log("error", "Failed to sign personal message", signError)
                    throw new Error(
                      `Failed to sign message: ${signError instanceof Error ? signError.message : "Unknown error"}`,
                    )
                  }
                }
                default: {
                  log("warn", `Unsupported method: ${method}`)
                  throw new Error(`Method ${method} not supported`)
                }
              }
            } catch (error) {
              log("error", `RPC request failed: ${method}`, error)
              throw error
            }
          },
        }
      },

      /**
       * Checks if the connector is authorized (has stored credentials).
       * Used by wagmi to determine if auto-connection should be attempted.
       *
       * @returns True if authorized (either connected or has stored credentials)
       */
      async isAuthorized() {
        if (kernelClient && kernelAccount) return true
        const storedWebAuthnKey = await get(webAuthnStorageKey)
        return !!storedWebAuthnKey
      },

      /**
       * Switches to a different blockchain network.
       * Recreates the kernel client and account for the new chain.
       *
       * @param options - Switch chain options
       * @param options.chainId - The chain ID to switch to
       * @returns Promise resolving to the new chain configuration
       * @throws Error if the chain is not supported or no stored credentials exist
       */
      async switchChain({ chainId }) {
        log("info", "Switching chain", { chainId })
        const chain = config.chains.find((c) => c.id === chainId)
        if (!chain) {
          log("error", `Chain ${chainId} not supported`)
          throw new Error(`Chain ${chainId} not supported`)
        }
        kernelClient = undefined
        kernelAccount = undefined

        // restore session on the new chain
        const storedWebAuthnKey = await get(webAuthnStorageKey)
        if (!storedWebAuthnKey) {
          log("error", "No stored WebAuthn key for chain switch")
          throw new Error("No stored WebAuthn key")
        }
        await createKernelAccountAndClient(storedWebAuthnKey, chainId)
        config.emitter.emit("change", { chainId })
        log("info", "Successfully switched chain", { chainId: chain.id })
        return chain
      },

      /**
       * Handles account changes from the provider.
       * Emits appropriate events to notify wagmi of the change.
       *
       * @param accounts - Array of new account addresses
       */
      onAccountsChanged(accounts) {
        if (accounts.length === 0) {
          config.emitter.emit("disconnect")
        } else {
          config.emitter.emit("change", { accounts: accounts as `0x${string}`[] })
        }
      },

      /**
       * Handles chain changes from the provider.
       * Emits change event to notify wagmi of the new chain.
       *
       * @param chainId - The new chain ID (hex string)
       */
      onChainChanged(chainId) {
        config.emitter.emit("change", { chainId: Number(chainId) })
      },

      /**
       * Handles disconnection events from the provider.
       * Cleans up internal state and notifies wagmi.
       */
      onDisconnect() {
        kernelClient = undefined
        kernelAccount = undefined
        config.emitter.emit("disconnect")
      },
    }
  })
}

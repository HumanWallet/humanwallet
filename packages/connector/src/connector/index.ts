import { createConnector } from "@wagmi/core"
import type { CreateConnectorFn } from "@wagmi/core"
import { toWebAuthnKey, toPasskeyValidator, PasskeyValidatorContractVersion } from "@zerodev/passkey-validator"
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants"
import type { TransactionRequest, EIP1193Parameters, WalletRpcSchema, Call } from "viem"
import { UserRejectedRequestError, createPublicClient, http } from "viem"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
} from "@zerodev/sdk"
import { get, set, del } from "idb-keyval"
import type { KernelClient, SessionKeyAccount, WebAuthenticationKey } from "@humanwallet/types"
import { WEB_AUTHENTICATION_MODE_KEY } from "@humanwallet/types"

export interface HumanWalletOptions {
  projectId: string
  appName?: string
  passkeyName?: string
  /** Dapp metadata for better user experience */
  dappMetadata?: {
    name: string
    url?: string
    iconUrl?: string
    description?: string
  }
  /** Enable logging for debugging */
  logging?: {
    developerMode?: boolean
    sdk?: boolean
  }
  /** Enable headless mode to suppress default modals */
  headless?: boolean
  /** Custom passkey server URL */
  passkeyServerUrl?: string
  /** Custom bundler RPC URL pattern */
  bundlerRpcPattern?: string
}

export function humanWalletConnector(options: HumanWalletOptions): CreateConnectorFn {
  const {
    projectId,
    appName = "HumanWallet",
    passkeyName,
    dappMetadata,
    logging,
    headless = false,
    passkeyServerUrl: customPasskeyServerUrl,
    bundlerRpcPattern = "https://rpc.zerodev.app/api/v3",
  } = options

  const displayName = passkeyName || dappMetadata?.name || `${appName} - Passkey`

  // Note: headless option reserved for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _headless = headless

  // Logging utility
  const log = (level: "info" | "warn" | "error", message: string, data?: unknown) => {
    if (logging?.developerMode) {
      console[level](`[HumanWallet] ${message}`, data || "")
    }
  }

  return createConnector((config) => {
    let kernelClient: KernelClient | undefined
    let kernelAccount: Awaited<SessionKeyAccount> | undefined
    let isConnecting = false

    // Use custom passkey server URL if provided
    const passkeyServerUrl = customPasskeyServerUrl || `https://passkeys.zerodev.app/api/v3/${projectId}`

    const webAuthnStorageKey = `hw-webauthn-${projectId}`
    const passkeyNameStorageKey = `hw-passkey-name-${projectId}`

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

        const publicClient = createPublicClient({
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

    async function createPasskeyOwner(username: string) {
      try {
        log("info", "Attempting to authenticate with existing passkey", { username })

        const webAuthnKey = await toWebAuthnKey({
          passkeyName: displayName,
          passkeyServerUrl,
          mode: WEB_AUTHENTICATION_MODE_KEY.LOGIN,
          passkeyServerHeaders: {},
        })

        const existingName = await get(passkeyNameStorageKey)
        if (!existingName) {
          await set(passkeyNameStorageKey, displayName)
        }

        log("info", "Successfully authenticated with existing passkey")
        return webAuthnKey
      } catch (error) {
        log("warn", "Login failed, attempting to register new passkey", error)
        try {
          await set(passkeyNameStorageKey, username)

          const newWebAuthnKey = await toWebAuthnKey({
            passkeyName: username,
            passkeyServerUrl,
            mode: WEB_AUTHENTICATION_MODE_KEY.REGISTER,
            passkeyServerHeaders: {},
          })

          log("info", "Successfully registered new passkey", { username })
          return newWebAuthnKey
        } catch (registerError) {
          if (registerError instanceof Error && registerError.message.includes("cancelled")) {
            log("warn", "User cancelled passkey creation")
            throw new UserRejectedRequestError(registerError)
          }
          log("error", "Failed to create or authenticate passkey", registerError)
          throw new Error("Failed to create or authenticate passkey")
        }
      }
    }

    return {
      id: "humanWallet",
      name: dappMetadata?.name || "HumanWallet",
      type: "humanWallet" as const,
      icon:
        dappMetadata?.iconUrl ||
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iIzAwNzJGRiIgZD0iTTE2IDMyYzguODM3IDAgMTYtNy4xNjMgMTYtMTZTMjQuODM3IDAgMTYgMFMwIDcuMTYzIDAgMTZzNy4xNjMgMTYgMTYgMTZ6Ii8+PC9zdmc+",

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

      async connect({ chainId } = {}) {
        if (isConnecting) {
          throw new Error("Connection already in progress")
        }

        isConnecting = true
        log("info", "Attempting to connect", { chainId })

        try {
          if (kernelClient && kernelAccount) {
            log("info", "Already connected, returning existing connection")
            const chain = config.chains.find((c) => c.id === chainId) || config.chains[0]
            return {
              accounts: [kernelAccount.address as `0x${string}`],
              chainId: chain.id,
            }
          }

          let webAuthnKey
          try {
            webAuthnKey = await get(webAuthnStorageKey)
            if (!webAuthnKey) throw new Error("No stored WebAuthn key found")
          } catch {
            webAuthnKey = await createPasskeyOwner("username")
            await set(webAuthnStorageKey, webAuthnKey)
          }

          const result = await createKernelAccountAndClient(webAuthnKey, chainId)
          config.emitter.emit("connect", result)
          log("info", "Successfully connected", result)
          return result
        } finally {
          isConnecting = false
        }
      },

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

      async getAccounts() {
        return kernelAccount ? [kernelAccount.address as `0x${string}`] : []
      },

      async getChainId() {
        if (!kernelClient?.chain) throw new Error("Kernel client not initialized. Connect first.")

        return kernelClient?.chain.id || config.chains[0]?.id || 1
      },

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

      async isAuthorized() {
        if (kernelClient && kernelAccount) return true
        const storedWebAuthnKey = await get(webAuthnStorageKey)
        return !!storedWebAuthnKey
      },

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

      onAccountsChanged(accounts) {
        if (accounts.length === 0) {
          config.emitter.emit("disconnect")
        } else {
          config.emitter.emit("change", { accounts: accounts as `0x${string}`[] })
        }
      },

      onChainChanged(chainId) {
        config.emitter.emit("change", { chainId: Number(chainId) })
      },

      onDisconnect() {
        kernelClient = undefined
        kernelAccount = undefined
        config.emitter.emit("disconnect")
      },
    }
  })
}

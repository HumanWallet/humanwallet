import type { Hash, ReadContractParameters, SignTypedDataParameters, WriteContractParameters } from "viem"
import { createPublicClient, encodeFunctionData, http, parseSignature } from "viem"
import type { Chain, PublicClient, Transport, Address } from "../../types/ethereum"
import type { ZeroDevPaymasterClient } from "@zerodev/sdk"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
} from "@zerodev/sdk"
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
import {
  WEB_AUTH_MODE_KEY,
  type WebAuthnKey,
  type WebAuthnKeyStorageRepositoryInterface,
  type WebAuthnModeKey,
} from "../../types/webAuthnKey"
import { toPasskeyValidator, PasskeyValidatorContractVersion, toWebAuthnKey } from "@zerodev/passkey-validator"
import { WebAuthnKeyStorageRepository } from "../webAuthnKey/WebAuthnKeyStorageRepository"
import type { ClientRepositoryInterface, UserOperationHash } from "../../types/client"
import type { KernelAccount, KernelClient } from "../../types/kernel"

// Constants
const KERNEL_CLIENT_NOT_INITIALIZED_ERROR = "Kernel client not initialized"
const ENTRY_POINT_VERSION = "0.7"

/**
 * Repository for managing WebAuthn-based Ethereum account abstraction clients.
 * Handles user authentication, account creation, and blockchain interactions.
 */
export class ClientRepository implements ClientRepositoryInterface {
  private readonly passkeyUrl: string
  private readonly chain: Chain

  private readonly bundlerTransport: Transport
  private readonly paymasterTransport: Transport
  private readonly webAuthnKeyStorageRepository: WebAuthnKeyStorageRepositoryInterface

  // Lazy-loaded clients
  private _publicClient?: PublicClient
  private _paymasterClient?: ZeroDevPaymasterClient

  // Core instances
  private kernelClient?: KernelClient
  private sessionKeyAccount?: Awaited<KernelAccount>

  constructor(bundlerRpc: string, paymasterRpc: string, passkeyUrl: string, chain: Chain) {
    this.passkeyUrl = passkeyUrl
    this.chain = chain

    this.bundlerTransport = http(bundlerRpc)
    this.paymasterTransport = http(paymasterRpc)

    this.webAuthnKeyStorageRepository = WebAuthnKeyStorageRepository.create()
  }

  /**
   * Lazy getter for public client with memoization
   */
  public get publicClient(): PublicClient {
    if (!this._publicClient) {
      this._publicClient = createPublicClient({
        chain: this.chain,
        transport: this.bundlerTransport,
        name: "HumanWallet",
      })
    }
    return this._publicClient
  }

  /**
   * Lazy getter for paymaster client with memoization
   */
  public get paymasterClient(): ZeroDevPaymasterClient {
    if (!this._paymasterClient) {
      this._paymasterClient = createZeroDevPaymasterClient({
        chain: this.chain,
        transport: this.paymasterTransport,
      })
    }
    return this._paymasterClient
  }

  public get address() {
    return this.sessionKeyAccount?.address
  }

  /**
   * Generates a new WebAuthn key for the specified username and mode.
   * @param username - The username to associate with the WebAuthn key
   * @param mode - The WebAuthn mode (register or login)
   * @returns Promise resolving to the generated WebAuthn key
   */
  private generateWebAuthnKey(username: string, mode: WebAuthnModeKey): Promise<WebAuthnKey> {
    return toWebAuthnKey({
      passkeyName: username,
      passkeyServerUrl: this.passkeyUrl,
      mode,
      passkeyServerHeaders: {},
    })
  }

  /**
   * Creates a passkey validator for the given WebAuthn key.
   * @param webAuthnKey - The WebAuthn key to create a validator for
   * @returns Promise resolving to the passkey validator
   */
  private async getPasskeyValidator(webAuthnKey: WebAuthnKey) {
    return await toPasskeyValidator(this.publicClient, {
      webAuthnKey,
      entryPoint: getEntryPoint(ENTRY_POINT_VERSION),
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
    })
  }

  /**
   * Creates and initializes the kernel account and client.
   * @param webAuthnKey - The WebAuthn key to use for account creation
   */
  private async createAccountAndClient(webAuthnKey: WebAuthnKey): Promise<void> {
    if (this.kernelClient) return // Already initialized

    const validator = await this.getPasskeyValidator(webAuthnKey)
    this.sessionKeyAccount = await createKernelAccount(this.publicClient, {
      entryPoint: getEntryPoint(ENTRY_POINT_VERSION),
      plugins: { sudo: validator },
      kernelVersion: KERNEL_V3_1,
    })

    this.kernelClient = createKernelAccountClient({
      account: this.sessionKeyAccount,
      chain: this.chain,
      client: this.publicClient,
      bundlerTransport: this.bundlerTransport,
      paymaster: {
        getPaymasterData: (userOperation) => this.paymasterClient.sponsorUserOperation({ userOperation }),
      },
      userOperation: {
        estimateFeesPerGas: ({ bundlerClient }) => getUserOperationGasPrice(bundlerClient),
      },
    })
  }

  /**
   * Registers a new user with the specified username.
   * @param username - The username for the new user account
   * @returns Promise resolving to the generated WebAuthn key
   */
  public async register(username: string): Promise<Address> {
    const key = await this.generateWebAuthnKey(username, WEB_AUTH_MODE_KEY.REGISTER)

    // Parallel execution for better performance
    await Promise.all([this.webAuthnKeyStorageRepository.setWebAuthnKey(key), this.createAccountAndClient(key)])

    if (!this.address) {
      throw new Error("Account not created")
    }

    return this.address
  }

  /**
   * Logs in an existing user with the specified username.
   * @param username - The username for the existing user account
   * @returns Promise resolving to the WebAuthn key
   */
  public async login(username: string): Promise<Address> {
    const key = await this.generateWebAuthnKey(username, WEB_AUTH_MODE_KEY.LOGIN)

    await Promise.all([this.webAuthnKeyStorageRepository.setWebAuthnKey(key), this.createAccountAndClient(key)])

    const address = await this.address
    if (!address) {
      throw new Error("Account not created")
    }

    return address
  }

  /**
   * Disconnects the current user session and clears data.
   */
  public async disconnect(): Promise<void> {
    this.kernelClient = undefined
    this.sessionKeyAccount = undefined

    await this.webAuthnKeyStorageRepository.deleteWebAuthnKey()
  }

  public async hasAccount(): Promise<boolean> {
    return !!(await this.webAuthnKeyStorageRepository.getWebAuthnKey())
  }

  /**
   * Reconnects to an existing session using stored credentials.
   */
  public async reconnect(): Promise<Address | undefined> {
    const key = await this.webAuthnKeyStorageRepository.getWebAuthnKey()
    if (key) {
      await this.createAccountAndClient(key)

      // Ensure the account is properly initialized
      if (this.sessionKeyAccount?.address) {
        return this.sessionKeyAccount.address
      }
    }

    return undefined
  }

  /**
   * Reads data from a smart contract.
   * @param args - Parameters for the contract read operation
   * @returns Promise resolving to the contract read result
   */
  public async readContract(args: ReadContractParameters) {
    return this.publicClient.readContract(args)
  }

  /**
   * Writes data to a smart contract.
   * @param args - Parameters for the contract write operation
   * @returns Promise resolving to the user operation result
   * @throws Error if the kernel client is not initialized
   */
  public async writeContract(args: WriteContractParameters) {
    if (!this.kernelClient || !this.kernelClient.account) {
      throw new Error(KERNEL_CLIENT_NOT_INITIALIZED_ERROR)
    }

    const { abi, value, address, functionName, args: functionArgs } = args
    return await this.kernelClient.sendUserOperation({
      callData: await this.kernelClient.account.encodeCalls([
        {
          to: address,
          value: value,
          data: encodeFunctionData({
            abi,
            functionName,
            args: functionArgs,
          }),
        },
      ]),
    })
  }

  /**
   * Writes data to multiple smart contracts in a single transaction.
   * @param contracts - Array of contract write parameters
   * @returns Promise resolving to the user operation result
   * @throws Error if the kernel client is not initialized
   */
  public async writeContracts(contracts: WriteContractParameters[]) {
    if (!this.kernelClient || !this.kernelClient.account) {
      throw new Error(KERNEL_CLIENT_NOT_INITIALIZED_ERROR)
    }

    const encodedCalls = contracts.map(({ abi, address, value, functionName, args }) => ({
      to: address,
      value: value,
      data: encodeFunctionData({ abi, functionName, args }),
    }))

    return await this.kernelClient.sendUserOperation({
      callData: await this.kernelClient.account.encodeCalls(encodedCalls),
    })
  }

  /**
   * Waits for a user operation to be processed and returns the receipt.
   * @param userOperationHash - The hash of the user operation to wait for
   * @returns Promise resolving to the user operation receipt
   * @throws Error if the kernel client is not initialized
   */
  public async waitForUserOperation(userOperationHash: UserOperationHash) {
    if (!this.kernelClient) {
      throw new Error(KERNEL_CLIENT_NOT_INITIALIZED_ERROR)
    }

    return await this.kernelClient.waitForUserOperationReceipt({ hash: userOperationHash })
  }

  /**
   * Signs typed data using the kernel account.
   * @param args - Parameters for the typed data signing operation
   * @returns Promise resolving to the signature
   * @throws Error if the kernel client is not initialized
   */
  public async signTypedData(args: SignTypedDataParameters) {
    if (!this.sessionKeyAccount?.address) {
      throw new Error(KERNEL_CLIENT_NOT_INITIALIZED_ERROR)
    }

    const signature = await this.sessionKeyAccount.signTypedData(args)
    return parseSignature(signature)
  }

  /**
   * Waits for a transaction to be mined and returns the receipt.
   * @param transactionHash - The hash of the transaction to wait for
   * @returns Promise resolving to the transaction receipt
   */
  public async waitForTransaction(transactionHash: Hash) {
    return await this.publicClient.waitForTransactionReceipt({ hash: transactionHash })
  }
}

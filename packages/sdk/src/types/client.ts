import type {
  Address,
  Hash,
  PublicClient,
  ReadContractParameters,
  ReadContractReturnType,
  Signature,
  SignTypedDataParameters,
  TransactionReceipt,
  WriteContractParameters,
  WriteContractReturnType,
} from "viem"
import type { WaitForUserOperationReceiptReturnType } from "viem/account-abstraction"

/**
 * Represents a user operation hash as a hex string.
 * Used to identify and track user operations in the account abstraction system.
 */
export type UserOperationHash = `0x${string}`

/**
 * Interface defining the contract for client repository implementations.
 * Provides methods for WebAuthn authentication, account management, and blockchain interactions.
 */
export interface ClientRepositoryInterface {
  /**
   * Registers a new user with the specified username.
   * @param username - The username for the new user account
   * @returns Promise resolving to the generated WebAuthn key
   */
  register: (username: string) => Promise<Address>

  /**
   * Logs in an existing user with the specified username.
   * @param username - The username for the existing user account
   * @returns Promise resolving to the WebAuthn key
   */
  login: (username: string) => Promise<Address>

  /**
   * Disconnects the current user session and clears data.
   * @returns Promise that resolves when disconnection is complete
   */
  disconnect: () => Promise<void>

  /**
   * Reconnects to an existing session using stored credentials.
   * @returns Promise that resolves when reconnection is complete
   */
  reconnect: () => Promise<void | Address>

  /**
   * Reads data from a smart contract.
   * @param args - Parameters for the contract read operation
   * @returns Promise resolving to the contract read result
   */
  readContract: (args: ReadContractParameters) => Promise<ReadContractReturnType>

  /**
   * Writes data to a smart contract.
   * @param args - Parameters for the contract write operation
   * @returns Promise resolving to the user operation result
   */
  writeContract: (args: WriteContractParameters) => Promise<WriteContractReturnType>

  /**
   * Writes data to multiple smart contracts in a single transaction.
   * @param contracts - Array of contract write parameters
   * @returns Promise resolving to the user operation result
   */
  writeContracts: (contracts: WriteContractParameters[]) => Promise<WriteContractReturnType>

  /**
   * Waits for a user operation to be processed and returns the receipt.
   * @param userOperationHash - The hash of the user operation to wait for
   * @returns Promise resolving to the user operation receipt
   */
  waitForUserOperation: (userOperationHash: UserOperationHash) => Promise<WaitForUserOperationReceiptReturnType>

  /**
   * Public client instance for blockchain interactions.
   */
  publicClient: PublicClient

  /**
   * Signs typed data using the kernel account.
   * @param args - Parameters for the typed data signing operation
   * @returns Promise resolving to the signature
   * @throws Error if the kernel client is not initialized
   */
  signTypedData: (args: SignTypedDataParameters) => Promise<Signature>

  /**
   * Waits for a transaction to be mined and returns the receipt.
   * @param transactionHash - The hash of the transaction to wait for
   * @returns Promise resolving to the transaction receipt
   */
  waitForTransaction: (transactionHash: Hash) => Promise<TransactionReceipt>

  /**
   * The address of the kernel account.
   */
  address: Address | undefined
}

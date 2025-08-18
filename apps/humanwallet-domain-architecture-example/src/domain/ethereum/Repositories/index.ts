import type { Address } from "viem"
import { type SignTypedDataParameters, type Abi, type Signature } from "viem"
import type { Connector } from "@wagmi/core"
import type { Transaction, TransactionType } from "../Models/Transaction"
import type { WalletState } from "../Models/WalletState"
import type { TransactionList } from "../Models/TransactionList"

export type ContractArgsTypes = Array<string | bigint | number | boolean | string[] | bigint[] | object[]>

// CORE
export type WriteContractEthereumInput = {
  abi: Abi
  address: Address
  functionName: string
  args: ContractArgsTypes
  value?: bigint | undefined
  transactionType: TransactionType
}

export type WriteContractsEthereumInput = WriteContractEthereumInput[]

export type ReadContractEthereumInput = {
  abi: Abi
  address: Address
  functionName: string
  args: ContractArgsTypes
}

export type SignTypedDataEthereumInput = Omit<SignTypedDataParameters, "account">

export type WaitForTransactionEthereumInput = { transaction: Transaction }

export interface EthereumRepository {
  getWalletState: () => Promise<WalletState>
  reconnect: () => Promise<WalletState>
  disconnect: () => Promise<WalletState>
  readContract: ({ abi, address, functionName, args }: ReadContractEthereumInput) => Promise<unknown>
  writeContract: ({ abi, address, functionName, args }: WriteContractEthereumInput) => Promise<Transaction>
  signTypedData: (data: SignTypedDataEthereumInput) => Promise<Signature>
  waitForTransaction: ({ transaction }: WaitForTransactionEthereumInput) => Promise<Transaction>
}

// INJECTED WALLET
export type ConnecInjectedtEthereumRepositoryInput = { connector: Connector }
export type AddTokenToWalletInjectedEthereumRepositoryInput = { address: Address; symbol: string; decimals: number }

export interface InjectedEthereumRepository extends EthereumRepository {
  connect: ({ connector }: ConnecInjectedtEthereumRepositoryInput) => Promise<WalletState>
  switchChain: () => Promise<WalletState>
  addTokenToWallet: ({ address, symbol, decimals }: AddTokenToWalletInjectedEthereumRepositoryInput) => Promise<void>
}

// ACCOUNT ABSTRACTION
export type RegisterAccountAbstractionEthereumRepositoryInput = { username: string }
export type LoginAccountAbstractionEthereumRepositoryInput = { username: string }

export interface AccountAbstractionEthereumRepository extends EthereumRepository {
  register: ({ username }: RegisterAccountAbstractionEthereumRepositoryInput) => Promise<WalletState>
  login: ({ username }: LoginAccountAbstractionEthereumRepositoryInput) => Promise<WalletState>
  waitForUserOperation: ({ transaction }: WaitForTransactionEthereumInput) => Promise<Transaction>
  writeContracts: (contracts: WriteContractsEthereumInput) => Promise<Transaction>
}

// INDEX DB
export type GetTransactionsInput = { account: string }
export type SetTransactionInput = { transaction: Transaction }
export type CleanTransactionsInput = { account: string }
export type SetWebAuthnKeyInput = { webAuthnKey: object }

export interface LocalEthereumRepositoryInterface {
  getTransactions: ({ account }: GetTransactionsInput) => Promise<TransactionList>
  setTransaction: ({ transaction }: SetTransactionInput) => Promise<Transaction>
  cleanTransactions: ({ account }: CleanTransactionsInput) => Promise<void>
  getWebAuthnKey: () => Promise<object | undefined>
  setWebAuthnKey: ({ webAuthnKey }: SetWebAuthnKeyInput) => Promise<object>
  delWebAuthnKey: () => Promise<void>
}

// GRAPHQL
export type RegisterTransactionInput = { transaction: Transaction }
export type UpdateTransactionInput = { transaction: Transaction }

export interface RemoteEthereumRepositoryInterface {
  registerTransaction: ({ transaction }: RegisterTransactionInput) => Promise<void>
  updateTransaction: ({ transaction }: UpdateTransactionInput) => Promise<void>
}

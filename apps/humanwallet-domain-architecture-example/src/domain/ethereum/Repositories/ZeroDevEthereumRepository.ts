/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientRepository } from "sdk"
import { type Address } from "viem"
import type { Config } from "../../_config"
import type {
  AccountAbstractionEthereumRepository,
  LoginAccountAbstractionEthereumRepositoryInput,
  ReadContractEthereumInput,
  RegisterAccountAbstractionEthereumRepositoryInput,
  SignTypedDataEthereumInput,
  WaitForTransactionEthereumInput,
  WriteContractEthereumInput,
  WriteContractsEthereumInput,
} from "."
import { WalletState } from "../Models/WalletState"
import { Transaction } from "../Models/Transaction"
import { WalletConnector } from "../Models/WalletConnector"
import { DomainError } from "../../_kernel/DomainError"
import { ErrorCodes } from "../../_kernel/ErrorCodes"
import { sepolia } from "viem/chains"
import { HUMAN_WALLET_LOGO_LARGE_URL } from "../../../js/const/logos"

const AccountAbractionConnector = WalletConnector.create({
  id: "HumanWallet",
  name: "HumanWallet",
  icon: HUMAN_WALLET_LOGO_LARGE_URL,
})

export class ZeroDevEthereumRepository implements AccountAbstractionEthereumRepository {
  static create(config: Config) {
    const sdk = new ClientRepository(
      config.get("ZERODEV_BUNDLER_RPC"),
      config.get("ZERODEV_PAYMASTER_RPC"),
      config.get("ZERODEV_PASSKEY_URL"),
      sepolia,
    )

    return new ZeroDevEthereumRepository(sdk, sepolia)
  }

  constructor(
    private sdk: ClientRepository,
    private chain: any,
  ) {}

  public get account() {
    return this.sdk.address
  }

  private get connectedWalletState() {
    return WalletState.create({
      account: this.sdk.address,
      status: WalletState.STATUS.CONNECTED,
      type: WalletState.TYPES.ABSTRACTED,
      connector: AccountAbractionConnector,
    })
  }

  async getWalletState() {
    if (this.sdk.address) {
      return this.connectedWalletState
    } else {
      return WalletState.empty()
    }
  }

  async hasAccount() {
    return await this.sdk.hasAccount()
  }

  async register({ username }: RegisterAccountAbstractionEthereumRepositoryInput) {
    const address = await this.sdk.register(username)
    return WalletState.create({
      account: address,
      status: WalletState.STATUS.CONNECTED,
      type: WalletState.TYPES.ABSTRACTED,
      connector: AccountAbractionConnector,
    })
  }

  async login({ username }: LoginAccountAbstractionEthereumRepositoryInput) {
    const address = await this.sdk.login(username)

    return WalletState.create({
      account: address,
      status: WalletState.STATUS.CONNECTED,
      type: WalletState.TYPES.ABSTRACTED,
      connector: AccountAbractionConnector,
    })
  }

  async getAddress() {
    if (!this.sdk.address) {
      await this.sdk.reconnect()
    }
    return this.sdk.address
  }

  async reconnect() {
    const address = await this.sdk.reconnect()
    if (!address) return WalletState.empty()

    return WalletState.create({
      account: address,
      status: WalletState.STATUS.CONNECTED,
      type: WalletState.TYPES.ABSTRACTED,
      connector: AccountAbractionConnector,
    })
  }

  async disconnect() {
    await this.sdk.disconnect()
    return WalletState.empty()
  }

  async readContract({ abi, address, functionName, args }: ReadContractEthereumInput) {
    return await this.sdk.readContract({
      address,
      abi,
      functionName,
      args,
    })
  }

  async signTypedData({ message, primaryType, types, domain }: SignTypedDataEthereumInput) {
    if (!this.account) throw new Error("No account found")
    return await this.sdk.signTypedData({ message, primaryType, types, domain, account: this.account })
  }

  async writeContract({ abi, address, functionName, args, value, transactionType }: WriteContractEthereumInput) {
    if (!this.account) throw new Error("No account found")
    try {
      const userOpHash = await this.sdk.writeContract({
        abi,
        address,
        functionName,
        args,
        value,
        account: this.account,
        chain: this.chain,
      })

      return Transaction.create({
        userOpHash,
        account: this.account,
        type: transactionType,
        contract: address,
        functionName,
        args,
      })
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        throw DomainError.create({ code: ErrorCodes.USER_REJECTED_TRANSACTION, error })
      } else {
        throw DomainError.create({ code: ErrorCodes.TRANSACTION_ERROR, error: error as Error })
      }
    }
  }

  async writeContracts(contracts: WriteContractsEthereumInput) {
    try {
      if (!this.account) throw new Error("No account found")

      const contractsWithAccount = contracts.map((contract) => ({
        ...contract,
        account: this.account as Address,
        chain: this.chain,
      }))

      const userOpHash = await this.sdk.writeContracts(contractsWithAccount)

      const lastContract = contracts.findLast((e) => e)!
      const { address, functionName, args, transactionType } = lastContract

      return Transaction.create({
        userOpHash,
        account: this.account,
        type: transactionType,
        contract: address,
        functionName,
        args,
      })
    } catch (error) {
      if (error instanceof Error && error.name === "NotAllowedError") {
        throw DomainError.create({ code: ErrorCodes.USER_REJECTED_TRANSACTION, error })
      } else {
        throw DomainError.create({ code: ErrorCodes.TRANSACTION_ERROR, error: error as Error })
      }
    }
  }

  async waitForUserOperation({ transaction }: WaitForTransactionEthereumInput) {
    const { userOpHash } = transaction
    if (!userOpHash) throw new Error("No user operation hash provided")

    const { success, receipt } = await this.sdk.waitForUserOperation(userOpHash)
    const updatedStatus = success ? Transaction.STATUS.SUCCESS : Transaction.STATUS.REVERTED

    return Transaction.create({
      ...transaction.serialize(),
      status: updatedStatus,
      hash: receipt?.transactionHash,
    })
  }

  async waitForTransaction({ transaction }: WaitForTransactionEthereumInput): Promise<Transaction> {
    const { hash } = transaction
    if (!hash) throw new Error("No hash provided")

    const { status } = await this.sdk.waitForTransaction(hash)
    const updatedStatus = status === "success" ? Transaction.STATUS.SUCCESS : Transaction.STATUS.REVERTED

    return Transaction.create({
      ...transaction.serialize(),
      status: updatedStatus,
    })
  }
}

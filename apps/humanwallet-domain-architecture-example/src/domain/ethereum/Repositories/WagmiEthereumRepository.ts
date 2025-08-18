import {
  type Config as WagmiConfig,
  connect,
  disconnect,
  getAccount,
  getEnsName,
  switchChain,
  reconnect,
  simulateContract,
  writeContract as wagmiWriteContract,
  signTypedData as wagmiSignTypedData,
  waitForTransactionReceipt,
  watchAsset,
  readContract,
  ConnectorAlreadyConnectedError,
} from "@wagmi/core"
import type { Config } from "../../_config"
import { WalletState } from "../Models/WalletState"
import type {
  AddTokenToWalletInjectedEthereumRepositoryInput,
  ConnecInjectedtEthereumRepositoryInput,
  InjectedEthereumRepository,
  ReadContractEthereumInput,
  SignTypedDataEthereumInput,
  WaitForTransactionEthereumInput,
  WriteContractEthereumInput,
} from "."
import { Transaction } from "../Models/Transaction"
import { WalletConnector } from "../Models/WalletConnector"
import type { Hash } from "viem"
import { ContractFunctionExecutionError, parseSignature, UserRejectedRequestError, type Address } from "viem"
import { DomainError } from "../../_kernel/DomainError"
import { ErrorCodes } from "../../_kernel/ErrorCodes"

export class WagmiEthereumRepository implements InjectedEthereumRepository {
  static create(config: Config) {
    if (typeof window === "undefined") throw new Error("WagmiEthereumRepository can only be used in the browser")
    const wagmiConfig = window.wagmiConfig
    if (!wagmiConfig) throw new Error("wagmiConfig is not defined")
    return new WagmiEthereumRepository(config, wagmiConfig)
  }

  constructor(
    private readonly _config: Config,
    private readonly _wagmiConfig: WagmiConfig,
  ) {}

  get account() {
    return getAccount(this._wagmiConfig)
  }

  get ensName() {
    const { address } = this.account
    if (!address) return null
    return getEnsName(this._wagmiConfig, { address })
  }

  get configChainID() {
    return Number(this._config.get("CHAIN_ID"))
  }

  async getWalletState() {
    const { chainId, address, connector } = this.account
    if (!address || !connector) return WalletState.empty()
    const isCorrectChain = chainId === Number(this._config.get("CHAIN_ID"))
    const status = isCorrectChain ? WalletState.STATUS.CONNECTED : WalletState.STATUS.WRONG_CHAIN

    return WalletState.create({
      account: address,
      status,
      type: WalletState.TYPES.INJECTED,
      connector: WalletConnector.createFromConnector({ connector }),
    })
  }

  async connect({ connector }: ConnecInjectedtEthereumRepositoryInput) {
    try {
      await connect(this._wagmiConfig, { connector })
      return await this.getWalletState()
    } catch (e) {
      if (e instanceof ConnectorAlreadyConnectedError) {
        return this.reconnect()
      }
      return WalletState.empty()
    }
  }

  async disconnect() {
    try {
      await disconnect(this._wagmiConfig)
      return WalletState.empty()
    } catch (e) {
      console.error(e)
      return WalletState.empty()
    }
  }

  async reconnect() {
    try {
      await reconnect(this._wagmiConfig)
      return await this.getWalletState()
    } catch {
      return WalletState.empty()
    }
  }

  async switchChain() {
    try {
      const appChainID = this.configChainID
      const availableChains = this._wagmiConfig.chains
      const chainId = availableChains.find((chain) => chain.id === appChainID)?.id
      if (!chainId) throw new Error(`Chain ID "${appChainID}" is not available`)
      await switchChain(this._wagmiConfig, { chainId })
      return await this.getWalletState()
    } catch (e) {
      console.error(e)
      return WalletState.empty()
    }
  }

  async readContract({ abi, address, functionName, args }: ReadContractEthereumInput) {
    try {
      const result = await readContract(this._wagmiConfig, {
        abi,
        address: address as `0x${string}`,
        functionName,
        args,
      })

      return result
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error("readContract error")
      }
    }
  }

  async signTypedData({ message, primaryType, types, domain }: SignTypedDataEthereumInput) {
    try {
      const { address: account } = this.account
      if (!account) throw new Error("Account not found")

      const result = await wagmiSignTypedData(this._wagmiConfig, {
        account,
        message,
        primaryType,
        types,
        domain,
      })
      return parseSignature(result as Address)
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        if (error.walk((err) => err instanceof UserRejectedRequestError)) {
          throw DomainError.create({ code: ErrorCodes.USER_REJECTED_SIGNATURE, error })
        }
        if (error instanceof Error) {
          throw DomainError.create({ code: ErrorCodes.SIGNATURE_ERROR, error })
        }
      }
      throw DomainError.create({ code: ErrorCodes.SIGNATURE_ERROR, error: error as Error })
    }
  }

  async writeContract({ abi, address, functionName, args, transactionType }: WriteContractEthereumInput) {
    try {
      const { address: account } = this.account
      if (!account) throw new Error("Account not found")

      const { request } = await simulateContract(this._wagmiConfig, {
        abi,
        address,
        functionName,
        args,
      })

      const hash = await wagmiWriteContract(this._wagmiConfig, request)
      return Transaction.create({
        account,
        hash,
        type: transactionType,
        contract: address,
        functionName,
        args,
      })
    } catch (error) {
      if (error instanceof ContractFunctionExecutionError) {
        if (error.walk((err) => err instanceof UserRejectedRequestError)) {
          throw DomainError.create({ code: ErrorCodes.USER_REJECTED_TRANSACTION, error })
        }
        if (error instanceof Error) {
          throw DomainError.create({ code: ErrorCodes.TRANSACTION_ERROR, error })
        }
      }
      throw DomainError.create({ code: ErrorCodes.TRANSACTION_ERROR, error: error as Error })
    }
  }

  async waitForTransaction({ transaction }: WaitForTransactionEthereumInput) {
    try {
      const transactionReceipt = await waitForTransactionReceipt(this._wagmiConfig, {
        hash: transaction.hash as Hash,
      })

      const status = transactionReceipt.status === "success" ? Transaction.STATUS.SUCCESS : Transaction.STATUS.REVERTED

      return Transaction.create({ ...transaction.serialize(), status })
    } catch {
      return Transaction.create({ ...transaction.serialize(), status: Transaction.STATUS.REVERTED })
    }
  }

  async addTokenToWallet({ address, symbol, decimals }: AddTokenToWalletInjectedEthereumRepositoryInput) {
    await watchAsset(this._wagmiConfig, {
      type: "ERC20",
      options: {
        address,
        symbol,
        decimals,
      },
    })
  }
}

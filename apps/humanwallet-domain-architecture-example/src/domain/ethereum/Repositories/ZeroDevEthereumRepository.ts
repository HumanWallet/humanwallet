/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPublicClient, encodeFunctionData, http, parseSignature } from "viem"
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  getUserOperationGasPrice,
} from "@zerodev/sdk"
import {
  PasskeyValidatorContractVersion,
  WebAuthnMode,
  toPasskeyValidator,
  toWebAuthnKey,
} from "@zerodev/passkey-validator"
import { KERNEL_V3_1, getEntryPoint } from "@zerodev/sdk/constants"
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
import { IDBEthereumRepository } from "./IDBEthereumRepository"
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
    const bundlerTransport = http(config.get("ZERODEV_BUNDLER_RPC"))
    const paymasterTransport = http(config.get("ZERODEV_PAYMASTER_RPC"))
    const publicClient = createPublicClient({ transport: bundlerTransport, chain: sepolia })
    const idb = IDBEthereumRepository.create()
    const paymasterClient = createZeroDevPaymasterClient({
      chain: sepolia,
      transport: paymasterTransport,
    })

    return new ZeroDevEthereumRepository(config, idb, sepolia, publicClient, bundlerTransport, paymasterClient)
  }

  constructor(
    private config: Config,
    private idb: IDBEthereumRepository,
    private chain: any,
    private publicClient: any,
    private bundlerTransport: any,
    private paymasterClient: any,
  ) {}

  private get connectedWalletState() {
    return WalletState.create({
      account: window.kernelAccount.address,
      status: WalletState.STATUS.CONNECTED,
      type: WalletState.TYPES.ABSTRACTED,
      connector: AccountAbractionConnector,
    })
  }

  async getWalletState() {
    if (window.kernelAccount && window.kernelClient) {
      return this.connectedWalletState
    } else {
      return WalletState.empty()
    }
  }

  async register({ username }: RegisterAccountAbstractionEthereumRepositoryInput) {
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: username,
      passkeyServerUrl: this.config.get("ZERODEV_PASSKEY_URL"),
      mode: WebAuthnMode.Register,
      passkeyServerHeaders: {},
    })

    await this.idb.setWebAuthnKey(webAuthnKey)

    const passkeyValidator = await this.getPasskeyValidator(webAuthnKey)

    await this.createAccountAndClient(passkeyValidator)

    return this.connectedWalletState
  }

  async login({ username }: LoginAccountAbstractionEthereumRepositoryInput) {
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: username,
      passkeyServerUrl: this.config.get("ZERODEV_PASSKEY_URL"),
      mode: WebAuthnMode.Login,
      passkeyServerHeaders: {},
    })

    await this.idb.setWebAuthnKey(webAuthnKey)

    const passkeyValidator = await this.getPasskeyValidator(webAuthnKey)

    await this.createAccountAndClient(passkeyValidator)

    return this.connectedWalletState
  }

  async reconnect() {
    const webAuthnKey = await this.idb.getWebAuthnKey()
    if (!webAuthnKey) return WalletState.empty()

    try {
      const passkeyValidator = await this.getPasskeyValidator(webAuthnKey)
      await this.createAccountAndClient(passkeyValidator)
      return this.connectedWalletState
    } catch (error) {
      console.error(error)
      return WalletState.empty()
    }
  }

  async disconnect() {
    await this.idb.delWebAuthnKey()
    return WalletState.empty()
  }

  async readContract({ abi, address, functionName, args }: ReadContractEthereumInput) {
    const result = await this.publicClient.readContract({
      address,
      abi,
      functionName,
      args,
    })

    return result
  }

  async signTypedData({ message, primaryType, types, domain }: SignTypedDataEthereumInput) {
    const signature = await window.kernelAccount.signTypedData({
      account: window.kernelAccount.address,
      message,
      primaryType,
      types,
      domain,
    })
    return parseSignature(signature)
  }

  async writeContract({ abi, address, functionName, args, value, transactionType }: WriteContractEthereumInput) {
    try {
      const userOpHash = await window.kernelClient.sendUserOperation({
        callData: await window.kernelClient.account.encodeCalls([
          {
            to: address,
            value: value || BigInt(0),
            data: encodeFunctionData({
              abi,
              functionName,
              args,
            }),
          },
        ]),
      })

      return Transaction.create({
        userOpHash,
        account: window.kernelAccount.address,
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
      const callData = await window.kernelClient.account.encodeCalls(
        contracts.map(({ abi, address, value, functionName, args }) => {
          return {
            to: address,
            value: value || BigInt(0),
            data: encodeFunctionData({
              abi: abi,
              functionName: functionName,
              args: args,
            }),
          }
        }),
      )

      const userOpHash = await window.kernelClient.sendUserOperation({
        callData,
      })

      const lastContract = contracts.findLast((e) => e)!
      const { address, functionName, args, transactionType } = lastContract

      return Transaction.create({
        userOpHash,
        account: window.kernelAccount.address,
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
    const { userOpHash, hash } = transaction
    if (hash) return transaction

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const { receipt } = await window.kernelClient.waitForUserOperationReceipt({
          hash: userOpHash,
          timeout: 1000 * 60,
        })
        return Transaction.create({
          ...transaction.serialize(),
          hash: receipt.transactionHash,
        })
      } catch (error) {
        console.error(error)
        if (attempt === 3) return transaction
      }
    }

    return transaction
  }

  async waitForTransaction({ transaction }: WaitForTransactionEthereumInput): Promise<Transaction> {
    const { hash } = transaction
    if (!hash) throw new Error("No hash provided")

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const transactionReceipt = await this.publicClient.waitForTransactionReceipt({ hash })
        const status =
          transactionReceipt.status === "success" ? Transaction.STATUS.SUCCESS : Transaction.STATUS.REVERTED

        return Transaction.create({
          ...transaction.serialize(),
          status,
        })
      } catch (error) {
        console.error(error)
        if (attempt === 3) return transaction
      }
    }

    return transaction
  }

  private async createAccountAndClient(passkeyValidator: any) {
    window.kernelAccount = await createKernelAccount(this.publicClient, {
      entryPoint: getEntryPoint("0.7"),
      plugins: {
        sudo: passkeyValidator,
      },
      kernelVersion: KERNEL_V3_1,
    })

    console.log("Kernel account created: ", window.kernelAccount.address)

    const paymasterClient = this.paymasterClient

    window.kernelClient = createKernelAccountClient({
      account: window.kernelAccount,
      chain: this.chain,
      client: this.publicClient,
      bundlerTransport: this.bundlerTransport,
      paymaster: {
        getPaymasterData(userOperation) {
          return paymasterClient.sponsorUserOperation({ userOperation })
        },
      },
      userOperation: {
        estimateFeesPerGas: async ({ bundlerClient }) => {
          return getUserOperationGasPrice(bundlerClient)
        },
      },
    })
  }

  private async getPasskeyValidator(webAuthnKey: any) {
    const passkeyValidator = await toPasskeyValidator(this.publicClient, {
      webAuthnKey,
      entryPoint: getEntryPoint("0.7"),
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
    })

    return passkeyValidator
  }
}

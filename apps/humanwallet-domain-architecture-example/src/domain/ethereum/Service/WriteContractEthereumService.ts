import type { Config } from "../../_config/index.js"
import type { Service } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type {
  AccountAbstractionEthereumRepository,
  InjectedEthereumRepository,
  WriteContractEthereumInput,
} from "../Repositories/index.js"
import type { Transaction } from "../Models/Transaction.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"
import { SetTransactionEthereumService } from "./SetTransactionEthereumService.js"
import { dispatchDomainEvent, DomainEvents } from "../../_kernel/Events.js"
import { DomainError } from "../../_kernel/DomainError.js"
import { ErrorCodes } from "../../_kernel/ErrorCodes.js"

export class WriteContractEthereumService implements Service<WriteContractEthereumInput, Transaction> {
  static create({ config }: { config: Config }) {
    return new WriteContractEthereumService(
      GetWalletStateEthereumService.create({ config }),
      WagmiEthereumRepository.create(config),
      ZeroDevEthereumRepository.create(config),
      SetTransactionEthereumService.create({ config }),
    )
  }

  constructor(
    private readonly walletService: GetWalletStateEthereumService,
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
    private readonly setTransactionService: SetTransactionEthereumService,
  ) {}
  async execute({
    abi,
    address,
    functionName,
    args,
    value,
    transactionType,
  }: WriteContractEthereumInput): Promise<Transaction> {
    const { type } = await this.walletService.execute()

    dispatchDomainEvent(DomainEvents.SUBMIT_TRANSACTION, { transactionType })

    try {
      let transaction
      if (type === WalletState.TYPES.INJECTED)
        transaction = await this.injectedRepository.writeContract({
          abi,
          address,
          functionName,
          args,
          value,
          transactionType,
        })

      if (type === WalletState.TYPES.ABSTRACTED)
        transaction = await this.accountAbstractionRepository.writeContract({
          abi,
          address,
          functionName,
          args,
          value,
          transactionType,
        })

      if (transaction) {
        await this.setTransactionService.execute({ transaction })
        return transaction
      }
    } catch (error) {
      console.error(error)
      if (error instanceof DomainError) dispatchDomainEvent(DomainEvents.ERROR, { domainError: error })
      throw error
    }

    throw DomainError.create({ code: ErrorCodes.TRANSACTION_ERROR })
  }
}

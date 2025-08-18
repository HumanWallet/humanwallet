import { Config } from "../../_config/index.js"
import { Service } from "../../_kernel/architecture.js"
import {
  AccountAbstractionEthereumRepository,
  WriteContractEthereumInput,
  WriteContractsEthereumInput,
} from "../Repositories/index.js"
import { Transaction } from "../Models/Transaction.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"
import { SetTransactionEthereumService } from "./SetTransactionEthereumService.js"
import { dispatchDomainEvent, DomainEvents } from "../../_kernel/Events.js"
import { DomainError } from "../../_kernel/DomainError.js"
import { ErrorCodes } from "../../_kernel/ErrorCodes.js"

export class WriteContractsEthereumService implements Service<WriteContractEthereumInput[], Transaction> {
  static create({ config }: { config: Config }) {
    return new WriteContractsEthereumService(
      GetWalletStateEthereumService.create({ config }),
      ZeroDevEthereumRepository.create(config),
      SetTransactionEthereumService.create({ config }),
    )
  }

  constructor(
    private readonly walletService: GetWalletStateEthereumService,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
    private readonly setTransactionService: SetTransactionEthereumService,
  ) {}
  async execute(contracts: WriteContractsEthereumInput): Promise<Transaction> {
    const { type } = await this.walletService.execute()

    if (type === WalletState.TYPES.INJECTED) throw new Error("Injected wallet not supported")

    if (type === WalletState.TYPES.ABSTRACTED) {
      const transactionType = contracts.at(0)!.transactionType
      dispatchDomainEvent(DomainEvents.SUBMIT_TRANSACTION, { transactionType })

      try {
        const transaction = await this.accountAbstractionRepository.writeContracts(contracts)
        await this.setTransactionService.execute({ transaction })
        return transaction
      } catch (error) {
        if (error instanceof DomainError) dispatchDomainEvent(DomainEvents.ERROR, { domainError: error })
        throw error
      }
    }

    throw DomainError.create({ code: ErrorCodes.TRANSACTION_ERROR })
  }
}

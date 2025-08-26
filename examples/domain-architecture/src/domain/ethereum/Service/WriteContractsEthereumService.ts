import type { Service } from "../../_kernel/architecture.js"
import type {
  AccountAbstractionEthereumRepository,
  WriteContractEthereumInput,
  WriteContractsEthereumInput,
} from "../Repositories/index.js"
import type { Transaction } from "../Models/Transaction.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"
import { SetTransactionEthereumService } from "./SetTransactionEthereumService.js"
import { dispatchDomainEvent, DomainEvents } from "../../_kernel/Events.js"
import { DomainError } from "../../_kernel/DomainError.js"
import { ErrorCodes } from "../../_kernel/ErrorCodes.js"
import type { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"

export class WriteContractsEthereumService implements Service<WriteContractEthereumInput[], Transaction> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new WriteContractsEthereumService(
      GetWalletStateEthereumService.create({ repositories }),
      repositories.ZeroDevEthereumRepository,
      SetTransactionEthereumService.create({ repositories }),
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

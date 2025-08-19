import type { Service } from "../../_kernel/architecture.js"
import type { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import { Transaction } from "../Models/Transaction.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import { dispatchDomainEvent, DomainEvents } from "../../_kernel/Events.js"
import type { LocalEthereumRepositoryInterface } from "../Repositories/index.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export type SetTransactionEthereumServiceInput = {
  transaction: Transaction
}

export class SetTransactionEthereumService implements Service<SetTransactionEthereumServiceInput, Transaction> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new SetTransactionEthereumService(
      GetWalletStateEthereumService.create({ repositories }),
      repositories.IDBEthereumRepository,
    )
  }

  constructor(
    private readonly walletService: GetWalletStateEthereumService,
    private readonly storage: LocalEthereumRepositoryInterface,
  ) {}

  async execute({ transaction }: SetTransactionEthereumServiceInput): Promise<Transaction> {
    const { account } = await this.walletService.execute()
    if (!account) throw new Error("User account not found")

    await this.storage.setTransaction({ transaction })

    dispatchDomainEvent(DomainEvents.SET_TRANSACTION, { transaction })

    if (transaction.status === Transaction.STATUS.SUCCESS) {
      dispatchDomainEvent(DomainEvents.SUCCESS_TRANSACTION, { transaction })
    }
    if (transaction.status === Transaction.STATUS.REVERTED) {
      dispatchDomainEvent(DomainEvents.REVERTED_TRANSACTION, { transaction })
    }

    return transaction
  }
}

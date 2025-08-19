import type { UseCase } from "../../_kernel/architecture.js"
import type { Transaction } from "../Models/Transaction.js"
import { WalletState } from "../Models/WalletState.js"
import type { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import type { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"
import { SetTransactionEthereumService } from "../Service/SetTransactionEthereumService.js"

export interface WaitForTransactionEthereumUseCaseInput {
  transaction: Transaction
}

export class WaitForTransactionEthereumUseCase implements UseCase<WaitForTransactionEthereumUseCaseInput, Transaction> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new WaitForTransactionEthereumUseCase(
      repositories.WagmiEthereumRepository,
      repositories.ZeroDevEthereumRepository,
      GetWalletStateEthereumService.create({ repositories }),
      SetTransactionEthereumService.create({ repositories }),
    )
  }

  constructor(
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
    private readonly walletService: GetWalletStateEthereumService,
    private readonly setTransactionService: SetTransactionEthereumService,
  ) {}

  async execute({ transaction }: WaitForTransactionEthereumUseCaseInput): Promise<Transaction> {
    const { type } = await this.walletService.execute()

    let finishedTransaction
    if (type === WalletState.TYPES.INJECTED) {
      finishedTransaction = await this.injectedRepository.waitForTransaction({ transaction })
    } else if (type === WalletState.TYPES.ABSTRACTED) {
      console.log("waitForTransaction", transaction)
      if (transaction.hash) {
        finishedTransaction = await this.accountAbstractionRepository.waitForTransaction({ transaction })
      } else if (transaction.userOpHash) {
        const finishedUserOpTransaction = await this.accountAbstractionRepository.waitForUserOperation({ transaction })

        if (finishedUserOpTransaction.hash) {
          finishedTransaction = await this.accountAbstractionRepository.waitForTransaction({
            transaction: finishedUserOpTransaction,
          })
        } else {
          throw new Error("Transaction hash or userOpHash is required")
        }
      } else {
        throw new Error("Transaction hash or userOpHash is required")
      }
    }

    if (!finishedTransaction) throw new Error("Transaction not found")

    await this.setTransactionService.execute({ transaction: finishedTransaction })
    return finishedTransaction
  }
}

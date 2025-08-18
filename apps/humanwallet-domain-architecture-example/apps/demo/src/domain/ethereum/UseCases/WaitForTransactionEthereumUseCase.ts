import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { Transaction } from "../Models/Transaction.js"
import { WalletState } from "../Models/WalletState.js"
import { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"
import { SetTransactionEthereumService } from "../Service/SetTransactionEthereumService.js"

export interface WaitForTransactionEthereumUseCaseInput {
  transaction: Transaction
}

export class WaitForTransactionEthereumUseCase implements UseCase<WaitForTransactionEthereumUseCaseInput, Transaction> {
  static create({ config }: { config: Config }) {
    return new WaitForTransactionEthereumUseCase(
      WagmiEthereumRepository.create(config),
      ZeroDevEthereumRepository.create(config),
      GetWalletStateEthereumService.create({ config }),
      SetTransactionEthereumService.create({ config }),
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

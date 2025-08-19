import type { UseCase } from "../../_kernel/architecture.js"
import type { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"
import type { TransactionList } from "../Models/TransactionList.js"
import type { LocalEthereumRepositoryInterface } from "../Repositories/index.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export type GetTransactionsEthereumUseCaseOutput = TransactionList

export class GetTransactionsEthereumUseCase implements UseCase<void, GetTransactionsEthereumUseCaseOutput> {
  static create({
    repositories,
  }: {
    repositories: {
      IDBEthereumRepository: IDBEthereumRepository
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new GetTransactionsEthereumUseCase(
      repositories.IDBEthereumRepository,
      GetWalletStateEthereumService.create({
        repositories: {
          WagmiEthereumRepository: repositories.WagmiEthereumRepository,
          ZeroDevEthereumRepository: repositories.ZeroDevEthereumRepository,
        },
      }),
    )
  }

  constructor(
    private readonly storageRepository: LocalEthereumRepositoryInterface,
    private readonly walletEthereumService: GetWalletStateEthereumService,
  ) {}

  async execute(): Promise<GetTransactionsEthereumUseCaseOutput> {
    const { account } = await this.walletEthereumService.execute()
    if (!account) throw new Error("User account not found")
    return await this.storageRepository.getTransactions({ account })
  }
}

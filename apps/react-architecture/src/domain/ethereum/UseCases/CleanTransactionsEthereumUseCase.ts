import type { UseCase } from "../../_kernel/architecture.js"
import { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import type { LocalEthereumRepositoryInterface } from "../Repositories/index.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"

export class CleanTransactionsEthereumUseCase implements UseCase<void, void> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new CleanTransactionsEthereumUseCase(
      IDBEthereumRepository.create(),
      GetWalletStateEthereumService.create({ repositories }),
    )
  }

  constructor(
    private readonly storage: LocalEthereumRepositoryInterface,
    private readonly walletService: GetWalletStateEthereumService,
  ) {}

  async execute(): Promise<void> {
    const { account } = await this.walletService.execute()
    if (!account) throw new Error("User account not found")
    await this.storage.cleanTransactions({ account })
  }
}

import type { Config } from "../../_config/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import type { LocalEthereumRepositoryInterface } from "../Repositories/index.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"

export class CleanTransactionsEthereumUseCase implements UseCase<void, void> {
  static create({ config }: { config: Config }) {
    return new CleanTransactionsEthereumUseCase(
      IDBEthereumRepository.create(),
      GetWalletStateEthereumService.create({ config }),
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

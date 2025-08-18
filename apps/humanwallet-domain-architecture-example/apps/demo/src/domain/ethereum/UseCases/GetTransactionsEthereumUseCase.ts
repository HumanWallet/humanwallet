import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"
import { TransactionList } from "../Models/TransactionList.js"
import { LocalEthereumRepositoryInterface } from "../Repositories/index.js"

export type GetTransactionsEthereumUseCaseOutput = TransactionList

export class GetTransactionsEthereumUseCase implements UseCase<void, GetTransactionsEthereumUseCaseOutput> {
  static create({ config }: { config: Config }) {
    return new GetTransactionsEthereumUseCase(
      IDBEthereumRepository.create(),
      GetWalletStateEthereumService.create({ config }),
    )
  }

  constructor(
    private readonly storage: LocalEthereumRepositoryInterface,
    private readonly walletService: GetWalletStateEthereumService,
  ) {}

  async execute(): Promise<GetTransactionsEthereumUseCaseOutput> {
    const { account } = await this.walletService.execute()
    if (!account) throw new Error("User account not found")
    return await this.storage.getTransactions({ account })
  }
}

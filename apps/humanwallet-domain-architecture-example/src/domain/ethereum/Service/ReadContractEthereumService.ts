import type { Service } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type {
  AccountAbstractionEthereumRepository,
  InjectedEthereumRepository,
  ReadContractEthereumInput,
} from "../Repositories/index.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"

export class ReadContractEthereumService implements Service<ReadContractEthereumInput, unknown> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new ReadContractEthereumService(
      GetWalletStateEthereumService.create({ repositories }),
      repositories.WagmiEthereumRepository,
      repositories.ZeroDevEthereumRepository,
    )
  }

  constructor(
    private readonly walletService: GetWalletStateEthereumService,
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
  ) {}
  async execute({ abi, address, functionName, args }: ReadContractEthereumInput): Promise<unknown> {
    const { type } = await this.walletService.execute()

    if (type === WalletState.TYPES.INJECTED)
      return await this.injectedRepository.readContract({ abi, address, functionName, args })

    if (type === WalletState.TYPES.ABSTRACTED)
      return await this.accountAbstractionRepository.readContract({
        abi,
        address,
        functionName,
        args,
      })

    throw new Error("Wallet not found")
  }
}

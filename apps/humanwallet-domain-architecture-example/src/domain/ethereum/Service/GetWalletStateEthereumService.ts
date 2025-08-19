import type { Service } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"
import type { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export class GetWalletStateEthereumService implements Service<void, WalletState> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new GetWalletStateEthereumService(
      repositories.WagmiEthereumRepository,
      repositories.ZeroDevEthereumRepository,
    )
  }

  constructor(
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
  ) {}

  async execute(): Promise<WalletState> {
    const address = await (await this.accountAbstractionRepository.getWalletState()).account

    if (address) {
      return await this.accountAbstractionRepository.getWalletState()
    } else {
      return await this.injectedRepository.getWalletState()
    }
  }
}

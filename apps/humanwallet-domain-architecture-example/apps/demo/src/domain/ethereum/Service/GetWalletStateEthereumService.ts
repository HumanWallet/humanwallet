import { Service } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"
import { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

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
    const accountAbstractionRepository = this.repositories

    if (webAuthnKey) {
      const walletState = await this.accountAbstractionRepository.getWalletState()
      return walletState
    } else {
      return await this.injectedRepository.getWalletState()
    }
  }
}

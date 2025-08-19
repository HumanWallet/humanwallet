import type { UseCase } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"

export class SwitchChainEthereumUseCase implements UseCase<void, WalletState> {
  static create({ repositories }: { repositories: { WagmiEthereumRepository: WagmiEthereumRepository } }) {
    return new SwitchChainEthereumUseCase(repositories.WagmiEthereumRepository)
  }

  constructor(private readonly injectedRepository: WagmiEthereumRepository) {}

  async execute(): Promise<WalletState> {
    return await this.injectedRepository.switchChain()
  }
}

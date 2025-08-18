import type { Config } from "../../_config/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"

export class SwitchChainEthereumUseCase implements UseCase<void, WalletState> {
  static create({ config }: { config: Config }) {
    return new SwitchChainEthereumUseCase(WagmiEthereumRepository.create(config))
  }

  constructor(private readonly repository: WagmiEthereumRepository) {}

  async execute(): Promise<WalletState> {
    return await this.repository.switchChain()
  }
}

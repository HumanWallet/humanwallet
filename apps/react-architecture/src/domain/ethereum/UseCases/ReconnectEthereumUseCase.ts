import type { UseCase } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import type { EthereumRepository } from "../Repositories/index.js"
import type { WalletState } from "../Models/WalletState.js"

export class ReconnectEthereumUseCase implements UseCase<void, WalletState> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new ReconnectEthereumUseCase(repositories.WagmiEthereumRepository, repositories.ZeroDevEthereumRepository)
  }

  constructor(
    private readonly injectedRepository: EthereumRepository,
    private readonly accountAbstractionRepository: ZeroDevEthereumRepository,
  ) {}

  async execute(): Promise<WalletState> {
    const hasAccount = await this.accountAbstractionRepository.hasAccount()

    if (hasAccount) {
      return await this.accountAbstractionRepository.reconnect()
    } else {
      return await this.injectedRepository.reconnect()
    }
  }
}

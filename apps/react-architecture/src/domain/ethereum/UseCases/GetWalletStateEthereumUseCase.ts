import type { UseCase } from "../../_kernel/architecture.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"
import type { WalletState } from "../Models/WalletState.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export class GetWalletStateEthereumUseCase implements UseCase<void, WalletState> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new GetWalletStateEthereumUseCase(GetWalletStateEthereumService.create({ repositories }))
  }

  constructor(private readonly service: GetWalletStateEthereumService) {}

  async execute(): Promise<WalletState> {
    return await this.service.execute()
  }
}

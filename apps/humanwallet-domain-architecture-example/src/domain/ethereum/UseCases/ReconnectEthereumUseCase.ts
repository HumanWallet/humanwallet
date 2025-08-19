import type { UseCase } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import type { AccountAbstractionEthereumRepository, EthereumRepository } from "../Repositories/index.js"
import type { WalletState } from "../Models/WalletState.js"
import type { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"

export class ReconnectEthereumUseCase implements UseCase<void, WalletState> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new ReconnectEthereumUseCase(
      repositories.WagmiEthereumRepository,
      repositories.ZeroDevEthereumRepository,
      repositories.IDBEthereumRepository,
    )
  }

  constructor(
    private readonly injectedRepository: EthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
    private readonly idbRepository: IDBEthereumRepository,
  ) {}

  async execute(): Promise<WalletState> {
    const webAuthnKey = await this.idbRepository.getWebAuthnKey()

    if (webAuthnKey) {
      const walletState = await this.accountAbstractionRepository.reconnect()
      return walletState
    } else {
      return await this.injectedRepository.reconnect()
    }
  }
}

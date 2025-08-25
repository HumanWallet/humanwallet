import type { UseCase } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"
import type { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import type { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export class DisconnectEthereumUseCase implements UseCase<void, WalletState> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new DisconnectEthereumUseCase(
      repositories.IDBEthereumRepository,
      repositories.WagmiEthereumRepository,
      repositories.ZeroDevEthereumRepository,
    )
  }

  constructor(
    private readonly idb: IDBEthereumRepository,
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
  ) {}

  async execute(): Promise<WalletState> {
    const webAuthnKey = await this.idb.getWebAuthnKey()

    if (webAuthnKey) {
      return await this.accountAbstractionRepository.disconnect()
    } else {
      return await this.injectedRepository.disconnect()
    }
  }
}

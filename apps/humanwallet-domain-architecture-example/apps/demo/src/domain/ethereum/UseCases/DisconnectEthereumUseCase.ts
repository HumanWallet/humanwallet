import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"
import { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export class DisconnectEthereumUseCase implements UseCase<void, WalletState> {
  static create({ config }: { config: Config }) {
    return new DisconnectEthereumUseCase(
      IDBEthereumRepository.create(),
      WagmiEthereumRepository.create(config),
      ZeroDevEthereumRepository.create(config),
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

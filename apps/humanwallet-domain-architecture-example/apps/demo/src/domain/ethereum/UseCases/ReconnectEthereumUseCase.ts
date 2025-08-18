import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { AccountAbstractionEthereumRepository, EthereumRepository } from "../Repositories/index.js"
import { WalletState } from "../Models/WalletState.js"
import { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"

export class ReconnectEthereumUseCase implements UseCase<void, WalletState> {
  constructor(
    private readonly injectedRepository: EthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
    private readonly idb: IDBEthereumRepository,
  ) {}

  static create({ config }: { config: Config }) {
    return new ReconnectEthereumUseCase(
      WagmiEthereumRepository.create(config),
      ZeroDevEthereumRepository.create(config),
      IDBEthereumRepository.create(),
    )
  }

  async execute(): Promise<WalletState> {
    const webAuthnKey = await this.idb.getWebAuthnKey()

    if (webAuthnKey) {
      const walletState = await this.accountAbstractionRepository.reconnect()
      return walletState
    } else {
      return await this.injectedRepository.reconnect()
    }
  }
}

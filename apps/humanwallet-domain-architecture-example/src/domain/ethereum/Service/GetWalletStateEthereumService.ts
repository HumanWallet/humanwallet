import type { Config } from "../../_config/index.js"
import type { Service } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"
import { IDBEthereumRepository } from "../Repositories/IDBEthereumRepository.js"
import type { AccountAbstractionEthereumRepository, InjectedEthereumRepository } from "../Repositories/index.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"

export class GetWalletStateEthereumService implements Service<void, WalletState> {
  static create({ config }: { config: Config }) {
    return new GetWalletStateEthereumService(
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
      const walletState = await this.accountAbstractionRepository.getWalletState()
      return walletState
    } else {
      return await this.injectedRepository.getWalletState()
    }
  }
}

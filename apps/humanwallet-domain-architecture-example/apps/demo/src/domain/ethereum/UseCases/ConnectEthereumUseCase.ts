import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import { type Connector } from "@wagmi/core"
import { WalletState } from "../Models/WalletState.js"

export interface ConnectEthereumUseCaseInput {
  connector: Connector
}

export class ConnectEthereumUseCase implements UseCase<ConnectEthereumUseCaseInput, WalletState> {
  static create({ config }: { config: Config }) {
    return new ConnectEthereumUseCase(WagmiEthereumRepository.create(config))
  }

  constructor(private readonly repository: WagmiEthereumRepository) {}

  async execute({ connector }: ConnectEthereumUseCaseInput): Promise<WalletState> {
    if (!connector) {
      console.error("ConnectEthereumUseCase: no connector provided")
      return WalletState.empty()
    }

    const walletState = await this.repository.connect({ connector })

    return walletState
  }
}

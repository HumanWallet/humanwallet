import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"

export interface LoginEthereumUseCaseInput {
  username: string
}

export class LoginEthereumUseCase implements UseCase<LoginEthereumUseCaseInput, WalletState> {
  static create({ config }: { config: Config }) {
    return new LoginEthereumUseCase(ZeroDevEthereumRepository.create(config))
  }

  constructor(private readonly repository: ZeroDevEthereumRepository) {}

  async execute({ username }: LoginEthereumUseCaseInput): Promise<WalletState> {
    return await this.repository.login({ username })
  }
}

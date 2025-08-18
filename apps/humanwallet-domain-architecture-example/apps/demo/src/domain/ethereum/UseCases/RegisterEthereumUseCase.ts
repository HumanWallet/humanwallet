import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"

export interface RegisterEthereumUseCaseInput {
  username: string
}

export class RegisterEthereumUseCase implements UseCase<RegisterEthereumUseCaseInput, WalletState> {
  static create({ config }: { config: Config }) {
    return new RegisterEthereumUseCase(ZeroDevEthereumRepository.create(config))
  }

  constructor(private readonly repository: ZeroDevEthereumRepository) {}

  async execute({ username }: RegisterEthereumUseCaseInput): Promise<WalletState> {
    return await this.repository.register({ username })
  }
}

import type { UseCase } from "../../_kernel/architecture.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"

export interface LoginEthereumUseCaseInput {
  username: string
}

export class LoginEthereumUseCase implements UseCase<LoginEthereumUseCaseInput, WalletState> {
  static create({ repositories }: { repositories: { ZeroDevEthereumRepository: ZeroDevEthereumRepository } }) {
    return new LoginEthereumUseCase(repositories.ZeroDevEthereumRepository)
  }

  constructor(private readonly abstractedRepository: ZeroDevEthereumRepository) {}

  async execute({ username }: LoginEthereumUseCaseInput): Promise<WalletState> {
    return await this.abstractedRepository.login({ username })
  }
}

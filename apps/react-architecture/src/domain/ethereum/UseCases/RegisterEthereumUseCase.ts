import type { UseCase } from "../../_kernel/architecture.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import type { WalletState } from "../Models/WalletState.js"

export interface RegisterEthereumUseCaseInput {
  username: string
}

export class RegisterEthereumUseCase implements UseCase<RegisterEthereumUseCaseInput, WalletState> {
  static create({ repositories }: { repositories: { ZeroDevEthereumRepository: ZeroDevEthereumRepository } }) {
    return new RegisterEthereumUseCase(repositories.ZeroDevEthereumRepository)
  }

  constructor(private readonly accountAbstractionRepository: ZeroDevEthereumRepository) {}

  async execute({ username }: RegisterEthereumUseCaseInput): Promise<WalletState> {
    return await this.accountAbstractionRepository.register({ username })
  }
}

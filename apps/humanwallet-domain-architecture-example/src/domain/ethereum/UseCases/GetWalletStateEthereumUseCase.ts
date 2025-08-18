import type { Config } from "../../_config/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import { GetWalletStateEthereumService } from "../Service/GetWalletStateEthereumService.js"
import type { WalletState } from "../Models/WalletState.js"

export class GetWalletStateEthereumUseCase implements UseCase<void, WalletState> {
  static create({ config }: { config: Config }) {
    return new GetWalletStateEthereumUseCase(GetWalletStateEthereumService.create({ config }))
  }

  constructor(private readonly service: GetWalletStateEthereumService) {}

  async execute(): Promise<WalletState> {
    return await this.service.execute()
  }
}

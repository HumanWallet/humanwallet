import type { Config } from "../../_config/index.js"
import type { Service } from "../../_kernel/architecture.js"
import { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type {
  AccountAbstractionEthereumRepository,
  InjectedEthereumRepository,
  ReadContractEthereumInput,
} from "../Repositories/index.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"

export class ReadContractEthereumService implements Service<ReadContractEthereumInput, unknown> {
  static create({ config }: { config: Config }) {
    return new ReadContractEthereumService(
      GetWalletStateEthereumService.create({ config }),
      WagmiEthereumRepository.create(config),
      ZeroDevEthereumRepository.create(config),
    )
  }

  constructor(
    private readonly walletService: GetWalletStateEthereumService,
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
  ) {}
  async execute({ abi, address, functionName, args }: ReadContractEthereumInput): Promise<unknown> {
    const { type } = await this.walletService.execute()

    if (type === WalletState.TYPES.INJECTED)
      return await this.injectedRepository.readContract({ abi, address, functionName, args })

    if (type === WalletState.TYPES.ABSTRACTED)
      return await this.accountAbstractionRepository.readContract({
        abi,
        address,
        functionName,
        args,
      })

    throw new Error("Wallet not found")
  }
}

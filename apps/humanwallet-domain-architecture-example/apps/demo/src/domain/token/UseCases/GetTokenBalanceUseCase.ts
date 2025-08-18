import { TOKEN_ABI } from "../../../contracts/abis/tokenABI.js"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses/index.js"
import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { GetWalletStateEthereumService } from "../../ethereum/Service/GetWalletStateEthereumService.js"
import { ReadContractEthereumService } from "../../ethereum/Service/ReadContractEthereumService.js"
import { formatEther } from "viem"

export type GetTokenBalanceUseCaseInput = void
export type GetTokenBalanceUseCaseOutput = number

export class GetTokenBalanceUseCase implements UseCase<GetTokenBalanceUseCaseInput, GetTokenBalanceUseCaseOutput> {
  static create({ config }: { config: Config }) {
    return new GetTokenBalanceUseCase(
      GetWalletStateEthereumService.create({ config }),
      ReadContractEthereumService.create({ config }),
    )
  }

  constructor(
    private readonly _walletService: GetWalletStateEthereumService,
    private readonly _readContractEthereumService: ReadContractEthereumService,
  ) {}

  async execute(): Promise<GetTokenBalanceUseCaseOutput> {
    const { account } = await this._walletService.execute()
    if (!account) throw new Error("User account not found")

    const balance = await this._readContractEthereumService.execute({
      abi: TOKEN_ABI,
      address: CONTRACT_ADDRESSES.TOKEN,
      functionName: "balanceOf",
      args: [account],
    })

    return Number(formatEther(balance as bigint))
  }
} 
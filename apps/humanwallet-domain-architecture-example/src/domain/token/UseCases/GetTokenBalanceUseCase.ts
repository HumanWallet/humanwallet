import { TOKEN_ABI } from "../../../contracts/abis/tokenABI.js"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import type { IDBEthereumRepository } from "../../ethereum/Repositories/IDBEthereumRepository.js"
import type { WagmiEthereumRepository } from "../../ethereum/Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../../ethereum/Repositories/ZeroDevEthereumRepository.js"
import { GetWalletStateEthereumService } from "../../ethereum/Service/GetWalletStateEthereumService.js"
import { ReadContractEthereumService } from "../../ethereum/Service/ReadContractEthereumService.js"
import { formatEther } from "viem"

export type GetTokenBalanceUseCaseInput = void
export type GetTokenBalanceUseCaseOutput = number

export class GetTokenBalanceUseCase implements UseCase<GetTokenBalanceUseCaseInput, GetTokenBalanceUseCaseOutput> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new GetTokenBalanceUseCase(
      GetWalletStateEthereumService.create({ repositories }),
      ReadContractEthereumService.create({ repositories }),
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

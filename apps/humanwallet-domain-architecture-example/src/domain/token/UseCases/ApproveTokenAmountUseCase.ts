import { parseEther } from "viem"
import { TOKEN_ABI } from "../../../contracts/abis/tokenABI.js"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import type { Transaction } from "../../ethereum/Models/Transaction.js"
import { TransactionType } from "../../ethereum/Models/Transaction.js"
import { GetWalletStateEthereumService } from "../../ethereum/Service/GetWalletStateEthereumService.js"
import { WriteContractEthereumService } from "../../ethereum/Service/WriteContractEthereumService.js"
import type { WagmiEthereumRepository } from "../../ethereum/Repositories/WagmiEthereumRepository.js"
import type { ZeroDevEthereumRepository } from "../../ethereum/Repositories/ZeroDevEthereumRepository.js"
import type { IDBEthereumRepository } from "../../ethereum/Repositories/IDBEthereumRepository.js"

export type ApproveTokenAmountUseCaseInput = {
  amount: number
}

export type ApproveTokenAmountUseCaseOutput = Transaction

export class ApproveTokenAmountUseCase
  implements UseCase<ApproveTokenAmountUseCaseInput, ApproveTokenAmountUseCaseOutput>
{
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
      IDBEthereumRepository: IDBEthereumRepository
    }
  }) {
    return new ApproveTokenAmountUseCase(
      GetWalletStateEthereumService.create({ repositories }),
      WriteContractEthereumService.create({ repositories }),
    )
  }

  constructor(
    private readonly _walletService: GetWalletStateEthereumService,
    private readonly _writeContractEthereumService: WriteContractEthereumService,
  ) {}

  async execute({ amount }: ApproveTokenAmountUseCaseInput): Promise<ApproveTokenAmountUseCaseOutput> {
    const { account } = await this._walletService.execute()
    if (!account) throw new Error("User account not found")

    const parsedAmount = parseEther(amount.toString())

    const transaction = await this._writeContractEthereumService.execute({
      abi: TOKEN_ABI,
      address: CONTRACT_ADDRESSES.TOKEN,
      functionName: "approve",
      args: [CONTRACT_ADDRESSES.STAKING, parsedAmount],
      transactionType: TransactionType.APPROVE,
    })

    return transaction
  }
}

import { parseEther } from "viem"
import { TOKEN_ABI } from "../../../contracts/abis/tokenABI.js"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses/index.js"
import { Config } from "../../_config/index.js"
import { UseCase } from "../../_kernel/architecture.js"
import { Transaction, TransactionType } from "../../ethereum/Models/Transaction.js"
import { GetWalletStateEthereumService } from "../../ethereum/Service/GetWalletStateEthereumService.js"
import { WriteContractEthereumService } from "../../ethereum/Service/WriteContractEthereumService.js"

export type ApproveTokenAmountUseCaseInput = {
  amount: number
}

export type ApproveTokenAmountUseCaseOutput = Transaction

export class ApproveTokenAmountUseCase
  implements UseCase<ApproveTokenAmountUseCaseInput, ApproveTokenAmountUseCaseOutput>
{
  static create({ config }: { config: Config }) {
    return new ApproveTokenAmountUseCase(
      GetWalletStateEthereumService.create({ config }),
      WriteContractEthereumService.create({ config }),
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

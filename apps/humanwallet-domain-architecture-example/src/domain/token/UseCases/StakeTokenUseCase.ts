import { parseEther } from "viem"
import { STAKING_ABI } from "../../../contracts/abis/stakingABI.js"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses/index.js"
import type { Config } from "../../_config/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import type { Transaction } from "../../ethereum/Models/Transaction.js"
import { TransactionType } from "../../ethereum/Models/Transaction.js"
import { GetWalletStateEthereumService } from "../../ethereum/Service/GetWalletStateEthereumService.js"
import { WriteContractEthereumService } from "../../ethereum/Service/WriteContractEthereumService.js"

export type StakeTokenUseCaseInput = {
  amount: number
}

export type StakeTokenUseCaseOutput = Transaction

export class StakeTokenUseCase implements UseCase<StakeTokenUseCaseInput, StakeTokenUseCaseOutput> {
  static create({ config }: { config: Config }) {
    return new StakeTokenUseCase(
      GetWalletStateEthereumService.create({ config }),
      WriteContractEthereumService.create({ config }),
    )
  }

  constructor(
    private readonly _walletService: GetWalletStateEthereumService,
    private readonly _writeContractEthereumService: WriteContractEthereumService,
  ) {}

  async execute({ amount }: StakeTokenUseCaseInput): Promise<StakeTokenUseCaseOutput> {
    const { account } = await this._walletService.execute()
    if (!account) throw new Error("User account not found")

    const parsedAmount = parseEther(amount.toString())

    const transaction = await this._writeContractEthereumService.execute({
      abi: STAKING_ABI,
      address: CONTRACT_ADDRESSES.STAKING,
      functionName: "deposit",
      args: [parsedAmount],
      transactionType: TransactionType.STAKE,
    })

    return transaction
  }
}

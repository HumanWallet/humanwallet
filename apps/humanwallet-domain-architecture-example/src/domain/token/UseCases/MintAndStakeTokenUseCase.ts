import { STAKING_ABI } from "../../../contracts/abis/stakingABI.js"
import { TOKEN_ABI } from "../../../contracts/abis/tokenABI.js"
import { CONTRACT_ADDRESSES } from "../../../contracts/addresses/index.js"
import type { Config } from "../../_config/index.js"
import type { UseCase } from "../../_kernel/architecture.js"
import type { Transaction } from "../../ethereum/Models/Transaction.js"
import { TransactionType } from "../../ethereum/Models/Transaction.js"
import { GetWalletStateEthereumService } from "../../ethereum/Service/GetWalletStateEthereumService.js"
import { WriteContractsEthereumService } from "../../ethereum/Service/WriteContractsEthereumService.js"
import type { WriteContractEthereumInput } from "../../ethereum/Repositories/index.js"

export type MintAndStakeTokenUseCaseInput = void
export type MintAndStakeTokenUseCaseOutput = Transaction

export class MintAndStakeTokenUseCase
  implements UseCase<MintAndStakeTokenUseCaseInput, MintAndStakeTokenUseCaseOutput>
{
  static create({ config }: { config: Config }) {
    return new MintAndStakeTokenUseCase(
      GetWalletStateEthereumService.create({ config }),
      WriteContractsEthereumService.create({ config }),
    )
  }

  constructor(
    private readonly _walletService: GetWalletStateEthereumService,
    private readonly _writeContractsEthereumService: WriteContractsEthereumService,
  ) {}

  private amount = 100

  async execute(): Promise<MintAndStakeTokenUseCaseOutput> {
    const { account } = await this._walletService.execute()
    if (!account) throw new Error("User account not found")

    const contracts: WriteContractEthereumInput[] = [
      {
        abi: TOKEN_ABI,
        address: CONTRACT_ADDRESSES.TOKEN,
        functionName: "mint",
        args: [account, BigInt(this.amount)],
        transactionType: TransactionType.MINT,
      },
      {
        abi: TOKEN_ABI,
        address: CONTRACT_ADDRESSES.TOKEN,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.STAKING, BigInt(this.amount)],
        transactionType: TransactionType.APPROVE,
      },
      {
        abi: STAKING_ABI,
        address: CONTRACT_ADDRESSES.STAKING,
        functionName: "deposit",
        args: [BigInt(this.amount)],
        transactionType: TransactionType.MINT_AND_STAKE,
      },
    ]

    const transaction = await this._writeContractsEthereumService.execute(contracts)
    return transaction
  }
}

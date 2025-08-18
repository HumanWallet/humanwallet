import type { Base } from "./_config/index.js"
import { Config } from "./_config/index.js"
import { Transaction } from "./ethereum/Models/Transaction.js"
import { WalletState } from "./ethereum/Models/WalletState.js"
import { type ConnectEthereumUseCaseInput } from "./ethereum/UseCases/ConnectEthereumUseCase.js"
import { type WaitForTransactionEthereumUseCaseInput } from "./ethereum/UseCases/WaitForTransactionEthereumUseCase.js"
import { type LoginEthereumUseCaseInput } from "./ethereum/UseCases/LoginEthereumUseCase.js"
import type { GetTransactionsEthereumUseCaseOutput } from "./ethereum/UseCases/GetTransactionsEthereumUseCase.js"
import { RegisterEthereumUseCaseInput } from "./ethereum/UseCases/RegisterEthereumUseCase.js"
import { MintTokenUseCaseInput, MintTokenUseCaseOutput } from "./token/UseCases/MintTokenUseCase.js"
import {
  ApproveTokenAmountUseCaseInput,
  ApproveTokenAmountUseCaseOutput,
} from "./token/UseCases/ApproveTokenAmountUseCase.js"
import { StakeTokenUseCaseInput, StakeTokenUseCaseOutput } from "./token/UseCases/StakeTokenUseCase.js"
import {
  MintAndStakeTokenUseCaseInput,
  MintAndStakeTokenUseCaseOutput,
} from "./token/UseCases/MintAndStakeTokenUseCase.js"
import { GetTokenBalanceUseCaseInput, GetTokenBalanceUseCaseOutput } from "./token/UseCases/GetTokenBalanceUseCase.js"
import {
  GetTokenAllowanceUseCaseInput,
  GetTokenAllowanceUseCaseOutput,
} from "./token/UseCases/GetTokenAllowanceUseCase.js"
import { WagmiEthereumRepository } from "./ethereum/Repositories/WagmiEthereumRepository.js"
import { ZeroDevEthereumRepository } from "./ethereum/Repositories/ZeroDevEthereumRepository.js"

export class Domain {
  #config: Config

  private async getRepositories() {
    return {
      WagmiEthereumRepository: WagmiEthereumRepository.create(this.#config),
      ZeroDevEthereumRepository: ZeroDevEthereumRepository.create(this.#config),
    }
  }

  static create(config: Base) {
    return new Domain(config)
  }

  constructor(config: Base) {
    this.#config = Config.create(config)
  }

  get config() {
    return this.#config
  }

  /** Ethereum */
  get InitPublicClientEthereumUseCase () { return this.#getter<void, void>(async () => import("./ethereum/UseCases/InitPublicClientEthereumUseCase.js"), "InitPublicClientEthereumUseCase") } // prettier-ignore
  get ConnectEthereumUseCase() { return this.#getter<ConnectEthereumUseCaseInput, WalletState>(async () => import("./ethereum/UseCases/ConnectEthereumUseCase.js"), "ConnectEthereumUseCase") } // prettier-ignore
  get DisconnectEthereumUseCase() { return this.#getter<void, WalletState>(async () => import("./ethereum/UseCases/DisconnectEthereumUseCase.js"), "DisconnectEthereumUseCase") } // prettier-ignore
  get GetWalletStateEthereumUseCase() { return this.#getter<void, WalletState>(async () => import("./ethereum/UseCases/GetWalletStateEthereumUseCase.js"), "GetWalletStateEthereumUseCase") } // prettier-ignore
  get SwitchChainEthereumUseCase() { return this.#getter<void, WalletState>(async () => import("./ethereum/UseCases/SwitchChainEthereumUseCase.js"), "SwitchChainEthereumUseCase") } // prettier-ignore
  get ReconnectEthereumUseCase() { return this.#getter<void, WalletState>(async () => import("./ethereum/UseCases/ReconnectEthereumUseCase.js"), "ReconnectEthereumUseCase") } // prettier-ignore
  get GetTransactionsEthereumUseCase() { return this.#getter<void, GetTransactionsEthereumUseCaseOutput>(async () => import("./ethereum/UseCases/GetTransactionsEthereumUseCase.js"), "GetTransactionsEthereumUseCase") } // prettier-ignore
  get WaitForTransactionEthereumUseCase() { return this.#getter<WaitForTransactionEthereumUseCaseInput, Transaction>(async () => import("./ethereum/UseCases/WaitForTransactionEthereumUseCase.js"), "WaitForTransactionEthereumUseCase") } // prettier-ignore
  get RegisterEthereumUseCase() { return this.#getter<RegisterEthereumUseCaseInput, WalletState>(async () => import("./ethereum/UseCases/RegisterEthereumUseCase.js"), "RegisterEthereumUseCase") } // prettier-ignore
  get LoginEthereumUseCase() { return this.#getter<LoginEthereumUseCaseInput, WalletState>(async () => import("./ethereum/UseCases/LoginEthereumUseCase.js"), "LoginEthereumUseCase") } // prettier-ignore
  get CleanTransactionsEthereumUseCase() { return this.#getter<void, void>(async () => import("./ethereum/UseCases/CleanTransactionsEthereumUseCase.js"), "CleanTransactionsEthereumUseCase") } // prettier-ignore

  /** Token */
  get MintTokenUseCase() { return this.#getter<MintTokenUseCaseInput, MintTokenUseCaseOutput>(async () => import("./token/UseCases/MintTokenUseCase.js"), "MintTokenUseCase") } // prettier-ignore
  get ApproveTokenAmountUseCase() { return this.#getter<ApproveTokenAmountUseCaseInput, ApproveTokenAmountUseCaseOutput>(async () => import("./token/UseCases/ApproveTokenAmountUseCase.js"), "ApproveTokenAmountUseCase") } // prettier-ignore
  get StakeTokenUseCase() { return this.#getter<StakeTokenUseCaseInput, StakeTokenUseCaseOutput>(async () => import("./token/UseCases/StakeTokenUseCase.js"), "StakeTokenUseCase") } // prettier-ignore
  get MintAndStakeTokenUseCase() { return this.#getter<MintAndStakeTokenUseCaseInput, MintAndStakeTokenUseCaseOutput>(async () => import("./token/UseCases/MintAndStakeTokenUseCase.js"), "MintAndStakeTokenUseCase") } // prettier-ignore
  get GetTokenBalanceUseCase() { return this.#getter<GetTokenBalanceUseCaseInput, GetTokenBalanceUseCaseOutput>(async () => import("./token/UseCases/GetTokenBalanceUseCase.js"), "GetTokenBalanceUseCase") } // prettier-ignore
  get GetTokenAllowanceUseCase() { return this.#getter<GetTokenAllowanceUseCaseInput, GetTokenAllowanceUseCaseOutput>(async () => import("./token/UseCases/GetTokenAllowanceUseCase.js"), "GetTokenAllowanceUseCase") } // prettier-ignore

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  #getter<I, O>(loader: Function, name: string) {
    return {
      execute: async (input: I): Promise<O> => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const Klass = await loader().then((mod) => mod[name])
        const uc = Klass.create({ config: this.#config, repositories: await this.getRepositories() })

        return uc.execute(input) as O
      },
    }
  }
}

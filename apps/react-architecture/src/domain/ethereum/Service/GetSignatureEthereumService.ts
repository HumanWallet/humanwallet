import type { Service } from "../../_kernel/architecture.js"
import type { WagmiEthereumRepository } from "../Repositories/WagmiEthereumRepository.js"
import type {
  AccountAbstractionEthereumRepository,
  InjectedEthereumRepository,
  SignTypedDataEthereumInput,
} from "../Repositories/index.js"
import { GetWalletStateEthereumService } from "./GetWalletStateEthereumService.js"
import type { ZeroDevEthereumRepository } from "../Repositories/ZeroDevEthereumRepository.js"
import { WalletState } from "../Models/WalletState.js"
import { type Signature } from "viem"
import { dispatchDomainEvent, DomainEvents } from "../../_kernel/Events.js"
import { DomainError } from "../../_kernel/DomainError.js"
import { ErrorCodes } from "../../_kernel/ErrorCodes.js"

export class GetSignatureEthereumService implements Service<SignTypedDataEthereumInput, Signature> {
  static create({
    repositories,
  }: {
    repositories: {
      WagmiEthereumRepository: WagmiEthereumRepository
      ZeroDevEthereumRepository: ZeroDevEthereumRepository
    }
  }) {
    return new GetSignatureEthereumService(
      GetWalletStateEthereumService.create({ repositories }),
      repositories.WagmiEthereumRepository,
      repositories.ZeroDevEthereumRepository,
    )
  }

  constructor(
    private readonly walletService: GetWalletStateEthereumService,
    private readonly injectedRepository: InjectedEthereumRepository,
    private readonly accountAbstractionRepository: AccountAbstractionEthereumRepository,
  ) {}

  async execute(params: SignTypedDataEthereumInput): Promise<Signature> {
    try {
      const { type } = await this.walletService.execute()

      dispatchDomainEvent(DomainEvents.SUBMIT_SIGNATURE, null)

      let signature

      if (type === WalletState.TYPES.INJECTED) {
        signature = await this.injectedRepository.signTypedData(params)
      }

      if (type === WalletState.TYPES.ABSTRACTED) {
        signature = await this.accountAbstractionRepository.signTypedData(params)
      }

      if (signature) {
        dispatchDomainEvent(DomainEvents.SUCCESS_SIGNATURE, null)
        return signature
      }
    } catch (error) {
      if (error instanceof DomainError) {
        dispatchDomainEvent(DomainEvents.ERROR, { domainError: error })
        throw error
      }
    }
    throw DomainError.create({ code: ErrorCodes.SIGNATURE_ERROR })
  }
}

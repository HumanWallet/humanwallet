import type { UseCase } from "../../_kernel/architecture.js"
import { publicClient } from "../../../js/viem/index.js"

export class InitPublicClientEthereumUseCase implements UseCase<void, void> {
  static create() {
    return new InitPublicClientEthereumUseCase()
  }

  constructor() {}

  async execute(): Promise<void> {
    window.publicClient = window.publicClient ?? publicClient

    if (typeof window.blockNumber === "undefined") {
      const currentBlockNumber = await window.publicClient.getBlockNumber()
      window.blockNumber = Number(currentBlockNumber)
    }
  }
}

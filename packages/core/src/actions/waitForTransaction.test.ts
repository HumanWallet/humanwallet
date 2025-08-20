import { describe, it } from "vitest"
import { waitForTransaction } from "./waitForTransaction"
import { createConfig } from "./createConfig"
import { sepolia } from "viem/chains"
import type { Config } from "types"

const config: Config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a waitForTransaction function", () => {
  describe("When it is called with a valid transaction hash", () => {
    it("Then it should return the transaction receipt", async () => {
      const transactionHash = "0x123"
      const transactionReceipt = await waitForTransaction(config, transactionHash)
      expect(transactionReceipt).toBeDefined()
    })
  })
})

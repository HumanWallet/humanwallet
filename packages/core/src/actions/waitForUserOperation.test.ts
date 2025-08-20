import { describe, it } from "vitest"
import { createConfig } from "./createConfig"
import { sepolia } from "viem/chains"
import type { Config } from "types"
import { waitForUserOperation } from "./waitForUserOperation"
import { register } from "./register"

const config: Config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a waitForUserOperation function", () => {
  beforeEach(async () => {
    const { kernelClient } = await register("test", config)
    config.kernelClient = kernelClient
  })

  describe("When it is called with a valid transaction hash", () => {
    it("Then it should return the transaction receipt", async () => {
      const transactionHash = "0x123"
      const transactionReceipt = await waitForUserOperation(config, transactionHash)

      expect(transactionReceipt).toHaveProperty("hash")
      expect(transactionReceipt).toHaveProperty("status")
      expect(transactionReceipt).toHaveProperty("blockNumber")
      expect(transactionReceipt).toHaveProperty("blockHash")
      expect(transactionReceipt).toHaveProperty("transactionHash")
      expect(transactionReceipt).toHaveProperty("transactionIndex")
      expect(transactionReceipt).toHaveProperty("from")
    })
  })
})

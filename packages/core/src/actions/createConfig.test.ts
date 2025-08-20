import { describe, it } from "vitest"
import { createConfig } from "./createConfig"
import { sepolia } from "viem/chains"

describe("Given a createConfig function", () => {
  describe("When it is called", () => {
    it("Then it should create a config", () => {
      const config = createConfig({
        passkeyUrl: "http://localhost:8545",
        bundlerRpc: "http://localhost:8545",
        paymasterRpc: "http://localhost:8545",
        chain: sepolia,
      })

      expect(config.bundlerTransport).toBeDefined()
      expect(config.paymasterTransport).toBeDefined()
      expect(config.publicClient).toBeDefined()
      expect(config.chain).toBeDefined()
      expect(config.passkeyUrl).toBeDefined()
    })
  })
})

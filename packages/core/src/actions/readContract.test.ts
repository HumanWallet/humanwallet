import { sepolia } from "viem/chains"
import { createConfig } from "./createConfig"
import { readContract } from "./readContract"

const config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

config.publicClient.readContract = vi.fn()

describe("Given a readContract function", () => {
  describe("When it is called", () => {
    it("Then it should return the result", () => {
      const result = readContract(config, {
        address: "0x0000000000000000000000000000000000000000",
        abi: [],
        functionName: "readContract",
      })

      expect(result).toBeDefined()
    })
  })
})

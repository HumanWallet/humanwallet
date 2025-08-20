import type { Config } from "types"
import { writeContract } from "./writeContract"
import { createConfig } from "./createConfig"
import { sepolia } from "viem/chains"
import { register } from "./register"
import { erc20Abi } from "viem"

const config: Config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a writeContract function", () => {
  beforeEach(async () => {
    const { kernelClient } = await register("test", config)
    config.kernelClient = kernelClient
  })

  describe("When it is called with a valid contract address and function name", () => {
    it("Then it should return the transaction receipt", async () => {
      const transactionReceipt = await writeContract(config, {
        abi: erc20Abi,
        address: "0x0000000000000000000000000000000000000000",
        account: "0x123",
        chain: sepolia,
        functionName: "transfer",
        args: ["0x0000000000000000000000000000000000000000", 100n],
        value: 0n,
      })

      expect(transactionReceipt).toBeDefined()
    })
  })
})

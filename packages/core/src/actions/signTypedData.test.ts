import { sepolia } from "viem/chains"
import { createConfig } from "./createConfig"
import { signTypedData } from "./signTypedData"
import { register } from "./register"
import type { Config } from "@humanwallet/types"
import { serializeSignature } from "viem"

const config: Config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a signTypedData function", () => {
  beforeEach(async () => {
    const { kernelClient } = await register("test", config)
    config.kernelClient = kernelClient
  })

  describe("When it is called", () => {
    it("Then it should return the result", async () => {
      const signature = await signTypedData(config, {
        account: "0x0000000000000000000000000000000000000000",
        message: {
          name: "test",
          version: "1.0.0",
          chainId: sepolia.id,
        },
        primaryType: "EIP712Domain",
        types: {},
      })

      const serializedResult = serializeSignature(signature)
      expect(serializedResult).toSatisfy((result: string) => result.includes("0x"))
    })
  })
})

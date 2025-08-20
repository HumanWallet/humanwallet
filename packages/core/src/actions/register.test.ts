import { sepolia } from "viem/chains"
import { createConfig } from "./createConfig"
import { register } from "./register"

const config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a register function", () => {
  describe("When it is called and there is no key", () => {
    it("Then it should return the result", async () => {
      const { sessionKeyAccount, kernelClient } = await register("test", config)

      expect(sessionKeyAccount).not.toBeNull()
      expect(kernelClient).not.toBeNull()
    })
  })
})

import { describe, it } from "vitest"
import { login } from "./login"
import { createConfig } from "./createConfig"
import { sepolia } from "viem/chains"

const config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a login action", () => {
  describe("When it is called and the user is not connected", () => {
    it("Then it should return false", async () => {
      const { kernelClient, sessionKeyAccount } = await login("test", config)

      expect(kernelClient).toBeDefined()
      expect(sessionKeyAccount).toBeDefined()
    })
  })
})

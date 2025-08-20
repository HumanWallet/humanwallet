import { sepolia } from "viem/chains"
import { createConfig } from "./createConfig"
import { reconnect } from "./reconnect"
import { login } from "./login"
import { disconnect } from "./disconnect"

const config = createConfig({
  passkeyUrl: "http://localhost:8545",
  bundlerRpc: "http://localhost:8545",
  paymasterRpc: "http://localhost:8545",
  chain: sepolia,
})

describe("Given a reconnect function", () => {
  describe("When it is called and there is a key", () => {
    beforeEach(async () => {
      await login("test", config)
    })

    afterEach(async () => {
      await disconnect()
    })

    it("Then it should return the result", async () => {
      const { sessionKeyAccount, kernelClient } = await reconnect(config)

      expect(sessionKeyAccount).not.toBeNull()
      expect(kernelClient).not.toBeNull()
    })
  })

  describe("When it is called and there is no key", () => {
    it("Then it should return null", async () => {
      const { sessionKeyAccount, kernelClient } = await reconnect(config)

      expect(sessionKeyAccount).toBeNull()
      expect(kernelClient).toBeNull()
    })
  })
})

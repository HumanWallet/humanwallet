import { describe, it } from "vitest"
import { generateWebAuthenticationKey } from "./generateWebAuthenticationKey"
import { http } from "viem"
import { sepolia } from "viem/chains"
import { createPublicClient } from "viem"
import { WEB_AUTHENTICATION_MODE_KEY } from "@humanwallet/types"

describe("Given a generateWebAuthenticationKey function", () => {
  describe("When it is called", () => {
    it("Then it should generate a webAuthenticationKey", async () => {
      const webAuthenticationKey = await generateWebAuthenticationKey("test", WEB_AUTHENTICATION_MODE_KEY.REGISTER, {
        bundlerTransport: http("http://localhost:8545"),
        paymasterTransport: http("http://localhost:8545"),
        chain: sepolia,
        publicClient: createPublicClient({
          chain: sepolia,
          transport: http("http://localhost:8545"),
        }),
        passkeyUrl: "http://localhost:8545",
      })

      expect(webAuthenticationKey).toBeDefined()
    })
  })
})

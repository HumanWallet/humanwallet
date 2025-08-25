import { describe, it } from "vitest"
import type { Config, WebAuthenticationKey } from "@humanwallet/types"
import { createAccountAndClient } from "./createAccountAndClient"
import { sepolia } from "viem/chains"
import { createPublicClient, http } from "viem"

const mockWebAuthenticationKey: WebAuthenticationKey = {
  pubX: BigInt(1),
  pubY: BigInt(1),
  authenticatorId: "0x1",
  authenticatorIdHash: "0x1",
  rpID: "mock",
}

const config: Config = {
  bundlerTransport: http("http://localhost:8545"),
  paymasterTransport: http("http://localhost:8545"),
  chain: sepolia,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http("http://localhost:8545"),
  }),
  passkeyUrl: "http://localhost:8545",
}

describe("Given a createAccountAndClient function", () => {
  describe("When it is called and the webAuthenticationKey is set", async () => {
    it("Then it should create an account and a client", async () => {
      const { sessionKeyAccount, kernelClient } = await createAccountAndClient(mockWebAuthenticationKey, config)

      expect(sessionKeyAccount).toBeDefined()
      expect(kernelClient).toBeDefined()
    })
  })
})

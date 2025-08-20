import { describe, it } from "vitest"
import type { WebAuthenticationKey } from "types"
import { setWebAuthenticationKey } from "./setWebAuthenticationKey"
import { getWebAuthenticationKey } from "./getWebAuthenticationKey"

const mockWebAuthenticationKey: WebAuthenticationKey = {
  pubX: BigInt(1),
  pubY: BigInt(1),
  authenticatorId: "0x1",
  authenticatorIdHash: "0x1",
  rpID: "mock",
}

describe("Given a setWebAuthenticationKey function", () => {
  describe("When it is called and the webAuthenticationKey is set", async () => {
    it("Then it should delete a webAuthenticationKey", async () => {
      await setWebAuthenticationKey(mockWebAuthenticationKey)

      const result = await getWebAuthenticationKey()

      expect(result).toEqual(mockWebAuthenticationKey)
    })
  })
})

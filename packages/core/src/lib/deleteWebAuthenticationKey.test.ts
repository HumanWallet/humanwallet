import { describe, it } from "vitest"
import type { WebAuthenticationKey } from "@humanwallet/types"
import { get } from "idb-keyval"
import { deleteWebAuthenticationKey } from "./deleteWebAuthenticationKey"
import { setWebAuthenticationKey } from "./setWebAuthenticationKey"

const mockWebAuthenticationKey: WebAuthenticationKey = {
  pubX: BigInt(1),
  pubY: BigInt(1),
  authenticatorId: "0x1",
  authenticatorIdHash: "0x1",
  rpID: "mock",
}

describe("Given a deleteWebAuthenticationKey function", () => {
  describe("When it is called and the webAuthenticationKey is set", async () => {
    await setWebAuthenticationKey(mockWebAuthenticationKey)
    it("Then it should delete a webAuthenticationKey", async () => {
      const result = await deleteWebAuthenticationKey()

      const webAuthenticationKey = await get("webAuthnKey")

      expect(result).toBe(true)
      expect(webAuthenticationKey).toBeUndefined()
    })
  })
})

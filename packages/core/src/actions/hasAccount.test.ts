import { deleteWebAuthenticationKey } from "../lib/deleteWebAuthenticationKey"
import { setWebAuthenticationKey } from "../lib/setWebAuthenticationKey"
import { hasAccount } from "./hasAccount"

describe("Given a hasAccount function", () => {
  describe("When it is called and the user is connected", () => {
    beforeEach(async () => {
      await setWebAuthenticationKey({
        pubX: BigInt(1),
        pubY: BigInt(1),
        authenticatorId: "0x1",
        authenticatorIdHash: "0x1",
        rpID: "mock",
      })
    })

    it("Then it should return true", async () => {
      const result = await hasAccount()

      expect(result).toBe(true)
    })

    describe("When it is called and the user is not connected", () => {
      beforeEach(async () => {
        await deleteWebAuthenticationKey()
      })

      it("Then it should return false", async () => {
        const result = await hasAccount()

        expect(result).toBe(false)
      })
    })
  })
})

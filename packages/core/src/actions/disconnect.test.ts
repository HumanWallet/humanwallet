import { setWebAuthenticationKey } from "../lib/setWebAuthenticationKey"
import { disconnect } from "./disconnect"

describe("Given a disconnect action", () => {
  beforeEach(async () => {
    await setWebAuthenticationKey({
      pubX: BigInt(1),
      pubY: BigInt(1),
      authenticatorId: "0x1",
      authenticatorIdHash: "0x1",
      rpID: "mock",
    })
  })

  describe("When it is called and the user is connected", () => {
    it("Then it should return true", async () => {
      const result = await disconnect()

      expect(result).toBe(true)
    })
  })
})

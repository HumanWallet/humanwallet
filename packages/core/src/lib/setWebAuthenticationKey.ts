import { set } from "idb-keyval"
import { WEBAUTHN_STORAGE_KEY } from "../contants"
import type { WebAuthenticationKey } from "types"

export function setWebAuthenticationKey(webAuthenticationKey: WebAuthenticationKey): Promise<void> {
  return set(WEBAUTHN_STORAGE_KEY, webAuthenticationKey)
}

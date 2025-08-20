import { del } from "idb-keyval"
import { WEBAUTHN_STORAGE_KEY } from "../contants"

export function deleteWebAuthenticationKey(): Promise<boolean> {
  return del(WEBAUTHN_STORAGE_KEY).then(() => true)
}

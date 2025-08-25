import { get } from "idb-keyval"
import { WEBAUTHN_STORAGE_KEY } from "../contants"
import type { WebAuthenticationKey } from "@humanwallet/types"

export function getWebAuthenticationKey(): Promise<WebAuthenticationKey | undefined> {
  return get(WEBAUTHN_STORAGE_KEY)
}

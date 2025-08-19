import type { Config, WebAuthenticationKey, WebAuthenticationModeKey } from "types"
import { get, set, del } from "idb-keyval"
import { toWebAuthnKey } from "@zerodev/webauthn-key"

const WEBAUTHN_STORAGE_KEY = "webAuthnKey"

export function deleteWebAuthenticationKey(): Promise<boolean> {
  return del(WEBAUTHN_STORAGE_KEY).then(() => true)
}

export function setWebAuthenticationKey(webAuthenticationKey: WebAuthenticationKey): Promise<void> {
  return set(WEBAUTHN_STORAGE_KEY, webAuthenticationKey)
}

export function getWebAuthenticationKey(): Promise<WebAuthenticationKey | undefined> {
  return get(WEBAUTHN_STORAGE_KEY)
}

export function generateWebAuthenticationKey(
  username: string,
  mode: WebAuthenticationModeKey,
  config: Config,
): Promise<WebAuthenticationKey> {
  return toWebAuthnKey({
    passkeyName: username,
    passkeyServerUrl: config.passkeyUrl,
    mode,
    passkeyServerHeaders: {},
  })
}

import { toWebAuthnKey } from "@zerodev/webauthn-key"
import type { Config, WebAuthenticationKey, WebAuthenticationModeKey } from "types"

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

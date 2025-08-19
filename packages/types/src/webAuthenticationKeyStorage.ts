import type { WebAuthenticationKey } from "./humanWallet"

export type WebAuthenticationKeyStorage = {
  getWebAuthenticationKey(): Promise<WebAuthenticationKey | undefined>
  setWebAuthenticationKey(webAuthenticationKey: WebAuthenticationKey): Promise<void>
  deleteWebAuthenticationKey(): Promise<boolean>
}

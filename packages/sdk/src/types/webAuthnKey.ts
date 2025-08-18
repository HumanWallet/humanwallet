import { WebAuthnMode, type WebAuthnKey as WebAuthnKeyType } from "@zerodev/webauthn-key"
/**
 * WebAuthn key type imported from the ZeroDev SDK.
 * Represents cryptographic keys used for WebAuthn authentication.
 */

export type WebAuthnKey = WebAuthnKeyType

/**
 * WebAuthn mode key type.
 * Represents the mode of WebAuthn authentication.
 */
export const WEB_AUTH_MODE_KEY = {
  REGISTER: WebAuthnMode.Register,
  LOGIN: WebAuthnMode.Login,
}

/**
 * WebAuthn mode key type.
 * Represents the mode of WebAuthn authentication.
 */
export type WebAuthnModeKey = (typeof WEB_AUTH_MODE_KEY)[keyof typeof WEB_AUTH_MODE_KEY]

/**
 * Interface for managing WebAuthn key storage operations.
 * Provides methods to get, set, and delete WebAuthn keys from storage.
 */

export interface WebAuthnKeyStorageRepositoryInterface {
  /**
   * Retrieves the stored WebAuthn key from storage.
   * @returns Promise that resolves to the WebAuthn key object or undefined if not found
   */
  getWebAuthnKey(): Promise<WebAuthnKey | undefined>

  /**
   * Stores a WebAuthn key in storage.
   * @param webAuthnKey - The WebAuthn key to store
   * @returns Promise that resolves when the key is successfully stored
   */
  setWebAuthnKey(webAuthnKey: WebAuthnKey): Promise<void>

  /**
   * Deletes the stored WebAuthn key from storage.
   * @returns Promise that resolves when the key is successfully deleted
   */
  deleteWebAuthnKey(): Promise<void>
}

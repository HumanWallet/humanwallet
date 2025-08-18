import type { WebAuthnKey } from '@zerodev/webauthn-key';

/**
 * Interface for managing WebAuthn key storage operations.
 * Provides methods to get, set, and delete WebAuthn keys from storage.
 */
export interface SessionStorageRepositoryInterface {
  /**
   * Retrieves the stored WebAuthn key from storage.
   * @returns Promise that resolves to the WebAuthn key object or undefined if not found
   */
  getWebAuthnKey(): Promise<WebAuthnKey | undefined>;

  /**
   * Stores a WebAuthn key in storage.
   * @param webAuthnKey - The WebAuthn key to store
   * @returns Promise that resolves when the key is successfully stored
   */
  setWebAuthnKey(webAuthnKey: WebAuthnKey): Promise<void>;

  /**
   * Deletes the stored WebAuthn key from storage.
   * @returns Promise that resolves when the key is successfully deleted
   */
  deleteWebAuthnKey(): Promise<void>;
}

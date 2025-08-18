import type { WebAuthnKey } from "@zerodev/webauthn-key"
import { get, set, del } from "idb-keyval"
import type { WebAuthnKeyStorageRepositoryInterface } from "../../types/webAuthnKey"

const WEBAUTHN_STORAGE_KEY = "webAuthnKey"

/**
 * Repository for managing WebAuthn key storage using IndexedDB.
 * Provides persistent storage for WebAuthn keys in the browser environment.
 */
export class WebAuthnKeyStorageRepository implements WebAuthnKeyStorageRepositoryInterface {
  private constructor() {}

  /**
   * Creates a new instance of WebAuthnKeyStorageRepository.
   * @returns A new WebAuthnKeyStorageRepository instance
   * @throws Error if called outside of browser environment
   */
  static create(): WebAuthnKeyStorageRepositoryInterface {
    if (typeof window === "undefined") {
      throw new Error("WebAuthnKeyStorage can only be used in the browser")
    }
    return new WebAuthnKeyStorageRepository()
  }

  /**
   * Retrieves the stored WebAuthn key.
   * @returns Promise resolving to the stored WebAuthn key or undefined if not found
   * @throws Error if storage access fails
   */
  public async getWebAuthnKey(): Promise<WebAuthnKey | undefined> {
    try {
      return await get<WebAuthnKey>(WEBAUTHN_STORAGE_KEY)
    } catch (error) {
      throw new Error(`Failed to retrieve WebAuthn key: ${this.getErrorMessage(error)}`)
    }
  }

  /**
   * Stores a WebAuthn key in persistent storage.
   * @param webAuthnKey - The WebAuthn key to store
   * @throws Error if storage operation fails
   */
  public async setWebAuthnKey(webAuthnKey: WebAuthnKey): Promise<void> {
    try {
      await set(WEBAUTHN_STORAGE_KEY, webAuthnKey)
    } catch (error) {
      throw new Error(`Failed to store WebAuthn key: ${this.getErrorMessage(error)}`)
    }
  }

  /**
   * Deletes the stored WebAuthn key.
   * @throws Error if deletion operation fails
   */
  public async deleteWebAuthnKey(): Promise<void> {
    try {
      await del(WEBAUTHN_STORAGE_KEY)
    } catch (error) {
      throw new Error(`Failed to delete WebAuthn key: ${this.getErrorMessage(error)}`)
    }
  }

  /**
   * Extracts error message from various error types.
   * @param error - The error object
   * @returns A string representation of the error message
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === "string") {
      return error
    }
    return "Unknown error"
  }
}

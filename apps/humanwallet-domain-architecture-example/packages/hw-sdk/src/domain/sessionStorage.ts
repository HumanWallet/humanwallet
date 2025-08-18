import type { WebAuthnKey } from '@zerodev/webauthn-key';
import { get, set, del } from 'idb-keyval';
import { SessionStorageRepositoryInterface } from '../types/sessionStorage';

const WEBAUTHN_STORAGE_KEY = 'webAuthnKey';

export class SessionStorageRepository
  implements SessionStorageRepositoryInterface
{
  private constructor() {}

  static create(): SessionStorageRepository {
    if (typeof window === 'undefined') {
      throw new Error('WebAuthnKeyStorage can only be used in the browser');
    }
    return new SessionStorageRepository();
  }

  public async getWebAuthnKey(): Promise<WebAuthnKey | undefined> {
    try {
      return await get<WebAuthnKey>(WEBAUTHN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to retrieve WebAuthn key:', error);
      return undefined;
    }
  }

  public async setWebAuthnKey(webAuthnKey: WebAuthnKey): Promise<void> {
    try {
      return await set(WEBAUTHN_STORAGE_KEY, webAuthnKey);
    } catch (error) {
      console.error('Failed to store WebAuthn key:', error);
      throw new Error(
        `Failed to store WebAuthn key: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  public async deleteWebAuthnKey(): Promise<void> {
    try {
      return await del(WEBAUTHN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to delete WebAuthn key:', error);
      throw new Error(
        `Failed to delete WebAuthn key: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

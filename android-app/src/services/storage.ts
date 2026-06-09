import { createMMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from '../constants';

const storage = createMMKV({ id: 'vitalcare-storage' });

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await Keychain.setGenericPassword(STORAGE_KEYS.AUTH_TOKEN, token, {
        service: 'vitalcare.auth',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch {
      appStorage.setString(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: 'vitalcare.auth',
      });
      if (credentials && typeof credentials !== 'boolean') {
        return credentials.password;
      }
    } catch {
      // fall through to MMKV
    }
    return appStorage.getString(STORAGE_KEYS.AUTH_TOKEN) ?? null;
  },

  async removeToken(): Promise<void> {
    try {
      await Keychain.resetGenericPassword({ service: 'vitalcare.auth' });
    } catch {
      // ignore keychain errors
    }
    appStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },
};

export const appStorage = {
  set<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  },

  get<T>(key: string): T | null {
    const value = storage.getString(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  remove(key: string): void {
    storage.remove(key);
  },

  clear(): void {
    storage.clearAll();
  },
};

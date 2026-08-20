import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'guarde.auth.token';
const AUTH_USER_KEY = 'guarde.auth.user';

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(key) ?? null;
  }
  return SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export const tokenStorage = {
  async getSession<TUser>(): Promise<{ token: string; user: TUser } | null> {
    const [token, rawUser] = await Promise.all([getItem(AUTH_TOKEN_KEY), getItem(AUTH_USER_KEY)]);
    if (!token || !rawUser) {
      return null;
    }
    return { token, user: JSON.parse(rawUser) as TUser };
  },

  async saveSession<TUser>(token: string, user: TUser): Promise<void> {
    await Promise.all([setItem(AUTH_TOKEN_KEY, token), setItem(AUTH_USER_KEY, JSON.stringify(user))]);
  },

  async clearSession(): Promise<void> {
    await Promise.all([deleteItem(AUTH_TOKEN_KEY), deleteItem(AUTH_USER_KEY)]);
  },
};

// ProjectForge AI — Secure & Persistent Mobile Storage Layer
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'pf_mobile_auth_token';
const USER_KEY = 'pf_mobile_user_profile';
const API_BASE_KEY = 'pf_mobile_api_base';
const THEME_KEY = 'pf_mobile_theme';

export const storage = {
  // 1. Secure Token Storage
  async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } else {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn('[Storage] Failed to securely write token:', e);
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      }
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('[Storage] Failed to delete token:', e);
    }
  },

  // 2. User Profile Cache
  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('[Storage] Failed to save user profile:', e);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  // 3. API Base URL (Configurable for local LAN IP or cloud backend)
  async getApiBase(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_BASE_KEY);
    } catch {
      return null;
    }
  },

  async setApiBase(url: string): Promise<void> {
    if (url) {
      await AsyncStorage.setItem(API_BASE_KEY, url.trim().replace(/\/+$/, ''));
    } else {
      await AsyncStorage.removeItem(API_BASE_KEY);
    }
  },

  // 4. Generic Safe Cache
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(`pf_cache_${key}`);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  async setCache<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(`pf_cache_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Failed to cache ${key}:`, e);
    }
  },

  // 5. Full Session Cleanup on Logout
  async clearSession(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
  }
};

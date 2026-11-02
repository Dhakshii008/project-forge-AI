// ProjectForge AI — Central Mobile API Client Layer
import { storage } from '../services/storage';
import { mobileStandaloneStore } from '../data/standaloneStore';

const DEFAULT_API_BASE = 'http://192.168.1.4:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class MobileApiClient {
  private async getBaseUrl(): Promise<string> {
    const custom = await storage.getApiBase();
    if (custom) return custom.replace(/\/+$/, '');
    return DEFAULT_API_BASE;
  }

  public async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    const token = await storage.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json();

      if (response.status === 401 && json?.error?.code === 'TOKEN_EXPIRED') {
        await storage.clearSession();
      }

      return json;
    } catch (err: any) {
      console.warn(`[Mobile API] Network request to ${url} failed. Invoking standalone real data engine.`);
      
      const offlineFallback = await mobileStandaloneStore.handleRequest(endpoint, options);
      if (offlineFallback) {
        return offlineFallback as ApiResponse<T>;
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Unable to connect to ProjectForge API server. Working in offline mode.',
        },
      };
    }
  }

  // HTTP Helper Methods
  public get<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  public delete<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const apiClient = new MobileApiClient();

export const getApiBaseUrl = () => DEFAULT_API_BASE;
export const setApiBaseUrl = async (url: string) => {
  await storage.setApiBase(url);
};

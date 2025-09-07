import { ApiError, api } from '../api/client';
import { SessionManager } from './session';

export interface SignupData {
  email: string;
  password: string;
  name: string;
  company: string;
  industry: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: string;
  tenantId: string;
  company?: string;
  industry?: string;
}

export class AuthService {
  static async signup(data: SignupData): Promise<UserProfile> {
    try {
      const response = await api.getClient().post<{
        access_token: string;
        refresh_token: string;
        user: UserProfile;
      }>('/v1/auth/signup', data);

      // Store session data
      SessionManager.setSession({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tenantId: response.data.user.tenantId,
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        },
      });

      return response.data.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message || 'Signup failed');
      }
      throw new Error('An unexpected error occurred during signup');
    }
  }

  static async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      const response = await api.getClient().post<{
        access_token: string;
        refresh_token: string;
        user: UserProfile;
      }>('/v1/auth/login', credentials);

      // Store session data
      SessionManager.setSession({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tenantId: response.data.user.tenantId,
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        },
      });

      return response.data.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message || 'Login failed');
      }
      throw new Error('An unexpected error occurred');
    }
  }

  static async logout(): Promise<void> {
    try {
      await api.getClient().post('/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      SessionManager.clearSession();
    }
  }

  private static async getRefreshToken(): Promise<string | null> {
    if (typeof window === 'undefined') {
      // Server-side: Use cookies from next/headers
      const { cookies } = await import('next/headers');
      return (await cookies()).get(process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME!)?.value || null;
    } else {
      // Client-side: Use document.cookie
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    }
  }

  static async refreshToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await api.getClient().post<{
        access_token: string;
        refresh_token: string;
      }>('/v1/auth/refresh', { refresh_token: refreshToken });

      // The new access token will be set via HttpOnly cookie by the server
      return response.data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      SessionManager.clearSession();
      return null;
    }
  }

  static async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await api.getClient().get<UserProfile>('/v1/auth/me');
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Try to refresh token if unauthorized
        const newToken = await this.refreshToken();
        if (newToken) {
          return this.getCurrentUser(); // Retry with new token
        }
      }
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return !!SessionManager.getAuthToken();
  }

  static requireAuth(redirectTo: string = '/login') {
    return SessionManager.requireAuth(redirectTo);
  }

  static requireNoAuth(redirectTo: string = '/dashboard') {
    return SessionManager.requireNoAuth(redirectTo);
  }
}

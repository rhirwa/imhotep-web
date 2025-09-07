import { redirect } from 'next/navigation';

type SessionData = {
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
};

export class SessionManager {
  private static readonly AUTH_COOKIE = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!;
  private static readonly REFRESH_COOKIE = process.env.NEXT_PUBLIC_REFRESH_COOKIE_NAME!;
  private static readonly TENANT_COOKIE = process.env.NEXT_PUBLIC_TENANT_COOKIE_NAME!;
  private static isServer = typeof window === 'undefined';

  private static getCookie(name: string): string | undefined {
    if (this.isServer) {
      return undefined; // Server-side cookie access will be handled by individual methods
    }
    
    // Client-side cookie access
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  }

  private static setCookie(name: string, value: string, options: { maxAge: number }) {
    if (this.isServer) return;
    
    document.cookie = `${name}=${value}; Path=/; ` +
      `Max-Age=${options.maxAge}; ` +
      `SameSite=Lax; ` +
      `${process.env.NODE_ENV === 'production' ? 'Secure; ' : ''}` +
      'HttpOnly';
  }

  private static deleteCookie(name: string) {
    if (this.isServer) return;
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  static setSession(data: SessionData) {
    if (this.isServer) {
      // Server-side session setting should be handled in Server Components or Server Actions
      throw new Error('setSession cannot be called on the server. Use Server Components or Server Actions instead.');
    }
    
    // Set auth token
    this.setCookie(this.AUTH_COOKIE, data.accessToken, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set refresh token
    this.setCookie(this.REFRESH_COOKIE, data.refreshToken, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Set tenant ID
    this.setCookie(this.TENANT_COOKIE, data.tenantId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  static clearSession() {
    if (this.isServer) {
      // Server-side session clearing should be handled in Server Components or Server Actions
      throw new Error('clearSession cannot be called on the server. Use Server Components or Server Actions instead.');
    }
    
    this.deleteCookie(this.AUTH_COOKIE);
    this.deleteCookie(this.REFRESH_COOKIE);
    this.deleteCookie(this.TENANT_COOKIE);
  }

  static getAuthToken(): string | undefined {
    if (this.isServer) {
      // For server-side usage, this should be called from a Server Component or Server Action
      // that can access cookies()
      return undefined;
    }
    return this.getCookie(this.AUTH_COOKIE);
  }

  static getTenantId(): string | undefined {
    if (this.isServer) {
      // For server-side usage, this should be called from a Server Component or Server Action
      // that can access cookies()
      return undefined;
    }
    return this.getCookie(this.TENANT_COOKIE);
  }

  static async requireAuth(redirectTo = '/login') {
    if (this.isServer) {
      // In server components, use cookies() and redirect() directly
      const { cookies: serverCookies } = await import('next/headers');
      const token = serverCookies().get(this.AUTH_COOKIE)?.value;
      if (!token) {
        redirect(redirectTo);
      }
      return token;
    }
    
    // Client-side check
    const token = this.getAuthToken();
    if (!token) {
      window.location.href = redirectTo;
    }
    return token;
  }

  static async requireNoAuth(redirectTo = '/dashboard') {
    if (this.isServer) {
      // In server components, use cookies() and redirect() directly
      const { cookies: serverCookies } = await import('next/headers');
      const token = serverCookies().get(this.AUTH_COOKIE)?.value;
      if (token) {
        redirect(redirectTo);
      }
      return;
    }
    
    // Client-side check
    const token = this.getAuthToken();
    if (token) {
      window.location.href = redirectTo;
    }
  }
}

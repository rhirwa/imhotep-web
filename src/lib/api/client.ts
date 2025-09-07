import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;
  private isServer: boolean;

  private constructor() {
    this.isServer = typeof window === 'undefined';
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_CORE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async getCookie(name: string): Promise<string | undefined> {
    if (this.isServer) {
      const { cookies } = await import('next/headers');
      return cookies().get(name)?.value;
    } else {
      // Client-side cookie access
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.client.interceptors.request.use(
      async (config) => {
        const [token, tenantId] = await Promise.all([
          this.getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!),
          this.getCookie(process.env.NEXT_PUBLIC_TENANT_COOKIE_NAME!)
        ]);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;
          const message = (data as any)?.message || error.message;
          return Promise.reject(new ApiError(message, status, data));
        }
        return Promise.reject(error);
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const api = ApiClient.getInstance();

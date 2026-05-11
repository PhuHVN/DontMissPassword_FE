import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  ItemRequest,
  ItemResponse,
  BasePaginatedList,
  ApiResponse,
  AuthResponse,
  AuthRequest,
  AccountRequest,
  AccountResponse,
  VerifyOtpRequest,
  ResendOtpRequest,
} from "../types/api";

/**
 * API Client - Configured for Backend API
 * Base URL should be from environment variables
 */
class ApiClient {
  private client: AxiosInstance;
  private readonly baseURL = ((import.meta as any).env.VITE_API_BASE_URL as string) || "https://localhost:7187/api/v1";

  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - Add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearTokens();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem("access_token");
  }

  private clearTokens(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  // ============== Auth Endpoints ==============

  async login(request: AuthRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      request
    );
    const tokens = response.data.data;
    this.storeTokens(tokens.token, tokens.refreshToken);
    return tokens;
  }

  async register(request: AccountRequest): Promise<AccountResponse> {
    const response = await this.client.post<ApiResponse<AccountResponse>>(
      "/auth/register",
      request
    );
    return response.data.data;
  }

  async registerByUsername(request: AccountRequest): Promise<AccountResponse> {
    const response = await this.client.post<ApiResponse<AccountResponse>>(
      "/auth/registerByUsername",
      request
    );
    return response.data.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>(
      `/auth/refresh-token/${refreshToken}`
    );
    const tokens = response.data.data;
    this.storeTokens(tokens.token, tokens.refreshToken);
    return tokens;
  }

  async verifyOtp(request: VerifyOtpRequest): Promise<void> {
    await this.client.patch<ApiResponse<void>>(
      "/auth/verifyOtp",
      request
    );
  }

  async resendOtp(email: string): Promise<void> {
    await this.client.post<ApiResponse<void>>(
      `/auth/resendOtp/${email}`
    );
  }

  // ============== Vault Item Endpoints ==============

  /**
   * Get all vault items (admin endpoint)
   */
  async getAllVaultItems(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Promise<BasePaginatedList<ItemResponse>> {
    const response = await this.client.get<
      ApiResponse<BasePaginatedList<ItemResponse>>
    >("/vault-items/admin", {
      params: { pageIndex, pageSize },
    });
    return response.data.data;
  }

  /**
   * Get vault items for current logged-in user
   */
  async getVaultItemsByUser(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Promise<BasePaginatedList<ItemResponse>> {
    const response = await this.client.get<
      ApiResponse<BasePaginatedList<ItemResponse>>
    >("/vault-items", {
      params: { pageIndex, pageSize },
    });
    return response.data.data;
  }

  /**
   * Get decrypted password for a vault item
   */
  async getDecryptedPassword(itemId: string): Promise<string> {
    const response = await this.client.get<ApiResponse<string>>(
      "/vault-items/decrypt",
      {
        params: { id: itemId },
      }
    );
    return response.data.data;
  }

  /**
   * Create new vault item
   */
  async createVaultItem(request: ItemRequest): Promise<ItemResponse> {
    const response = await this.client.post<ApiResponse<ItemResponse>>(
      "/vault-items",
      request
    );
    return response.data.data;
  }

  /**
   * Update vault item (if endpoint exists)
   */
  async updateVaultItem(
    id: string,
    request: ItemRequest
  ): Promise<ItemResponse> {
    const response = await this.client.put<ApiResponse<ItemResponse>>(
      `/vault-items/${id}`,
      request
    );
    return response.data.data;
  }

  /**
   * Delete vault item
   */
  async deleteVaultItem(id: string): Promise<void> {
    await this.client.delete(`/vault-items/${id}`);
  }

  // ============== Account Endpoints ==============

  async createAccount(request: AccountRequest): Promise<AccountResponse> {
    const response = await this.client.post<ApiResponse<AccountResponse>>(
      "/accounts",
      request
    );
    return response.data.data;
  }

  async getAccountById(id: string): Promise<AccountResponse> {
    const response = await this.client.get<ApiResponse<AccountResponse>>(
      `/accounts/${id}`
    );
    return response.data.data;
  }

  async getAllAccounts(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Promise<BasePaginatedList<AccountResponse>> {
    const response = await this.client.get<
      ApiResponse<BasePaginatedList<AccountResponse>>
    >("/accounts", {
      params: { pageIndex, pageSize },
    });
    return response.data.data;
  }

  async updateAccount(request: AccountRequest): Promise<AccountResponse> {
    const response = await this.client.put<ApiResponse<AccountResponse>>(
      "/accounts",
      request
    );
    return response.data.data;
  }

  async deleteAccount(id: string): Promise<void> {
    await this.client.delete(`/accounts/${id}`);
  }

  // ============== Token Management ==============

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  logout(): void {
    this.clearTokens();
  }
}

export const apiClient = new ApiClient();

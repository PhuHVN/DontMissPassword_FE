/**
 * API DTOs - Synchronized with Backend (DontMissPassword.Application.DTOs)
 */

// Account DTOs
export interface AccountRequest {
  UsernameOrEmail: string;
  Password: string;
  FullName: string;
}

export interface AccountResponse {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastUpdatedAt: string | null;
  status: StatusEnum;
}

// Auth DTOs
export interface AuthRequest {
  EmailOrUsername: string;
  Password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

// OTP DTOs
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

// Vault Item DTOs
export interface ItemRequest {
  title: string;
  username: string;
  password: string;
}

export interface ItemResponse {
  id: string;
  title: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  status: StatusEnum;
  vaultId: string;
}

// Paginated Response
export interface BasePaginatedList<T> {
  items: T[];
  totalItems: number;
  pageIndex: number;
  totalPages: number;
  pageSize: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  code: StatusCodeHelper;
  statusCode: string;
  message: string;
  data: T;
}

// Enums
export enum StatusEnum {
  Active = "Active",
  Inactive = "Inactive",
}

export enum StatusCodeHelper {
  Success = "Success",
  Error = "Error",
  NotFound = "NotFound",
  Unauthorized = "Unauthorized",
}

// Auth Token Storage
export interface TokenPayload {
  sub: string; // user id
  email: string;
  iat: number;
  exp: number;
}

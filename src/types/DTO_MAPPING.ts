/**
 * BACKEND ↔ FRONTEND DTO MAPPING
 * 
 * This file documents the mapping between Backend DTOs and Frontend Types
 * to ensure type safety and synchronization across the full stack.
 */

// ============================================
// BACKEND DTOs (C# - DontMissPassword.Application.DTOs)
// ============================================

/**
 * BACKEND: ItemRequest (from VaultItemDtos/ItemRequest.cs)
 * Location: DontMissPassword.Application/DTOs/VaultItemDtos/ItemRequest.cs
 */
interface Backend_ItemRequest {
  title: string;         // public string Title { get; set; }
  username: string;      // public string Username { get; set; }
  password: string;      // public string Password { get; set; }
}

/**
 * BACKEND: ItemResponse (from VaultItemDtos/ItemResponse.cs)
 * Location: DontMissPassword.Application/DTOs/VaultItemDtos/ItemResponse.cs
 */
interface Backend_ItemResponse {
  id: string;            // public string Id { get; set; }
  title: string;         // public string Title { get; set; }
  username: string;      // public string Username { get; set; }
  password: string;      // public string Password { get; set; } [ENCRYPTED]
  createdAt: string;     // public DateTime CreatedAt { get; set; }
  updatedAt: string;     // public DateTime UpdatedAt { get; set; }
  status: string;        // public StatusEnum Status { get; set; }
  vaultId: string;       // public string VaultId { get; set; }
}

/**
 * BACKEND: AccountRequest (from AccountDtos/AccountRequest.cs)
 * Location: DontMissPassword.Application/DTOs/AccountDtos/AccountRequest.cs
 */
interface Backend_AccountRequest {
  email: string;         // public string Email { get; set; }
  password: string;      // public string Password { get; set; }
  fullName: string;      // public string FullName { get; set; }
}

/**
 * BACKEND: AccountResponse (from AccountDtos/AccountResponse.cs)
 * Location: DontMissPassword.Application/DTOs/AccountDtos/AccountResponse.cs
 */
interface Backend_AccountResponse {
  id: string;            // public string Id { get; set; }
  email: string;         // public string Email { get; set; }
  fullName: string;      // public string FullName { get; set; }
  createdAt: string;     // public DateTime CreatedAt { get; set; }
  lastUpdatedAt: string | null; // public DateTime? LastUpdatedAt { get; set; }
  status: string;        // public StatusEnum Status { get; set; }
}

/**
 * BACKEND: AuthRequest (from AuthDtos/AuthRequest.cs)
 * Location: DontMissPassword.Application/DTOs/AuthDtos/AuthRequest.cs
 */
interface Backend_AuthRequest {
  email: string;         // public string Email { get; set; }
  password: string;      // public string Password { get; set; }
}

/**
 * BACKEND: AuthResponse (from AuthDtos/AuthResponse.cs)
 * Location: DontMissPassword.Application/DTOs/AuthDtos/AuthResponse.cs
 */
interface Backend_AuthResponse {
  token: string;         // public string Token { get; set; }
  refreshToken: string;  // public string RefreshToken { get; set; }
}

/**
 * BACKEND: ApiResponse<T> (from ApiResponse.cs)
 * Location: DontMissPassword.Application/DTOs/ApiResponse.cs
 * Generic wrapper for all API responses
 */
interface Backend_ApiResponse<T> {
  code: string;          // StatusCodeHelper enum
  statusCode: string;    // "200", "201", "400", etc
  message: string;       // Human-readable message
  data: T;              // Actual response data
}

/**
 * BACKEND: BasePaginatedList<T> (from Domain/Abstractions/)
 * Location: DontMissPassword.Domain/Abstractions/BasePaginatedList.cs
 */
interface Backend_BasePaginatedList<T> {
  items: T[];           // IReadOnlyCollection<T> Items
  totalItems: number;   // int TotalItems
  pageIndex: number;    // int PageIndex
  totalPages: number;   // int TotalPages
  pageSize: number;     // int PageSize
}

// ============================================
// FRONTEND TYPES (TypeScript)
// ============================================

/**
 * FRONTEND: ItemRequest (maps to Backend_ItemRequest)
 * Location: src/types/api.ts
 */
interface Frontend_ItemRequest {
  title: string;         // ✅ Matches: string
  username: string;      // ✅ Matches: string
  password: string;      // ✅ Matches: string
}

/**
 * FRONTEND: ItemResponse (maps to Backend_ItemResponse)
 * Location: src/types/api.ts
 */
interface Frontend_ItemResponse {
  id: string;            // ✅ Matches: string
  title: string;         // ✅ Matches: string
  username: string;      // ✅ Matches: string
  password: string;      // ✅ Matches: string [ENCRYPTED]
  createdAt: string;     // ✅ Matches: string (ISO format)
  updatedAt: string;     // ✅ Matches: string
  status: Frontend_StatusEnum; // ✅ Matches: enum
  vaultId: string;       // ✅ Matches: string
}

/**
 * FRONTEND: StatusEnum (maps to Backend StatusEnum)
 * Location: src/types/api.ts
 */
enum Frontend_StatusEnum {
  Active = "Active",     // ✅ Matches Backend
  Inactive = "Inactive"  // ✅ Matches Backend
}

/**
 * FRONTEND: ApiResponse<T> (maps to Backend_ApiResponse)
 * Location: src/types/api.ts
 */
interface Frontend_ApiResponse<T> {
  code: string;          // ✅ Matches: StatusCodeHelper
  statusCode: string;    // ✅ Matches: string
  message: string;       // ✅ Matches: string
  data: T;              // ✅ Matches: T
}

/**
 * FRONTEND: BasePaginatedList<T> (maps to Backend equivalent)
 * Location: src/types/api.ts
 */
interface Frontend_BasePaginatedList<T> {
  items: T[];           // ✅ Matches: T[]
  totalItems: number;   // ✅ Matches: number
  pageIndex: number;    // ✅ Matches: number
  totalPages: number;   // ✅ Matches: number
  pageSize: number;     // ✅ Matches: number
}

// ============================================
// API ENDPOINT MAPPING
// ============================================

/**
 * CREATE VAULT ITEM
 * 
 * Endpoint:  POST /api/v1/vault-items
 * 
 * Request Body (Backend):
 * {
 *   "title": "string",
 *   "username": "string",
 *   "password": "string"
 * }
 * 
 * Response (Backend):
 * {
 *   "code": "Success",
 *   "statusCode": "201",
 *   "message": "Vault item created successfully",
 *   "data": {
 *     "id": "uuid",
 *     "title": "string",
 *     "username": "string",
 *     "password": "encrypted_string",
 *     "createdAt": "2024-05-09T...",
 *     "updatedAt": "2024-05-09T...",
 *     "status": "Active",
 *     "vaultId": "uuid"
 *   }
 * }
 * 
 * Frontend Mapping:
 * - Request DTO: ItemRequest ✅
 * - Response DTO: ApiResponse<ItemResponse> ✅
 * - Hook: useCreateVaultItem() ✅
 * - Service: apiClient.createVaultItem() ✅
 */

/**
 * GET VAULT ITEMS (Paginated)
 * 
 * Endpoint:  GET /api/v1/vault-items?pageIndex=1&pageSize=10
 * 
 * Response (Backend):
 * {
 *   "code": "Success",
 *   "statusCode": "200",
 *   "message": "Get vault items by account login successfully",
 *   "data": {
 *     "items": [...],
 *     "totalItems": 25,
 *     "pageIndex": 1,
 *     "totalPages": 3,
 *     "pageSize": 10
 *   }
 * }
 * 
 * Frontend Mapping:
 * - Response DTO: ApiResponse<BasePaginatedList<ItemResponse>> ✅
 * - Hook: useVaultItems(pageIndex, pageSize) ✅
 * - Service: apiClient.getVaultItemsByUser() ✅
 */

/**
 * GET DECRYPTED PASSWORD
 * 
 * Endpoint:  GET /api/v1/vault-items/decrypt?id={itemId}
 * 
 * Response (Backend):
 * {
 *   "code": "Success",
 *   "statusCode": "200",
 *   "message": "Get decrypted vault items...",
 *   "data": "plaintext_password"
 * }
 * 
 * Frontend Mapping:
 * - Response DTO: ApiResponse<string> ✅
 * - Hook: useDecryptedPassword(itemId) ✅
 * - Service: apiClient.getDecryptedPassword() ✅
 */

/**
 * UPDATE VAULT ITEM
 * 
 * Endpoint:  PUT /api/v1/vault-items/{id}
 * 
 * Request Body (Backend):
 * {
 *   "title": "string",
 *   "username": "string",
 *   "password": "string"
 * }
 * 
 * Response (Backend):
 * {
 *   "code": "Success",
 *   "statusCode": "200",
 *   "message": "Vault item updated successfully",
 *   "data": { ItemResponse }
 * }
 * 
 * Frontend Mapping:
 * - Request DTO: ItemRequest ✅
 * - Response DTO: ApiResponse<ItemResponse> ✅
 * - Hook: useUpdateVaultItem() ✅
 * - Service: apiClient.updateVaultItem() ✅
 */

/**
 * DELETE VAULT ITEM
 * 
 * Endpoint:  DELETE /api/v1/vault-items/{id}
 * 
 * Response (Backend):
 * HTTP 204 No Content
 * 
 * Frontend Mapping:
 * - Response DTO: void ✅
 * - Hook: useDeleteVaultItem() ✅
 * - Service: apiClient.deleteVaultItem() ✅
 */

// ============================================
// VALIDATION MAPPING
// ============================================

/**
 * Backend Validation (C#)
 * Location: DontMissPassword.Application/Services/VaultItemService.cs
 * 
 * if(request.Username == null || request.Password == null || request.Title == null)
 * {
 *   throw new ArgumentException("Invalid request");
 * }
 */

/**
 * Frontend Validation (TypeScript + Zod)
 * Location: src/components/VaultManager/VaultItemForm.tsx
 * 
 * const itemFormSchema = z.object({
 *   title: z.string().min(1).min(3).max(100),
 *   username: z.string().min(1).min(2).max(100),
 *   password: z.string().min(1).min(6).max(255),
 * });
 */

// ============================================
// SYNC CHECKLIST
// ============================================

/**
 * ✅ FRONTEND ↔ BACKEND DTO SYNC CHECKLIST
 * 
 * ItemRequest
 * - [x] title: string
 * - [x] username: string
 * - [x] password: string
 * 
 * ItemResponse
 * - [x] id: string
 * - [x] title: string
 * - [x] username: string
 * - [x] password: string (encrypted)
 * - [x] createdAt: string
 * - [x] updatedAt: string
 * - [x] status: enum
 * - [x] vaultId: string
 * 
 * StatusEnum
 * - [x] Active
 * - [x] Inactive
 * 
 * BasePaginatedList
 * - [x] items: T[]
 * - [x] totalItems: number
 * - [x] pageIndex: number
 * - [x] totalPages: number
 * - [x] pageSize: number
 * 
 * ApiResponse
 * - [x] code: string
 * - [x] statusCode: string
 * - [x] message: string
 * - [x] data: T
 * 
 * All DTOs are in sync! ✅
 */

// ============================================
// ADDING NEW DTOs
// ============================================

/**
 * When Backend adds new DTO:
 * 
 * 1. Check Backend DTO Location
 *    Example: DontMissPassword.Application/DTOs/MyFeatureDtos/MyFeatureRequest.cs
 * 
 * 2. Create Frontend Type
 *    Location: src/types/api.ts
 *    interface MyFeatureRequest {
 *      // Map each Backend property
 *    }
 * 
 * 3. Update API Service
 *    Location: src/services/api.ts
 *    async myFeatureMethod(request: MyFeatureRequest) {
 *      // Implement API call
 *    }
 * 
 * 4. Create React Query Hook
 *    Location: src/hooks/useVaultItems.ts (or new file)
 *    export const useMyFeature = () => {
 *      // Implement hook
 *    }
 * 
 * 5. Use in Component
 *    const { data } = useMyFeature();
 */

// ============================================
// COMMON PITFALLS
// ============================================

/**
 * ❌ DON'T: Hardcode API URLs
 * const response = await fetch('http://localhost:5001/api/v1/vault-items');
 * 
 * ✅ DO: Use API service
 * const response = await apiClient.getVaultItemsByUser();
 * 
 * ---
 * 
 * ❌ DON'T: Skip validation on frontend
 * const item = formData; // No validation
 * 
 * ✅ DO: Use Zod schema
 * const item = await itemFormSchema.parseAsync(formData);
 * 
 * ---
 * 
 * ❌ DON'T: Store passwords in state
 * const [password, setPassword] = useState(plaintext);
 * 
 * ✅ DO: Only decrypt on demand
 * const password = await apiClient.getDecryptedPassword(id);
 * 
 * ---
 * 
 * ❌ DON'T: Ignore API response structure
 * const items = response.data; // Wrong!
 * 
 * ✅ DO: Use correct nested structure
 * const items = response.data.data; // ApiResponse<T>.data
 */

export {};

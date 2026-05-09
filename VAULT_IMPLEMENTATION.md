# 🔐 DontMissPassword - Frontend Implementation Guide

## Quick Start

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Copy .env file
cp .env.example .env

# Update API base URL (if needed)
# .env: VITE_API_BASE_URL=http://localhost:5001/api/v1

# Start dev server
npm run dev
```

### 2. Project Structure Overview

```
src/
├── types/api.ts              ← DTOs matching backend
├── services/api.ts           ← Axios client
├── hooks/useVaultItems.ts    ← React Query hooks
├── utils/helpers.ts          ← Helper functions
├── components/VaultManager/  ← Main component
├── App.tsx                   ← Setup QueryClient
└── main.tsx                  ← Entry point
```

---

## 🏗️ Architecture Layers

### Layer 1: Type Safety (`src/types/api.ts`)

**Purpose**: Define API contracts (DTOs from Backend)

```typescript
// Maps to Backend DTO exactly
export interface ItemRequest {
  title: string;
  username: string;
  password: string;
}

export interface ItemResponse {
  id: string;
  title: string;
  username: string;
  password: string; // encrypted
  createdAt: string;
  updatedAt: string;
  status: StatusEnum;
  vaultId: string;
}
```

**DTO Mapping:**

- Backend: `DontMissPassword.Application.DTOs.VaultItemDtos.ItemRequest`
- Frontend: `ItemRequest` (1:1 match)

---

### Layer 2: API Service (`src/services/api.ts`)

**Purpose**: HTTP requests with JWT token management

```typescript
// Singleton API client
const apiClient = new ApiClient();

// Usage
await apiClient.createVaultItem({
  title: "Gmail",
  username: "user@example.com",
  password: "password123",
});

await apiClient.getVaultItemsByUser(pageIndex, pageSize);

const password = await apiClient.getDecryptedPassword(itemId);

await apiClient.deleteVaultItem(itemId);
```

**Features:**

- ✅ Request interceptor adds JWT token
- ✅ Response interceptor handles 401 errors
- ✅ Auto-logout on token expiration
- ✅ Token storage management

---

### Layer 3: State Management (`src/hooks/useVaultItems.ts`)

**Purpose**: React Query for server state caching

```typescript
// Query - Fetch data
const { data, isLoading, error } = useVaultItems(
  pageIndex, // 1
  pageSize, // 10
);

// Mutations - Create/Update/Delete
const { mutate, isPending } = useCreateVaultItem();
mutate({ title: "Gmail", username: "user@email.com", password: "pass" });

const { mutate: updateMutate } = useUpdateVaultItem();
const { mutate: deleteMutate } = useDeleteVaultItem();
```

**Benefits:**

- ✅ Automatic caching
- ✅ Deduplication
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Cache invalidation

---

### Layer 4: Components

**Purpose**: UI presentation & user interaction

#### VaultManager (Container)

- Manages form visibility state
- Handles pagination
- Coordinates between Form & Table
- Displays stats & loading states

#### VaultItemTable

- Displays list of passwords
- Show/Hide password toggle
- Copy to clipboard
- Edit/Delete actions
- Loading skeleton

#### VaultItemForm

- React Hook Form + Zod validation
- Maps form data to ItemRequest DTO
- Submit handler for create/update
- Error messages display

---

## 📝 Component Integration

### Basic Usage

```tsx
import { VaultManager } from "./components/VaultManager";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VaultManager />
    </QueryClientProvider>
  );
}
```

### Form Submission Flow

```
User fills form
     ↓
React Hook Form validation (Zod schema)
     ↓
handleFormSubmit() called
     ↓
mutation.mutate(data) in VaultItemService
     ↓
apiClient.createVaultItem(ItemRequest)
     ↓
Backend receives ItemRequest DTO
     ↓
Response returns ItemResponse
     ↓
React Query cache updated
     ↓
Component re-renders with new data
```

### Example: Create Password

```typescript
// In VaultItemForm.tsx
const handleFormSubmit = async (data: ItemRequest) => {
  try {
    // data = { title, username, password }
    // This is the ItemRequest DTO from Backend

    await createMutation.mutateAsync(data);
    // API sends POST /vault-items with data
    // Backend returns ItemResponse (with encryption)

    handleCancel(); // Close form
  } catch (error) {
    console.error(error);
  }
};
```

---

## 🔑 Key Features Implementation

### 1. Form Validation (Zod)

```typescript
const itemFormSchema = z.object({
  title: z.string().min(3).max(100),
  username: z.string().min(2).max(100),
  password: z.string().min(6).max(255),
});
```

**Mapping to Backend:**

- Backend validates in `ItemRequest` DTO
- Frontend validates before sending
- Error messages shown to user

### 2. Password Display Control

```typescript
// Hide by default
const displayPassword = isRevealed
  ? item.password // encrypted, shown from API
  : maskPassword(item.password); // "•••••••"

// Toggle on eye icon click
const handleRevealPassword = (itemId) => {
  setRevealedPasswords((prev) => {
    // Toggle visibility
  });
};
```

### 3. Copy to Clipboard

```typescript
const handleCopy = async () => {
  const copied = await copyToClipboard(item.password);
  if (copied) {
    showSuccessMessage(); // Green checkmark
  }
};
```

### 4. Pagination

```typescript
const [currentPage, setCurrentPage] = useState(1);

const { data } = useVaultItems(currentPage, pageSize);
// data = { items[], totalItems, totalPages, pageIndex, pageSize }

// Render pagination buttons based on totalPages
```

### 5. Error Handling

```typescript
// Query Error
if (vaultItemsQuery.error) {
  return <ErrorBox error={vaultItemsQuery.error} />;
}

// Mutation Error
{createMutation.error && (
  <div className="bg-red-50">
    {createMutation.error.message}
  </div>
)}
```

---

## 🔄 Data Flow Examples

### Create Password

```
Form Input: { title, username, password }
       ↓
Zod Validation: ✓
       ↓
apiClient.createVaultItem(ItemRequest)
       ↓
POST /vault-items
       ↓
Backend:
  - Encrypt password with IV
  - Create VaultItem entity
  - Save to DB
       ↓
Response: ItemResponse (with encrypted password)
       ↓
React Query:
  - Cache ItemResponse
  - Invalidate list queries
       ↓
Component Update:
  - Close form
  - Show success message
  - Refresh table
```

### Delete Password

```
Click Delete button
       ↓
Confirmation dialog
       ↓
deleteMutation.mutate(itemId)
       ↓
DELETE /vault-items/{id}
       ↓
Backend:
  - Find VaultItem
  - Set status = Inactive (soft delete)
  - Save
       ↓
React Query:
  - Remove from cache
  - Refetch list
       ↓
Table Updates:
  - Row removed
```

---

## 🧪 Testing the Component

### Manual Testing Checklist

**Create**

- [ ] Fill form with valid data
- [ ] Click "Add Password"
- [ ] See new item in table

**Read**

- [ ] Page loads with password list
- [ ] Pagination works
- [ ] Stats show correct count

**Update**

- [ ] Click Edit on item
- [ ] Form pre-fills data
- [ ] Update any field
- [ ] Click "Update Password"
- [ ] Confirm in table

**Delete**

- [ ] Click Delete
- [ ] Confirm in dialog
- [ ] Item removed from table

**UI/UX**

- [ ] Loading spinner appears
- [ ] Error messages display
- [ ] Show/Hide password toggle works
- [ ] Copy button shows checkmark
- [ ] Form validation shows errors

**Edge Cases**

- [ ] Empty password list
- [ ] Network error
- [ ] Validation error
- [ ] Concurrent operations

---

## 🚀 Performance Optimizations

### React Query Settings

```typescript
// Cache 5 minutes
staleTime: 5 * 60 * 1000;

// Keep in memory 10 minutes
gcTime: 10 * 60 * 1000;

// Retry failed requests
retry: 2;

// Don't refetch on window focus
refetchOnWindowFocus: false;
```

### Component Optimizations

- Memoization of handlers
- Conditional rendering
- Pagination (not load all)
- Lazy loading if needed

---

## 🔐 Security Considerations

### JWT Token

```typescript
// Token stored in localStorage
localStorage.setItem("access_token", token);

// Auto-added to requests
headers.Authorization = `Bearer ${token}`;

// Auto-logout on 401
if (error.response?.status === 401) {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}
```

### Password Display

```typescript
// Server-side encrypted
// Frontend receives encrypted data
// User must request decryption via API
const plaintext = await apiClient.getDecryptedPassword(id);

// User can view but not copy encrypted data
```

---

## 📚 API Reference

### Endpoints & Mapping

| Endpoint             | Method | Request DTO    | Response DTO                    |
| -------------------- | ------ | -------------- | ------------------------------- |
| /vault-items         | POST   | ItemRequest    | ItemResponse                    |
| /vault-items         | GET    | (query params) | BasePaginatedList<ItemResponse> |
| /vault-items/{id}    | GET    | -              | ItemResponse                    |
| /vault-items/{id}    | PUT    | ItemRequest    | ItemResponse                    |
| /vault-items/{id}    | DELETE | -              | void                            |
| /vault-items/decrypt | GET    | (query: id)    | string (encrypted)              |

### DTO Reference

**ItemRequest** (Input)

```typescript
{
  title: string; // Service/app name
  username: string; // Email or username
  password: string; // Plaintext (encrypted server-side)
}
```

**ItemResponse** (Output)

```typescript
{
  id: string; // GUID
  title: string;
  username: string;
  password: string; // Encrypted with IV
  createdAt: string; // ISO 8601
  updatedAt: string;
  status: "Active" | "Inactive";
  vaultId: string; // Links to user's vault
}
```

---

## 🛠️ Development Workflow

### Adding a New Feature

1. **Update API DTO** (`src/types/api.ts`)

   ```typescript
   export interface NewFeatureDTO {
     // ... properties
   }
   ```

2. **Add API endpoint** (`src/services/api.ts`)

   ```typescript
   async newFeatureEndpoint(request: NewFeatureDTO) {
     return await this.client.post('/endpoint', request);
   }
   ```

3. **Create React Query hook** (`src/hooks/useVaultItems.ts`)

   ```typescript
   export const useNewFeature = () => {
     return useQuery({
       queryKey: ["newFeature"],
       queryFn: () => apiClient.newFeatureEndpoint(),
     });
   };
   ```

4. **Use in Component** (`src/components/VaultManager/`)
   ```typescript
   const { data } = useNewFeature();
   // Render data
   ```

---

## ❓ FAQ

**Q: Why is password shown encrypted in table?**
A: API returns encrypted password. Decryption happens on client. For display, we show masked version until user clicks "reveal".

**Q: How does token refresh work?**
A: Currently not implemented in component. Backend supports `/auth/refresh-token/{token}`. Implement in API service interceptor if needed.

**Q: Can I customize colors?**
A: Yes! Edit `tailwind.config.js` → theme → extend → colors → primary/secondary

**Q: How to add more form fields?**
A: Update ItemRequest DTO in backend AND frontend types. Add field to Zod schema. Add input to form.

---

## 📞 Support

For issues:

1. Check browser console for errors
2. Verify API_BASE_URL in .env
3. Check backend is running
4. Review README_VAULT.md for detailed docs

---

Generated: May 2026 | DontMissPassword v1.0

# 🔗 Quick Reference - DontMissPassword Frontend

## File Map & Responsibilities

### 🎯 Entry Points

```
main.tsx        → Vite entry point
  ↓
App.tsx         → Setup QueryClientProvider
  ↓
VaultManager    → Main app component
```

### 🏗️ Architecture Layers

#### Layer 1: Types (Type Safety)

```
src/types/api.ts
├── ItemRequest (input)
├── ItemResponse (output)
├── BasePaginatedList
├── StatusEnum
└── StatusCodeHelper
```

#### Layer 2: Services (API Communication)

```
src/services/api.ts
├── ApiClient class
├── createVaultItem()
├── getVaultItemsByUser()
├── deleteVaultItem()
├── Token management
└── Request/Response interceptors
```

#### Layer 3: Hooks (State Management)

```
src/hooks/useVaultItems.ts
├── useVaultItems()        [Query]
├── useCreateVaultItem()   [Mutation]
├── useUpdateVaultItem()   [Mutation]
├── useDeleteVaultItem()   [Mutation]
└── useDecryptedPassword() [Query]
```

#### Layer 4: Components (UI)

```
src/components/VaultManager/
├── VaultManager.tsx       [Container]
├── VaultItemForm.tsx      [Presentation]
└── VaultItemTable.tsx     [Presentation]
```

---

## 🔄 Data Flow

```
User Action (Click Button)
    ↓
Component Event Handler (onClick, onSubmit)
    ↓
Form Validation (Zod)
    ↓
Call React Query Hook (useMutation)
    ↓
Hook calls API Service (apiClient.xxx)
    ↓
Axios adds JWT token & sends request
    ↓
Backend processes & responds
    ↓
React Query updates cache
    ↓
Component re-renders with new data
    ↓
User sees updated UI
```

---

## 📋 Common Patterns

### Pattern 1: Display List with Query

```typescript
const { data, isLoading, error } = useVaultItems(page, size);

return (
  <>
    {isLoading && <Skeleton />}
    {error && <ErrorBox />}
    {data?.items && <Table items={data.items} />}
  </>
);
```

### Pattern 2: Handle Form Submission

```typescript
const mutation = useCreateVaultItem();

const handleSubmit = async (formData) => {
  try {
    await mutation.mutateAsync(formData);
    showSuccess();
  } catch (error) {
    showError(error);
  }
};
```

### Pattern 3: Toggle State

```typescript
const [revealed, setRevealed] = useState<Set<string>>(new Set());

const toggle = (id: string) => {
  setRevealed((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
};

const display = revealed.has(id) ? password : maskPassword(password);
```

---

## 🛠️ Most Used Functions

### API Client

```typescript
import { apiClient } from "@/services/api";

// Create
await apiClient.createVaultItem(ItemRequest);

// Read
await apiClient.getVaultItemsByUser(pageIndex, pageSize);

// Update
await apiClient.updateVaultItem(id, ItemRequest);

// Delete
await apiClient.deleteVaultItem(id);
```

### React Query Hooks

```typescript
import { useVaultItems, useCreateVaultItem } from "@/hooks/useVaultItems";

// Fetch
const { data, isLoading } = useVaultItems(1, 10);

// Mutate
const { mutate, isPending } = useCreateVaultItem();
mutate(data);
```

### Utilities

```typescript
import { formatDate, maskPassword, copyToClipboard } from "@/utils/helpers";

formatDate("2024-05-09T10:30:00Z"); // → "May 9, 2024 10:30 AM"
maskPassword("secret123"); // → "•••••••••"
await copyToClipboard("text"); // → true/false
```

---

## 🎯 Component Props

### VaultItemTable

```typescript
interface VaultItemTableProps {
  items: ItemResponse[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (item: ItemResponse) => void;
  onDelete: (itemId: string) => void;
  onRevealPassword: (itemId: string) => void;
  revealedPasswords: Set<string>;
}
```

### VaultItemForm

```typescript
interface VaultItemFormProps {
  initialData?: ItemResponse;
  isSubmitting: boolean;
  onSubmit: (data: ItemRequest) => void;
  onCancel: () => void;
}
```

---

## 🔑 Key Constants & Enums

### Status Values

```typescript
StatusEnum.Active; // "Active"
StatusEnum.Inactive; // "Inactive"
```

### Query Keys

```typescript
vaultItemKeys.all; // ["vaultItems"]
vaultItemKeys.lists(); // ["vaultItems", "list"]
vaultItemKeys.list(1, 10); // ["vaultItems", "list", {pageIndex, pageSize}]
vaultItemKeys.detail(id); // ["vaultItems", "detail", id]
```

---

## 🐛 Debug Tips

### Check API Requests

```javascript
// Browser DevTools → Network tab
// Look for /api/v1/vault-items requests
// Check Headers for Authorization: Bearer token
// Check Response for correct data shape
```

### Check React Query Cache

```javascript
// React Query DevTools (if installed)
// Shows all cached queries and their state
// Useful for debugging cache invalidation
```

### Check Form Validation

```javascript
// React Hook Form DevTools (if installed)
// Shows form state and validation errors
// Useful for debugging form issues
```

### Log Query State

```typescript
const query = useVaultItems(1, 10);
console.log({
  status: query.status, // 'pending' | 'success' | 'error'
  isLoading: query.isLoading,
  isError: query.isError,
  data: query.data,
  error: query.error,
});
```

---

## 📝 Adding New Features

### To Add New API Endpoint

1. **Update Type** (`src/types/api.ts`)

   ```typescript
   export interface NewFeatureRequest { ... }
   export interface NewFeatureResponse { ... }
   ```

2. **Add API Method** (`src/services/api.ts`)

   ```typescript
   async newFeatureMethod(request: NewFeatureRequest): Promise<NewFeatureResponse> {
     return (await this.client.post('/endpoint', request)).data.data;
   }
   ```

3. **Create Hook** (`src/hooks/useVaultItems.ts`)

   ```typescript
   export const useNewFeature = () => {
     return useQuery({
       queryKey: ["newFeature"],
       queryFn: () => apiClient.newFeatureMethod(),
     });
   };
   ```

4. **Use in Component**
   ```typescript
   const { data } = useNewFeature();
   ```

---

## ✅ Checklist for Local Testing

- [ ] `npm install` completed
- [ ] `.env` file exists with API URL
- [ ] Backend running on `http://localhost:5001`
- [ ] `npm run dev` starts without errors
- [ ] Browser opens to `http://localhost:5173`
- [ ] Password table displays
- [ ] Can create password
- [ ] Can edit password
- [ ] Can delete password
- [ ] Can show/hide password
- [ ] Can copy password
- [ ] Pagination works
- [ ] Form validation works

---

## 🚀 Production Checklist

- [ ] Remove console.log statements
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Test network errors
- [ ] Run `npm run build`
- [ ] Test built app: `npm run preview`
- [ ] Update API URL for production
- [ ] Test with production backend
- [ ] Check browser console for errors
- [ ] Test on mobile devices
- [ ] Test password copy on all browsers

---

## 📚 File Sizes & Dependencies

### Key Dependencies

```json
{
  "@tanstack/react-query": "^5.100.9",
  "axios": "^1.16.0",
  "react-hook-form": "^7.75.0",
  "zod": "^4.4.3",
  "tailwindcss": "latest"
}
```

### Dev Dependencies

```json
{
  "typescript": "latest",
  "vite": "^8.0.10",
  "@vitejs/plugin-react": "^6.0.1"
}
```

---

## 🔗 External Resources

### Official Docs

- [React Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Related Files

- Backend API Docs: See DontMissPassword.API/Program.cs
- Backend DTOs: See DontMissPassword.Application/DTOs/
- API Controllers: See DontMissPassword.API/Controllers/

---

## 🆘 Quick Troubleshooting

| Issue                       | Solution                                           |
| --------------------------- | -------------------------------------------------- |
| `Cannot find module`        | Run `npm install`                                  |
| API 404 errors              | Check VITE_API_BASE_URL in .env                    |
| Passwords not showing       | Check backend is running on port 5001              |
| Form validation not working | Check Zod schema in VaultItemForm.tsx              |
| Token errors                | Clear localStorage, re-login (when auth added)     |
| Styling broken              | Check Tailwind CSS is processing (check index.css) |

---

**Last Update**: May 2026  
**Version**: 1.0  
**Status**: ✅ Ready for Development

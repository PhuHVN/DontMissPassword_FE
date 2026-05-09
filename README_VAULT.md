# DontMissPassword Frontend - React + Vite + TypeScript

Password management application inspired by 1Password with end-to-end encryption support.

## 📁 Project Structure

```
src/
├── types/
│   └── api.ts              # TypeScript interfaces (synced with Backend DTOs)
├── services/
│   └── api.ts              # Axios API client with interceptors
├── hooks/
│   └── useVaultItems.ts    # React Query hooks for data fetching
├── utils/
│   └── helpers.ts          # Utility functions (formatting, clipboard, etc.)
├── components/
│   └── VaultManager/
│       ├── VaultManager.tsx        # Main container component
│       ├── VaultItemTable.tsx      # Table for displaying passwords
│       ├── VaultItemForm.tsx       # Form for add/edit (React Hook Form + Zod)
│       └── index.ts
├── App.tsx                 # Root component with Query Provider
├── main.tsx                # Entry point
└── index.css               # Tailwind CSS styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x
- npm 10.x

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your API base URL:

   ```
   VITE_API_BASE_URL=http://localhost:5001/api/v1
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

4. **Build for production**
   ```bash
   npm run build
   ```

## 📚 Tech Stack

| Technology              | Purpose                           |
| ----------------------- | --------------------------------- |
| **React 19**            | UI framework                      |
| **TypeScript**          | Type safety                       |
| **Vite**                | Build tool & dev server           |
| **Tailwind CSS**        | Styling                           |
| **React Hook Form**     | Form state management             |
| **Zod**                 | Schema validation                 |
| **TanStack Query (v5)** | Server state management & caching |
| **Axios**               | HTTP client                       |

## 🏗️ Architecture

### Clean Architecture Principles

#### 1. **Type Safety Layer** (`src/types/api.ts`)

- TypeScript interfaces synchronized with Backend DTOs
- Single source of truth for API contracts
- Prevents runtime errors from API mismatches

#### 2. **Service Layer** (`src/services/api.ts`)

- Centralized API client
- Request/Response interceptors for JWT tokens
- Error handling for 401 Unauthorized (auto-logout)
- Token management (localStorage)

#### 3. **State Management Layer** (`src/hooks/useVaultItems.ts`)

- React Query for server state caching
- Query invalidation on mutations
- Optimistic updates support
- Automatic retry logic

#### 4. **Component Layer** (`src/components/`)

- Smart Container (`VaultManager.tsx`)
- Presentation Components (`VaultItemTable.tsx`, `VaultItemForm.tsx`)
- Separation of concerns
- Reusable & testable components

### Data Flow Diagram

```
User Action (Table/Form)
        ↓
React Component Handler
        ↓
React Hook Form Validation (Form)
        ↓
API Service (Axios)
        ↓
Backend API
        ↓
React Query (Mutation/Query)
        ↓
Update Component State
        ↓
UI Rerender
```

## 🔐 Authentication & Security

### JWT Token Management

- **Access Token**: Stored in `localStorage`
- **Refresh Token**: Stored in `localStorage` with 7-day expiration
- **Interceptor**: Automatically adds Bearer token to requests
- **Auto-logout**: 401 responses redirect to login

### Password Encryption

- Backend: AES encryption with IV (Initialization Vector)
- Frontend: Display decrypted password via API endpoint
- UI: Hide/Reveal button to toggle password visibility
- Copy: One-click copy to clipboard

## 📝 Form Validation

### Schema Definition (Zod)

```typescript
{
  title: string (3-100 characters)
  username: string (2-100 characters)
  password: string (6-255 characters)
}
```

### Error Handling

- Real-time validation feedback
- Custom error messages
- Field-level error display

## 🎯 API Integration

### Endpoints Used

#### Vault Items

- `POST /vault-items` - Create password entry
- `GET /vault-items` - List user's passwords (paginated)
- `GET /vault-items/decrypt?id={id}` - Get decrypted password
- `PUT /vault-items/{id}` - Update password entry (if implemented)
- `DELETE /vault-items/{id}` - Delete password entry

### Response Format

```typescript
{
  code: "Success" | "Error" | "NotFound" | "Unauthorized";
  statusCode: "200" | "201" | "400" | "401" | "404";
  message: string;
  data: T; // Generic payload
}
```

## 🔄 State Management with React Query

### Query Keys

```typescript
// Hierarchical keys for cache organization
vaultItemKeys.all; // Root key
vaultItemKeys.lists(); // All list queries
vaultItemKeys.list(p, ps); // Specific page
vaultItemKeys.details(); // All detail queries
vaultItemKeys.detail(id); // Specific item
```

### Mutation Side Effects

- **onSuccess**: Invalidate lists, update cache
- **onError**: Log error, display notification
- **onSettled**: Always-run cleanup

## 💡 Features

### ✅ Implemented

- [x] Display password list in table
- [x] Add new password with form validation
- [x] Edit existing password
- [x] Delete password with confirmation
- [x] Show/Hide password toggle
- [x] Copy password to clipboard
- [x] Pagination support
- [x] Loading states
- [x] Error messages
- [x] Type-safe API integration
- [x] Form validation (Zod + React Hook Form)
- [x] Responsive design (Tailwind CSS)
- [x] JWT authentication (ready)

### 🔄 Future Features

- [ ] Authentication pages (Login/Register)
- [ ] Master password/biometric auth
- [ ] Password strength indicator
- [ ] Search & filter passwords
- [ ] Tags/categories for organization
- [ ] Bulk import/export
- [ ] Two-factor authentication
- [ ] Activity logs
- [ ] Dark mode toggle
- [ ] Offline mode with sync

## 🧪 Testing

### Running Tests (when setup)

```bash
npm run test
```

### Manual Testing Checklist

- [ ] Create password entry
- [ ] View password list
- [ ] Edit password
- [ ] Delete password with confirmation
- [ ] Show/Hide password
- [ ] Copy password
- [ ] Navigate pagination
- [ ] Form validation errors
- [ ] API error handling
- [ ] Token refresh flow

## 📖 Usage Examples

### Using Custom Hooks

```typescript
import { useVaultItems, useCreateVaultItem } from '@/hooks/useVaultItems';

function MyComponent() {
  const { data, isLoading, error } = useVaultItems(1, 10);
  const { mutate, isPending } = useCreateVaultItem();

  return (
    // ...
  );
}
```

### API Service Usage

```typescript
import { apiClient } from "@/services/api";

// Create password
const response = await apiClient.createVaultItem({
  title: "Gmail",
  username: "user@example.com",
  password: "secure_password",
});

// Get decrypted password
const password = await apiClient.getDecryptedPassword(itemId);
```

## ⚙️ Configuration

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
```

### Tailwind CSS

Custom colors defined in `tailwind.config.js`:

- `primary`: #6366f1 (Indigo)
- `secondary`: #8b5cf6 (Violet)

## 🐛 Troubleshooting

### CORS Issues

Ensure backend has CORS enabled for your frontend URL:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
```

### 401 Unauthorized Errors

- Check JWT token in localStorage
- Verify API_BASE_URL is correct
- Ensure token is not expired

### API Connection Failed

- Verify backend is running on correct port
- Check VITE_API_BASE_URL environment variable
- Test with direct curl/Postman request

## 📦 Building & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## 📄 License

Part of DontMissPassword project.

## 👨‍💻 Development Guidelines

### Component Creation

1. Create component in appropriate folder
2. Export from index.ts
3. Add TypeScript interfaces
4. Use React Query for data
5. Handle loading/error states
6. Write JSDoc comments

### API Changes

1. Update DTOs in `src/types/api.ts`
2. Update `src/services/api.ts`
3. Update React Query hooks if needed
4. Update component props
5. Run TypeScript check: `npm run build`

### Form Validation

1. Update Zod schema in form component
2. Ensure schema matches Backend DTO
3. Test validation messages
4. Test error states

## 🤝 Contributing

Follow Clean Architecture principles and ensure:

- Type safety (no `any` types)
- Proper error handling
- Loading/error UI states
- Separation of concerns
- Reusable components

/**
 * API Client Usage Examples
 * Demonstrates all methods available in the API client
 */

import { apiClient } from '../services/api';

// ============== Authentication ==============

export async function exampleLogin() {
  const response = await apiClient.login({
    email: 'user@example.com',
    password: 'password123',
  });

  console.log('JWT Token:', response.token);
  console.log('Refresh Token:', response.refreshToken);
  // Tokens automatically stored in localStorage
}

export async function exampleRegister() {
  const newAccount = await apiClient.register({
    email: 'newuser@example.com',
    password: 'securepass123',
    fullName: 'John Doe',
  });

  console.log('Account created:', newAccount);
  // {
  //   id: "uuid",
  //   email: "newuser@example.com",
  //   fullName: "John Doe",
  //   createdAt: "2024-05-09T...",
  //   status: "Active"
  // }
}

export async function exampleRefreshToken() {
  const oldRefreshToken = localStorage.getItem('refresh_token');

  if (oldRefreshToken) {
    const newTokens = await apiClient.refreshToken(oldRefreshToken);
    console.log('New token:', newTokens.token);
    // Automatically updates localStorage
  }
}

// ============== Vault Items Management ==============

export async function exampleCreateVaultItem() {
  const newItem = await apiClient.createVaultItem({
    title: 'Gmail Account',
    username: 'user@gmail.com',
    password: 'MySecurePassword123!',
  });

  console.log('Created vault item:', newItem);
  // {
  //   id: "uuid",
  //   title: "Gmail Account",
  //   username: "user@gmail.com",
  //   password: "encrypted_data",
  //   iv: "initialization_vector",
  //   createdAt: "2024-05-09T...",
  //   status: "Active",
  //   vaultId: "vault_uuid"
  // }
}

export async function exampleGetVaultItems() {
  // Get paginated list for current user
  const paginatedList = await apiClient.getVaultItemsByUser(1, 10);

  console.log('Vault Items:', paginatedList);
  // {
  //   items: [...],
  //   totalItems: 25,
  //   pageIndex: 1,
  //   pageSize: 10,
  //   totalPages: 3
  // }

  paginatedList.items.forEach((item) => {
    console.log(`${item.title}: ${item.username}`);
  });
}

export async function exampleGetAllVaultItems() {
  // Admin endpoint - get all items
  const allItems = await apiClient.getAllVaultItems(1, 50);
  console.log('All items (admin):', allItems);
}

export async function exampleGetDecryptedPassword() {
  const itemId = 'some-item-uuid';

  // Get decrypted password
  const decryptedPassword = await apiClient.getDecryptedPassword(itemId);
  console.log('Decrypted password:', decryptedPassword);
  // Returns plaintext password from server decryption
}

export async function exampleUpdateVaultItem() {
  const itemId = 'item-uuid';

  const updated = await apiClient.updateVaultItem(itemId, {
    title: 'Gmail (Updated)',
    username: 'newemail@gmail.com',
    password: 'NewPassword456!',
  });

  console.log('Updated:', updated);
}

export async function exampleDeleteVaultItem() {
  const itemId = 'item-uuid';
  await apiClient.deleteVaultItem(itemId);
  console.log('Item deleted');
}

// ============== Account Management ==============

export async function exampleCreateAccount() {
  const account = await apiClient.createAccount({
    email: 'admin@example.com',
    password: 'adminpass123',
    fullName: 'Admin User',
  });

  console.log('Account created:', account);
}

export async function exampleGetAccount() {
  const accountId = 'account-uuid';
  const account = await apiClient.getAccountById(accountId);
  console.log('Account:', account);
}

export async function exampleGetAllAccounts() {
  const accounts = await apiClient.getAllAccounts(1, 10);
  console.log('Accounts:', accounts);
}

export async function exampleUpdateAccount() {
  const updated = await apiClient.updateAccount({
    email: 'updated@example.com',
    password: 'newpass123',
    fullName: 'Updated Name',
  });

  console.log('Updated account:', updated);
}

export async function exampleDeleteAccount() {
  const accountId = 'account-uuid';
  await apiClient.deleteAccount(accountId);
  console.log('Account deleted');
}

// ============== Token Management ==============

export function exampleTokenManagement() {
  // Check if authenticated
  const isAuth = apiClient.isAuthenticated();
  console.log('Is authenticated:', isAuth);

  // Get token from localStorage
  const token = localStorage.getItem('access_token');
  console.log('Current token:', token);

  // Logout
  apiClient.logout();
  console.log('Logged out, tokens cleared');
}

// ============== Error Handling ==============

export async function exampleErrorHandling() {
  try {
    await apiClient.createVaultItem({
      title: '', // Invalid
      username: 'user@example.com',
      password: 'password123',
    });
  } catch (error) {
    // Error object from API response
    console.error('API Error:', error);
    // {
    //   response: {
    //     status: 400,
    //     data: {
    //       code: "Error",
    //       statusCode: "400",
    //       message: "Title is required"
    //     }
    //   }
    // }
  }
}

// ============== Component Usage Examples ==============

/**
 * See VaultManager.tsx for complete React component examples using:
 * - useVaultItems() hook
 * - useCreateVaultItem() hook
 * - useUpdateVaultItem() hook
 * - useDeleteVaultItem() hook
 * 
 * See VaultItemForm.tsx for React Hook Form examples
 * See VaultItemTable.tsx for table display examples
 * 
 * NOTE: This file contains API client examples in TypeScript.
 * For React component examples, see the actual component files in:
 * src/components/VaultManager/
 */

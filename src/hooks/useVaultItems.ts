/**
 * Custom React Query Hooks for Vault Items
 * Handles data fetching, caching, and mutations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { apiClient } from "../services/api";
import type { ItemRequest, ItemResponse, BasePaginatedList } from "../types/api";

// Query Keys
export const vaultItemKeys = {
  all: ["vaultItems"] as const,
  lists: () => [...vaultItemKeys.all, "list"] as const,
  list: (pageIndex: number, pageSize: number) =>
    [...vaultItemKeys.lists(), { pageIndex, pageSize }] as const,
  details: () => [...vaultItemKeys.all, "detail"] as const,
  detail: (id: string) => [...vaultItemKeys.details(), id] as const,
};

// ============== Queries ==============

/**
 * Fetch vault items for current user
 */
export const useVaultItems = (
  pageIndex: number = 1,
  pageSize: number = 10
): UseQueryResult<BasePaginatedList<ItemResponse>> => {
  return useQuery({
    queryKey: vaultItemKeys.list(pageIndex, pageSize),
    queryFn: () => apiClient.getVaultItemsByUser(pageIndex, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
};

/**
 * Get decrypted password for a vault item
 */
export const useDecryptedPassword = (itemId: string) => {
  return useQuery({
    queryKey: [...vaultItemKeys.detail(itemId), "decrypted"],
    queryFn: () => apiClient.getDecryptedPassword(itemId),
    enabled: !!itemId, // Only run if itemId is provided
    staleTime: 0, // Always fresh
  });
};

// ============== Mutations ==============

/**
 * Create vault item
 */
export const useCreateVaultItem = (): UseMutationResult<
  ItemResponse,
  Error,
  ItemRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ItemRequest) => apiClient.createVaultItem(request),
    onSuccess: (data) => {
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({
        queryKey: vaultItemKeys.lists(),
      });
      // Add to cache
      queryClient.setQueryData(vaultItemKeys.detail(data.id), data);
    },
    onError: (error) => {
      console.error("Failed to create vault item:", error);
    },
  });
};

/**
 * Update vault item
 */
export const useUpdateVaultItem = (): UseMutationResult<
  ItemResponse,
  Error,
  { id: string; request: ItemRequest }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) =>
      apiClient.updateVaultItem(id, request),
    onSuccess: (data) => {
      // Update cache
      queryClient.setQueryData(vaultItemKeys.detail(data.id), data);
      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: vaultItemKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to update vault item:", error);
    },
  });
};

/**
 * Delete vault item
 */
export const useDeleteVaultItem = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteVaultItem(id),
    onSuccess: () => {
      // Invalidate all lists
      queryClient.invalidateQueries({
        queryKey: vaultItemKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to delete vault item:", error);
    },
  });
};

/**
 * Batch hook for common operations
 */
export const useVaultItemsManagement = () => {
  const createMutation = useCreateVaultItem();
  const updateMutation = useUpdateVaultItem();
  const deleteMutation = useDeleteVaultItem();

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

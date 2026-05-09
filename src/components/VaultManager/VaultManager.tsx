import { useState } from "react";
import { VaultItemTable } from "./VaultItemTable";
import { VaultItemForm } from "./VaultItemForm";
import {
  useVaultItems,
  useCreateVaultItem,
  useUpdateVaultItem,
  useDeleteVaultItem,
} from "../../hooks/useVaultItems";

import type { ItemRequest, ItemResponse } from "../../types/api";

interface VaultManagerProps {
  onLogout?: () => void;
}

export function VaultManager({ onLogout }: VaultManagerProps) {
  const [showForm, setShowForm] = useState(false);

  const [editingItem, setEditingItem] = useState<ItemResponse | undefined>();

  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(
    new Set(),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const vaultItemsQuery = useVaultItems(currentPage, pageSize);

  const createMutation = useCreateVaultItem();

  const updateMutation = useUpdateVaultItem();

  const deleteMutation = useDeleteVaultItem();

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEdit = (item: ItemResponse) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleFormSubmit = async (data: ItemRequest) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          request: data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }

      handleCancel();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteMutation.mutateAsync(itemId);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleRevealPassword = (itemId: string) => {
    setRevealedPasswords((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }

      return newSet;
    });
  };

  const totalItems = vaultItemsQuery.data?.totalItems ?? 0;

  const totalPages = vaultItemsQuery.data?.totalPages ?? 1;

  return (
    <div
      className="min-h-screen bg-[#13151a] text-white overflow-hidden"
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[140px]" />

        <div className="absolute bottom-[-80px] right-[-50px] h-[320px] w-[320px] rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="absolute left-[-50px] top-[40%] h-[260px] w-[260px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 shadow-xl shadow-violet-500/10">
              <svg
                className="h-6 w-6 text-violet-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                DontMissPassword
              </h1>

              <p className="mt-1 text-Lg text-white/50">
                Remember "Dont Miss Your Password!" 😉
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {!showForm && (
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-200 hover:bg-violet-500 active:scale-95"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Password
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.05] px-5 py-3 text-sm font-medium text-white/60 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.08] hover:text-white"
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        {/* STATS */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Total Saved",
              value: totalItems,
              sub: "credentials",
            },
            {
              label: "Current Page",
              value: currentPage,
              sub: `of ${totalPages}`,
            },
            {
              label: "Status",
              value: vaultItemsQuery.isFetching ? "Syncing" : "Protected",
              //green color if protected, yellow if syncing
              color: vaultItemsQuery.isFetching
                ? "text-yellow-300"
                : "text-green-300",
              sub: vaultItemsQuery.isFetching
                ? "fetching latest data"
                : "AES encrypted",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {stat.label}
              </p>

              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>

              <p className="mt-2 text-sm text-white/45">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* MAIN */}
        <div
          className={`grid gap-6 ${
            showForm ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1"
          }`}
        >
          {/* FORM */}
          {showForm && (
            <div className="xl:col-span-4">
              <div className="sticky top-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.05] backdrop-blur-2xl">
                <VaultItemForm
                  initialData={editingItem}
                  isSubmitting={
                    createMutation.isPending || updateMutation.isPending
                  }
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className={showForm ? "xl:col-span-8" : "col-span-full"}>
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl">
              {/* Top bar */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Credentials
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    Manage all your saved logins
                  </p>
                </div>

                {vaultItemsQuery.isFetching && (
                  <div className="flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
                    Syncing...
                  </div>
                )}
              </div>

              <VaultItemTable
                items={vaultItemsQuery.data?.items || []}
                isLoading={vaultItemsQuery.isLoading}
                error={vaultItemsQuery.error}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRevealPassword={handleRevealPassword}
                revealedPasswords={revealedPasswords}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-white/45">
                    Page {currentPage} of {totalPages}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/50 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ←
                    </button>

                    {Array.from(
                      {
                        length: Math.min(5, totalPages),
                      },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                          currentPage === page
                            ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                            : "border border-white/[0.08] bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] text-white/50 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {(createMutation.error ||
          updateMutation.error ||
          deleteMutation.error) && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/15 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-red-400" />

            <p className="text-sm font-medium text-red-100">Operation failed</p>
          </div>
        )}

        {(createMutation.isSuccess ||
          updateMutation.isSuccess ||
          deleteMutation.isSuccess) && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/15 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />

            <p className="text-sm font-medium text-emerald-100">
              Saved successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

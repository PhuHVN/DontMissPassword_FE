import { useState } from "react";
import type { ItemResponse } from "../../types/api";
import { apiClient } from "../../services/api";
import {
  formatDate,
  maskPassword,
  truncateText,
  copyToClipboard,
} from "../../utils/helpers";

interface VaultItemTableProps {
  items: ItemResponse[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (item: ItemResponse) => void;
  onDelete: (itemId: string) => void;
  onRevealPassword: (itemId: string) => void;
  revealedPasswords: Set<string>;
}

export function VaultItemTable({
  items,
  isLoading,
  error,
  onEdit,
  onDelete,
  onRevealPassword,
  revealedPasswords,
}: VaultItemTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [decryptedPasswords, setDecryptedPasswords] = useState<
    Record<string, string>
  >({});

  const [loadingDecrypt, setLoadingDecrypt] = useState<Set<string>>(new Set());

  const handleRevealPassword = async (itemId: string) => {
    onRevealPassword(itemId);

    if (!revealedPasswords.has(itemId) && !decryptedPasswords[itemId]) {
      setLoadingDecrypt((prev) => new Set(prev).add(itemId));

      try {
        const decrypted = await apiClient.getDecryptedPassword(itemId);

        setDecryptedPasswords((prev) => ({
          ...prev,
          [itemId]: decrypted,
        }));
      } catch (error) {
        console.error("Failed to decrypt password:", error);
      } finally {
        setLoadingDecrypt((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    }
  };

  if (error) {
    return (
      <div className="m-6 flex items-start gap-4 rounded-3xl border border-red-400/20 bg-red-500/10 p-6 backdrop-blur-xl">
        <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-red-500/15">
          <svg
            className="h-5 w-5 text-red-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>

        <div>
          <p className="mb-1 text-sm font-semibold text-red-200">
            Failed to load vault
          </p>

          <p className="text-xs text-red-200/70">{error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-3xl border border-white/[0.08] bg-white/[0.04]"
            style={{
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.12] bg-white/[0.05] backdrop-blur-xl">
          <svg
            className="h-9 w-9 text-white/25"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-white/80">
          No passwords saved yet
        </h3>

        <p className="max-w-[240px] text-sm leading-relaxed text-white/45">
          Add your first credential using the create button above
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      {items.map((item) => {
        const isRevealed = revealedPasswords.has(item.id);

        const isDecrypting = loadingDecrypt.has(item.id);

        const decryptedPassword = decryptedPasswords[item.id];

        const displayPassword = isRevealed
          ? isDecrypting
            ? "Decrypting..."
            : decryptedPassword || maskPassword(item.password)
          : maskPassword(item.password);

        const initials = item.title.charAt(0).toUpperCase();

        return (
          <div
            key={item.id}
            className="group rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-4 px-6 py-5">
              {/* Avatar */}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-sm font-bold text-violet-200 shadow-lg shadow-violet-500/10">
                {initials}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="truncate text-sm font-semibold tracking-wide text-white">
                    {truncateText(item.title, 28)}
                  </span>

                  <span className="text-[11px] text-white/35">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Username */}
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="max-w-[160px] truncate text-sm text-white/60">
                      {truncateText(item.username, 24)}
                    </span>

                    <button
                      onClick={async () => {
                        const copied = await copyToClipboard(item.username);

                        if (copied) {
                          setCopiedId(`user-${item.id}`);

                          setTimeout(() => setCopiedId(null), 2000);
                        }
                      }}
                      className="rounded-md p-1 text-white/30 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white/70 group-hover:opacity-100"
                      title="Copy username"
                    >
                      {copiedId === `user-${item.id}` ? (
                        <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <CopyIcon className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-white/15">•</span>

                  {/* Password */}
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm tracking-wider text-white/60">
                      {displayPassword}
                    </span>

                    <button
                      onClick={() => handleRevealPassword(item.id)}
                      disabled={isDecrypting}
                      className="rounded-md p-1 text-white/30 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white/70 disabled:opacity-20 group-hover:opacity-100"
                      title={isRevealed ? "Hide" : "Reveal"}
                    >
                      {isRevealed ? (
                        <EyeOffIcon className="h-3.5 w-3.5" />
                      ) : (
                        <EyeIcon className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={async () => {
                        const passwordToCopy =
                          decryptedPassword || item.password;

                        const copied = await copyToClipboard(passwordToCopy);

                        if (copied) {
                          setCopiedId(`pass-${item.id}`);

                          setTimeout(() => setCopiedId(null), 2000);
                        }
                      }}
                      className="rounded-md p-1 text-white/30 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white/70 group-hover:opacity-100"
                      title="Copy password"
                    >
                      {copiedId === `pass-${item.id}` ? (
                        <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <CopyIcon className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5 text-white/40 transition-all hover:border-white/[0.12] hover:bg-white/[0.08] hover:text-white/80"
                  title="Edit"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                    <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    if (
                      confirm("Delete this credential? This cannot be undone.")
                    ) {
                      onDelete(item.id);
                    }
                  }}
                  className="rounded-xl border border-red-400/10 bg-red-500/[0.04] p-2.5 text-white/40 transition-all hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-300"
                  title="Delete"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EyeIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2z" />
    </svg>
  );
}

function CopyIcon({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  );
}

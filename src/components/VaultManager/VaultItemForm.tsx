import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ItemRequest, ItemResponse } from "../../types/api";

const itemFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "At least 3 characters")
    .max(100, "At most 100 characters"),

  username: z
    .string()
    .min(1, "Username is required")
    .min(2, "At least 2 characters")
    .max(100, "At most 100 characters"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(255, "At most 255 characters"),
});

type ItemFormData = z.infer<typeof itemFormSchema>;

interface VaultItemFormProps {
  initialData?: ItemResponse;
  isSubmitting: boolean;
  onSubmit: (data: ItemRequest) => void;
  onCancel: () => void;
}

export function VaultItemForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}: VaultItemFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          username: initialData.username,
          password: initialData.password,
        }
      : undefined,
  });

  const onSubmitHandler = (data: ItemFormData) => {
    onSubmit(data as ItemRequest);

    if (!initialData) {
      reset();
    }
  };

  const fields = [
    {
      id: "title",
      label: "Title",
      placeholder: "e.g. GitHub, Gmail...",
      type: "text",
      hint: "A memorable name for this entry",
      error: errors.title,
      reg: register("title"),
    },
    {
      id: "username",
      label: "Username / Email",
      placeholder: "you@example.com",
      type: "text",
      hint: undefined,
      error: errors.username,
      reg: register("username"),
    },
    {
      id: "password",
      label: "Password",
      placeholder: "••••••••",
      type: showPassword ? "text" : "password",
      hint: "Encrypted end-to-end",
      error: errors.password,
      reg: register("password"),
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="h-full flex flex-col bg-[#15171c]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-400/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-violet-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {initialData ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              )}
            </svg>
          </div>

          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              {initialData ? "Edit credential" : "New credential"}
            </h2>

            <p className="text-xs text-white/50 mt-0.5">
              {initialData
                ? "Update your saved login"
                : "Store a login securely"}
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 px-8 py-7 space-y-6 overflow-y-auto">
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={field.id}
              className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2"
            >
              {field.label}
            </label>

            <div className="relative">
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                {...field.reg}
                className={`w-full px-4 py-3.5 rounded-2xl text-sm text-white placeholder-white/30 bg-white/[0.06] backdrop-blur-md border outline-none transition-all duration-200 focus:ring-4 ${
                  field.error
                    ? "border-red-400/40 focus:ring-red-500/10 focus:border-red-400/50"
                    : "border-white/[0.12] focus:ring-violet-500/10 focus:border-violet-400/40 hover:border-white/[0.18]"
                } ${field.id === "password" ? "pr-12" : ""}`}
              />

              {field.id === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white transition"
                >
                  {showPassword ? (
                    // Eye Off
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a17.3 17.3 0 013.119-4.568M6.228 6.228A9.956 9.956 0 0112 5c5 0 9 4 10 7a17.269 17.269 0 01-4.293 5.274M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                      />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {field.error ? (
              <p className="mt-2 text-xs text-red-300">{field.error.message}</p>
            ) : field.hint ? (
              <p className="mt-2 text-xs text-white/40">{field.hint}</p>
            ) : null}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-8 pb-8 pt-5 border-t border-white/[0.08] bg-white/[0.02] backdrop-blur-xl flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3.5 rounded-2xl bg-violet-500 hover:bg-violet-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
        >
          {isSubmitting ? (
            <>
              <Spinner />
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : initialData ? (
            "Update"
          ) : (
            "Save"
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] disabled:opacity-40 text-white/70 hover:text-white text-sm font-medium transition-all duration-200 active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  );
}

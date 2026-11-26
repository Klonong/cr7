"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminFeedback } from "@/interface/hooks";

interface AdminFeedbackBannerProps {
  feedback: AdminFeedback | null;
  onDismiss: () => void;
}

export function AdminFeedbackBanner({
  feedback,
  onDismiss,
}: AdminFeedbackBannerProps) {
  if (!feedback) return null;

  const isSuccess = feedback.type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium",
        isSuccess
          ? "border-status-success/30 bg-status-success/10 text-status-success"
          : "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      <span className="inline-flex items-center gap-2 min-w-0">
        {isSuccess ? (
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
        ) : (
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
        )}
        <span className="break-words">{feedback.message}</span>
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

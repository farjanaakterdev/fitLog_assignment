"use client";

import { useStore } from "@/lib/store";
import { CheckIcon, XIcon } from "./Icons";

export default function Toasts() {
  const { toasts } = useStore();

  return (
    <div
      className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,340px)] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-in pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-black/40 ${
            t.tone === "error"
              ? "border-red-500/40 bg-[#1d1215] text-red-200"
              : "border-[#2d3a12] bg-[#161c0c] text-accent"
          }`}
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-black">
            {t.tone === "error" ? (
              <XIcon className="h-3 w-3" />
            ) : (
              <CheckIcon className="h-3 w-3" />
            )}
          </span>
          <span className="font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { ChevronDownIcon } from "./Icons";

export type SortKey = "duration" | "calories" | "rating";

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: "duration", label: "Duration" },
  { value: "calories", label: "Calories" },
  { value: "rating", label: "Rating" },
];

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (key: SortKey) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort-by" className="text-xs text-dim-2">
        Sort By
      </label>
      <div className="relative">
        <select
          id="sort-by"
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="h-[34px] cursor-pointer appearance-none rounded-full border border-line-2 bg-surface-2 py-0 pl-4 pr-9 text-xs text-white outline-none transition-colors hover:border-accent/40 focus:border-accent/60"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#13161d]">
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}

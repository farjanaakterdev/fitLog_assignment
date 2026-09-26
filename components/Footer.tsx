import { DumbbellIcon } from "./Icons";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#1a1d24] bg-ink-2">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="text-accent">
            <DumbbellIcon className="h-6 w-6" />
          </span>
          <span className="font-display text-sm font-bold tracking-wide text-white">
            FITLOG
          </span>
        </div>
        <p className="text-center text-xs text-dim sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}

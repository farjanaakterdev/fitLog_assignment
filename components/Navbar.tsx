"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DumbbellIcon } from "./Icons";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/", label: "Workouts" },
  { href: "/my-plan", label: "My Plan" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = useStore();

  const links = (className: string) =>
    LINKS.map((link) => {
      const active =
        link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
      return (
        <Link
          key={link.href}
          href={link.href}
          className={`${className} ${
            active
              ? "bg-[#1a2312] font-semibold text-accent"
              : "font-medium text-muted hover:text-white"
          } rounded-full px-4 py-1.5 text-xs transition-colors`}
        >
          {link.label}
        </Link>
      );
    });

  return (
    <header className="sticky top-0 z-50 border-b border-[#1c1f26] bg-ink/95 backdrop-blur">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between gap-4 md:h-20">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-accent">
              <DumbbellIcon className="h-7 w-7" />
            </span>
            <span className="font-display text-lg font-bold tracking-wide text-white">
              FITLOG
            </span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
            {links("")}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/my-plan"
              className="flex items-center gap-2"
              aria-label={`${plan.length} workouts in today's plan`}
            >
              <span className="text-xs font-medium text-soft">Plan</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-bold leading-none text-black">
                {plan.length}
              </span>
            </Link>
            <Link
              href="/my-plan"
              className="flex items-center gap-2"
              aria-label={`${saved.length} saved workouts`}
            >
              <span className="text-xs font-medium text-muted">Saved</span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full border border-[#2d313b] px-1.5 text-[11px] font-medium leading-none text-soft">
                {saved.length}
              </span>
            </Link>
          </div>
        </div>

        <nav className="flex items-center justify-center gap-2 pb-3 md:hidden">
          {links("")}
        </nav>
      </div>
    </header>
  );
}

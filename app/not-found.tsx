import Link from "next/link";
import { ArrowRightIcon, DumbbellIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-accent">
        <DumbbellIcon className="h-10 w-10" />
      </span>
      <p className="mt-6 font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold uppercase text-white">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted">
        The page you are looking for does not exist or the workout ID is
        invalid. Get back under the bar.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-xs font-bold uppercase tracking-wide text-black transition-transform hover:-translate-y-0.5"
      >
        Back to workouts
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}

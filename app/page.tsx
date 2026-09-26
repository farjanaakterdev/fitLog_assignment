"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchWorkouts } from "@/lib/api";
import type { Workout } from "@/lib/types";
import WorkoutCard from "@/components/WorkoutCard";
import SortSelect, { type SortKey } from "@/components/SortSelect";
import { ArrowRightIcon, SpinnerIcon } from "@/components/Icons";

function Hero() {
  return (
    <section className="mx-auto mt-8 w-full max-w-[1280px] px-4 sm:px-6">
      <div className="grid items-center gap-10 rounded-2xl border border-line bg-surface px-6 py-12 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-16">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-accent">
            Workout Library
          </p>
          <h1 className="mt-4 max-w-[600px] font-display text-4xl font-bold uppercase leading-[1.05] text-white sm:text-5xl lg:text-[60px]">
            Train with intent. Log every set.
          </h1>
          <p className="mt-5 max-w-[500px] text-base leading-6 text-muted">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>
          <a
            href="#library"
            className="mt-8 inline-flex h-10 items-center gap-2 rounded-full bg-accent px-6 text-xs font-bold uppercase tracking-wide text-black transition-transform hover:-translate-y-0.5"
          >
            Browse Workouts
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
        <div className="justify-self-center lg:justify-self-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banner.png"
            alt="Athlete performing a preacher curl"
            className="h-[260px] w-[260px] rounded-2xl object-cover sm:h-[334px] sm:w-[334px]"
          />
        </div>
      </div>
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="h-48 w-full animate-pulse bg-[#1f232b]" />
      <div className="space-y-3 p-6">
        <div className="flex gap-2">
          <div className="h-5 w-14 animate-pulse rounded-full bg-accent/30" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-accent/30" />
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-[#20242e]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#20242e]" />
        <div className="mt-4 h-4 w-full animate-pulse rounded border-t border-[#20242e] bg-[#20242e]/40" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("duration");

  useEffect(() => {
    let cancelled = false;
    fetchWorkouts()
      .then((data) => {
        if (!cancelled) setWorkouts(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load workouts. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    const list = [...workouts];
    list.sort((a, b) => {
      if (sort === "calories") return a.caloriesBurned - b.caloriesBurned;
      if (sort === "rating") return b.rating - a.rating;
      return a.duration - b.duration;
    });
    return list;
  }, [workouts, sort]);

  return (
    <>
      <Hero />

      <section
        id="library"
        className="mx-auto mt-16 w-full max-w-[1280px] scroll-mt-24 px-4 pb-20 sm:px-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase text-white">
              The Library
            </h2>
            <p className="mt-2 text-sm text-muted">
              Twelve lifts covering every major muscle group.
            </p>
          </div>
          {!loading && !error && (
            <SortSelect value={sort} onChange={setSort} />
          )}
        </div>

        {loading && (
          <div className="mt-10">
            <div className="mb-6 flex items-center justify-center gap-3 text-sm text-muted">
              <span className="text-accent">
                <SpinnerIcon />
              </span>
              Loading workouts…
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-[#1a1114] p-8 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase text-black"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

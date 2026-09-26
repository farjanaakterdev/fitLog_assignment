"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchWorkouts } from "@/lib/api";
import type { Workout } from "@/lib/types";
import { useStore } from "@/lib/store";
import SortSelect, { type SortKey } from "@/components/SortSelect";
import {
  CheckIcon,
  ClockIcon,
  FlameIcon,
  SpinnerIcon,
  StarIcon,
  XIcon,
} from "@/components/Icons";

type Tab = "plan" | "saved";

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="px-6 py-5 sm:px-8">
      <p className="text-xs text-dim-2">{label}</p>
      <p
        className={`mt-1 font-display text-4xl font-bold ${
          accent ? "text-accent-2" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PlanItem({
  workout,
  tab,
  done,
  onOpen,
}: {
  workout: Workout;
  tab: Tab;
  done: boolean;
  onOpen: (id: number) => void;
}) {
  const { removeFromPlan, removeFromSaved, markDone, toast } = useStore();

  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-line-2 bg-card p-4 sm:flex-row sm:items-center">
      <div className="h-20 w-full shrink-0 overflow-hidden rounded-lg bg-[#1f2937] sm:w-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={workout.image}
          alt={workout.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`font-display text-base font-bold uppercase text-white ${
              done ? "line-through opacity-60" : ""
            }`}
          >
            {workout.name}
          </h3>
          {done && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-black">
              <CheckIcon className="h-2.5 w-2.5" /> Done
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-semibold text-dim-2">
          {workout.equipment}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-soft">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5 text-accent" />
            {workout.duration} min
          </span>
          <span className="flex items-center gap-1.5">
            <FlameIcon className="h-3.5 w-3.5 text-accent" />
            {workout.caloriesBurned} kcal
          </span>
          <span className="flex items-center gap-1.5">
            <StarIcon className="h-3.5 w-3.5 text-accent" />
            {workout.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => onOpen(workout.id)}
          className="h-[34px] rounded-full border border-[#374151] px-4 text-xs text-white transition-colors hover:border-accent/60"
        >
          View Details
        </button>
        {tab === "plan" && (
          <button
            type="button"
            onClick={() => {
              if (done) {
                toast("Already marked as done", "info");
                return;
              }
              markDone(workout.id);
              toast("Marked as done");
            }}
            className="h-8 rounded-full bg-accent-2 px-4 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Mark as Done
          </button>
        )}
        <button
          type="button"
          aria-label={`Remove ${workout.name}`}
          onClick={() => {
            if (tab === "plan") {
              removeFromPlan(workout.id);
              toast("Removed from today's plan", "info");
            } else {
              removeFromSaved(workout.id);
              toast("Removed from saved", "info");
            }
          }}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#374151] text-soft transition-colors hover:border-red-400/60 hover:text-red-300"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

export default function MyPlanPage() {
  const router = useRouter();
  const { plan, saved, doneIds } = useStore();
  const [tab, setTab] = useState<Tab>("plan");
  const [sort, setSort] = useState<SortKey>("duration");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchWorkouts()
      .catch(() => {
        /* list still renders from locally stored plan/saved items */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeList = tab === "plan" ? plan : saved;

  const metrics = useMemo(() => {
    return plan.reduce(
      (acc, w) => ({
        exercises: acc.exercises + 1,
        minutes: acc.minutes + w.duration,
        calories: acc.calories + w.caloriesBurned,
      }),
      { exercises: 0, minutes: 0, calories: 0 }
    );
  }, [plan]);

  const sorted = useMemo(() => {
    const list = [...activeList];
    list.sort((a, b) => {
      if (sort === "calories") return a.caloriesBurned - b.caloriesBurned;
      if (sort === "rating") return b.rating - a.rating;
      return a.duration - b.duration;
    });
    return list;
  }, [activeList, sort]);

  const tabButton = (key: Tab, label: string) => {
    const active = tab === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setTab(key)}
        className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
          active
            ? "border border-[#2b303d] bg-[#1f242d] font-bold text-white"
            : "font-normal text-dim-2 hover:text-white"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:py-12">
      <h1 className="font-display text-3xl font-bold uppercase text-white">
        My Plan
      </h1>
      <p className="mt-3 text-sm text-dim-2">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      <section className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line-2 bg-line-2 sm:grid-cols-3">
        <div className="bg-surface-2">
          <Metric label="Exercises" value={metrics.exercises} accent />
        </div>
        <div className="bg-surface-2">
          <Metric label="Minutes" value={metrics.minutes} />
        </div>
        <div className="bg-surface-2">
          <Metric label="Calories" value={metrics.calories} />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-line-2 bg-surface-3 p-1">
          {tabButton("plan", "Today's Plan")}
          {tabButton("saved", "Saved")}
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-muted">
          <span className="text-accent">
            <SpinnerIcon />
          </span>
          Loading workoutsâ€¦
        </div>
      ) : sorted.length === 0 ? (
        <section className="mt-8 rounded-xl border border-dashed border-white/10 bg-[#111317]/50 px-6 py-16 text-center">
          <h2 className="font-display text-xl font-bold uppercase text-white">
            Nothing here yet
          </h2>
          <p className="mt-3 text-xs text-[#a1a1aa]">
            Browse the library and add a lift to get today moving.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-9 items-center rounded-full bg-[#c2f10d] px-6 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            Go to workouts
          </Link>
        </section>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {sorted.map((workout) => (
            <PlanItem
              key={workout.id}
              workout={workout}
              tab={tab}
              done={doneIds.includes(workout.id)}
              onOpen={(id) => router.push(`/workout/${id}`)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

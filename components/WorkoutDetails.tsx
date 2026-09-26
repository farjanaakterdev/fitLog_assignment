"use client";

import Link from "next/link";
import type { Workout } from "@/lib/types";
import { PLAN_CAP, useStore } from "@/lib/store";
import { ArrowRightIcon, BookmarkIcon, PlusIcon } from "@/components/Icons";

export default function WorkoutDetails({ workout: w }: { workout: Workout }) {
  const { plan, saved, planFull, addToPlan, addToSaved, toast } = useStore();

  const inPlan = plan.some((item) => item.id === w.id);
  const inSaved = saved.some((item) => item.id === w.id);
  const planIsFull = planFull && !inPlan;

  const handleAdd = () => {
    if (inPlan) {
      toast("Already in today's plan", "info");
      return;
    }
    if (planIsFull) {
      toast(`Plan is full — cap is ${PLAN_CAP} lifts`, "error");
      return;
    }
    if (addToPlan(w)) toast("Added to today's plan");
    else toast(`Plan is full — cap is ${PLAN_CAP} lifts`, "error");
  };

  const handleSave = () => {
    if (inSaved) {
      toast("Already saved for later", "info");
      return;
    }
    if (addToSaved(w)) toast("Saved for later");
  };

  const specs: [string, string][] = [
    ["Equipment", w.equipment],
    ["Difficulty", w.difficulty],
    ["Sets", String(w.sets)],
    ["Reps", String(w.reps)],
    ["Duration", `${w.duration} min`],
    ["Calories", `${w.caloriesBurned} kcal`],
    ["Rating", String(w.rating)],
  ];

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-[#232834] bg-[#171a21] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
          <div className="h-[320px] w-full bg-[#1f232b] sm:h-[480px] lg:h-[735px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={w.image}
              alt={w.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
            {w.name}
          </h1>
          <p className="mt-4 max-w-[576px] text-base leading-6 text-muted">
            {w.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {w.muscleGroups.map((group) => (
              <span
                key={group}
                className="rounded-full bg-accent-2 px-4 py-1.5 text-xs font-semibold text-[#0f1115]"
              >
                {group}
              </span>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[#232834] bg-[#151922]">
            {specs.map(([label, value], index) => (
              <div
                key={label}
                className={`flex h-[49px] items-center justify-between px-6 ${
                  index < specs.length - 1 ? "border-b border-line-3" : ""
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wide text-muted">
                  {label}
                </span>
                <span className="text-sm font-medium text-soft-2">{value}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-base font-extrabold uppercase tracking-wide text-white">
            Instructions
          </h2>
          <ol className="mt-4 space-y-4">
            {w.instructions.map((step, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="text-muted">{index + 1}.</span>
                <span className="text-soft">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAdd}
              disabled={planIsFull}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent-2 px-6 text-sm font-semibold text-[#0f1115] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              <PlusIcon className="h-4 w-4" />
              {inPlan
                ? "In today's plan"
                : planIsFull
                  ? `Plan full (${PLAN_CAP})`
                  : "Add to today's plan"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#374151] px-6 text-sm font-medium text-soft-2 transition-colors hover:border-accent/50 hover:text-white"
            >
              <BookmarkIcon className="h-4 w-4" />
              {inSaved ? "Saved" : "Save for later"}
            </button>
          </div>

          <Link
            href="/#library"
            className="mt-6 inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-accent"
          >
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
            Back to the library
          </Link>
        </div>
      </div>
    </div>
  );
}

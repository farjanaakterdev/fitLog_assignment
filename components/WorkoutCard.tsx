import type { Workout } from "@/lib/types";
import Link from "next/link";
import { ClockIcon, FlameIcon, StarIcon } from "./Icons";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-1 hover:border-accent/40"
    >
      <div className="h-48 w-full overflow-hidden bg-[#1f232b]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={workout.image}
          alt={workout.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {workout.muscleGroups.map((group) => (
            <span
              key={group}
              className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase leading-none tracking-wide text-black"
            >
              {group}
            </span>
          ))}
        </div>
        <h3 className="mt-3 font-display text-lg font-bold uppercase leading-tight text-white">
          {workout.name}
        </h3>
        <p className="mt-1 text-xs text-muted">{workout.equipment}</p>
        <div className="mt-4 flex items-center gap-4 border-t border-[#20242e] pt-3 text-xs text-muted">
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
    </Link>
  );
}

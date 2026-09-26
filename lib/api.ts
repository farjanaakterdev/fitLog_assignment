import type { Workout } from "./types";

const BASE = "https://api.abcz.workers.dev/api/fitlog";

export async function fetchWorkouts(): Promise<Workout[]> {
  const res = await fetch(BASE, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load workouts");
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Unexpected API payload");
  return data;
}

export async function fetchWorkout(id: string): Promise<Workout> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) throw new NotFoundError("Workout not found");
  if (!res.ok) throw new Error("Failed to load workout");
  const data = await res.json();
  if (!data || typeof data !== "object" || !data.id) {
    throw new NotFoundError("Workout not found");
  }
  return data as Workout;
}

export class NotFoundError extends Error {}

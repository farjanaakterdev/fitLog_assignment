import { notFound } from "next/navigation";
import { fetchWorkout, NotFoundError } from "@/lib/api";
import WorkoutDetails from "@/components/WorkoutDetails";

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let workout;
  try {
    workout = await fetchWorkout(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return <WorkoutDetails workout={workout} />;
}

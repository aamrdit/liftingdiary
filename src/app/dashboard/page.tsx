import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { getWorkoutsForUserByDate } from "@/src/data/workouts";
import { DatePicker } from "./_components/date-picker";
import { WorkoutList } from "./_components/workout-list";
import { Button } from "@/components/ui/button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date } = await searchParams;
  const selectedDate = date ?? "2026-04-26";

  const workouts = await getWorkoutsForUserByDate(userId, selectedDate);
  const formattedDate = format(new Date(`${selectedDate}T00:00:00`), "do MMM yyyy");

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-center mb-8">Workout Dashboard</h1>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Select Date</span>
            <DatePicker date={selectedDate} />
          </div>
          <Button asChild>
            <Link href="/dashboard/workout/new">Log New Workout</Link>
          </Button>
        </div>
        <WorkoutList workouts={workouts} formattedDate={formattedDate} />
      </div>
    </main>
  );
}

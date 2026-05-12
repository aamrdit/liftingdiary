import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getWorkoutsForUserByDate } from "@/src/data/workouts";
import { DatePicker } from "./_components/date-picker";
import { WorkoutList } from "./_components/workout-list";

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
      <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Select Date</p>
          <DatePicker date={selectedDate} />
        </div>
        <WorkoutList workouts={workouts} formattedDate={formattedDate} />
      </div>
    </main>
  );
}

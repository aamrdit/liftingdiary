import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DatePicker } from "./_components/date-picker";
import { WorkoutList } from "./_components/workout-list";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date } = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = date ?? today;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">My Workouts</h1>
        <DatePicker date={selectedDate} />
      </div>
      <Suspense
        key={selectedDate}
        fallback={
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-40 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <WorkoutList userId={userId} date={selectedDate} />
      </Suspense>
    </main>
  );
}

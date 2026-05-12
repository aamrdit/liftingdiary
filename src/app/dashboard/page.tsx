import { DatePicker } from "./_components/date-picker";
import { WorkoutList } from "./_components/workout-list";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = date ?? today;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold tracking-tight">My Workouts</h1>
        <DatePicker date={selectedDate} />
      </div>
      <WorkoutList date={selectedDate} />
    </main>
  );
}

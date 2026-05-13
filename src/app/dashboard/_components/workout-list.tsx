import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { WorkoutsForDay } from "@/src/data/workouts";

type Props = {
  workouts: WorkoutsForDay;
  formattedDate: string;
};

export function WorkoutList({ workouts, formattedDate }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight mb-4">Workouts for {formattedDate}</h2>
      {workouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-muted-foreground">No workouts logged for this date.</p>
            <Button>Log New Workout</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Link key={workout.id} href={`/dashboard/workout/${workout.id}`} className="block">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-baseline justify-between">
                  <CardTitle className="text-base">{workout.name ?? "Workout"}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {format(workout.startedAt, "h:mm a")}
                    {workout.completedAt &&
                      ` – ${format(workout.completedAt, "h:mm a")}`}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workout.workoutExercises.map((we) => (
                  <div key={we.id}>
                    <p className="text-sm font-medium mb-2">{we.exercise.name}</p>
                    {we.sets.length > 0 && (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-muted-foreground">
                            <th className="pr-6 pb-1 font-normal">Set</th>
                            <th className="pr-6 pb-1 font-normal">Reps</th>
                            <th className="pr-6 pb-1 font-normal">Weight (kg)</th>
                            <th className="pb-1 font-normal">Done</th>
                          </tr>
                        </thead>
                        <tbody>
                          {we.sets.map((set) => (
                            <tr key={set.id} className="text-muted-foreground">
                              <td className="pr-6 py-0.5">{set.setNumber}</td>
                              <td className="pr-6 py-0.5">{set.reps ?? "–"}</td>
                              <td className="pr-6 py-0.5">{set.weightKg ?? "–"}</td>
                              <td className="py-0.5">
                                {set.completed ? (
                                  <span className="text-green-600 dark:text-green-400">✓</span>
                                ) : (
                                  "–"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

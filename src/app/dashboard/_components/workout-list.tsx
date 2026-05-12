import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const MOCK_WORKOUTS = [
  {
    id: "1",
    name: "Push Day",
    startedAt: new Date("2026-05-11T09:00:00"),
    completedAt: new Date("2026-05-11T10:15:00"),
    workoutExercises: [
      {
        id: "we1",
        exercise: { name: "Bench Press" },
        sets: [
          { id: "s1", setNumber: 1, reps: 8, weightKg: 80, completed: true },
          { id: "s2", setNumber: 2, reps: 8, weightKg: 80, completed: true },
          { id: "s3", setNumber: 3, reps: 6, weightKg: 82.5, completed: true },
        ],
      },
      {
        id: "we2",
        exercise: { name: "Overhead Press" },
        sets: [
          { id: "s4", setNumber: 1, reps: 10, weightKg: 50, completed: true },
          { id: "s5", setNumber: 2, reps: 10, weightKg: 50, completed: true },
          { id: "s6", setNumber: 3, reps: 8, weightKg: 52.5, completed: false },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Core Finisher",
    startedAt: new Date("2026-05-11T10:30:00"),
    completedAt: new Date("2026-05-11T10:50:00"),
    workoutExercises: [
      {
        id: "we3",
        exercise: { name: "Plank" },
        sets: [
          { id: "s7", setNumber: 1, reps: null, weightKg: null, completed: true },
          { id: "s8", setNumber: 2, reps: null, weightKg: null, completed: true },
        ],
      },
    ],
  },
];

type Props = {
  date: string;
};

export function WorkoutList({ date }: Props) {
  const workouts = MOCK_WORKOUTS;

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-base">No workouts logged for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id}>
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
      ))}
    </div>
  );
}

import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

type Props = {
  userId: string;
  date: string;
};

export async function WorkoutList({ userId, date }: Props) {
  const start = new Date(date);
  const end = new Date(date);
  end.setUTCDate(end.getUTCDate() + 1);

  const results = await db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, start),
      lt(workouts.startedAt, end)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => asc(we.order),
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => asc(s.setNumber),
          },
        },
      },
    },
  });

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-base">No workouts logged for this date.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((workout) => (
        <div
          key={workout.id}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-base font-semibold">
              {workout.name ?? "Workout"}
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {workout.startedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {workout.completedAt &&
                ` – ${workout.completedAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
            </span>
          </div>

          <div className="space-y-4">
            {workout.workoutExercises.map((we) => (
              <div key={we.id}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {we.exercise.name}
                </p>
                {we.sets.length > 0 && (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 dark:text-gray-500">
                        <th className="pr-6 pb-1 font-normal">Set</th>
                        <th className="pr-6 pb-1 font-normal">Reps</th>
                        <th className="pr-6 pb-1 font-normal">Weight (kg)</th>
                        <th className="pb-1 font-normal">Done</th>
                      </tr>
                    </thead>
                    <tbody>
                      {we.sets.map((set) => (
                        <tr
                          key={set.id}
                          className="text-gray-600 dark:text-gray-400"
                        >
                          <td className="pr-6 py-0.5">{set.setNumber}</td>
                          <td className="pr-6 py-0.5">{set.reps ?? "–"}</td>
                          <td className="pr-6 py-0.5">{set.weightKg ?? "–"}</td>
                          <td className="py-0.5">
                            {set.completed ? (
                              <span className="text-green-600 dark:text-green-400">
                                ✓
                              </span>
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
          </div>
        </div>
      ))}
    </div>
  );
}

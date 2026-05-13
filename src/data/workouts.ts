import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function createWorkout(
  userId: string,
  data: { name?: string; startedAt: Date }
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name: data.name, startedAt: data.startedAt })
    .returning();
  return workout;
}

export async function getWorkoutsForUserByDate(userId: string, date: string) {
  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      eq(sql`DATE(${workouts.startedAt})`, date)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  });
}

export type WorkoutsForDay = Awaited<ReturnType<typeof getWorkoutsForUserByDate>>;

export async function getWorkoutById(userId: string, workoutId: string) {
  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
  return workout ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  data: { name?: string | null; startedAt?: Date }
) {
  const [updated] = await db
    .update(workouts)
    .set(data)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return updated ?? null;
}

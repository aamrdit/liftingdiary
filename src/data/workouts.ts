import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import { and, eq, sql } from "drizzle-orm";

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

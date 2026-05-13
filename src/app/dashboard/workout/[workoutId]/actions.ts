"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { updateWorkout } from "@/src/data/workouts"

const UpdateWorkoutSchema = z.object({
  workoutId: z.string(),
  name: z.string().max(100).optional(),
  startedAt: z.coerce.date(),
})

type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>

export async function updateWorkoutAction(input: UpdateWorkoutInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = UpdateWorkoutSchema.safeParse(input)
  if (!parsed.success) throw new Error("Invalid input")

  const { workoutId, name, startedAt } = parsed.data
  const workout = await updateWorkout(userId, workoutId, {
    name: name || null,
    startedAt,
  })

  if (!workout) throw new Error("Workout not found")

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/workout/${workoutId}`)
  return workout
}

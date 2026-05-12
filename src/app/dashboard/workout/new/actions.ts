"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createWorkout } from "@/src/data/workouts"

const CreateWorkoutSchema = z.object({
  name: z.string().max(100).optional(),
  startedAt: z.coerce.date(),
})

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = CreateWorkoutSchema.safeParse(input)
  if (!parsed.success) throw new Error("Invalid input")

  const { name, startedAt } = parsed.data
  const workout = await createWorkout(userId, { name: name || undefined, startedAt })

  revalidatePath("/dashboard")
  return workout
}

import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkoutById } from "@/src/data/workouts"
import { EditWorkoutForm } from "./_components/edit-workout-form"

interface Props {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: Props) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const { workoutId } = await params
  const workout = await getWorkoutById(userId, workoutId)
  if (!workout) notFound()

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit workout</CardTitle>
        </CardHeader>
        <CardContent>
          <EditWorkoutForm
            workoutId={workout.id}
            defaultValues={{
              name: workout.name,
              startedAt: workout.startedAt,
            }}
          />
        </CardContent>
      </Card>
    </main>
  )
}

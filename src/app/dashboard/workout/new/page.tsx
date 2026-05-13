import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewWorkoutForm } from "./_components/new-workout-form"

export default async function NewWorkoutPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>New workout</CardTitle>
        </CardHeader>
        <CardContent>
          <NewWorkoutForm />
        </CardContent>
      </Card>
    </main>
  )
}

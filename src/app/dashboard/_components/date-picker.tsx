"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

export function DatePicker({ date }: { date: string }) {
  const router = useRouter();

  const selected = new Date(`${date}T00:00:00`);

  function handleSelect(day: Date | undefined) {
    if (!day) return;
    router.push(`/dashboard?date=${format(day, "yyyy-MM-dd")}`);
    router.refresh();
  }

  return (
    <Card className="p-0 overflow-hidden">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelect}
      />
    </Card>
  );
}

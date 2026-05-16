"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker({ date }: { date: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selected = new Date(`${date}T00:00:00`);

  function handleSelect(day: Date | undefined) {
    if (!day) return;
    router.push(`/dashboard?date=${format(day, "yyyy-MM-dd")}`);
    router.refresh();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start gap-2">
          <CalendarIcon className="size-4" />
          {format(selected, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selected} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}

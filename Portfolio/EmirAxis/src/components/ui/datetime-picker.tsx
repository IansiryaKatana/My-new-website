"use client";

import { useEffect, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { CalendarClock, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type DateTimePickerProps = {
  value?: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  clearable?: boolean;
};

function parseDateTime(value: string | null | undefined) {
  if (!value) return { date: undefined as Date | undefined, time: "09:00" };
  let d = parseISO(value);
  if (!isValid(d)) d = new Date(value);
  if (!isValid(d)) return { date: undefined, time: "09:00" };
  return { date: d, time: format(d, "HH:mm") };
}

function combineToIso(date: Date, time: string) {
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  const combined = new Date(date);
  combined.setHours(Number.isFinite(h) ? h : 0, Number.isFinite(m) ? m : 0, 0, 0);
  return combined.toISOString();
}

const timeInputClass =
  "pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0";

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date and time",
  disabled,
  className,
  id,
  clearable = true,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseDateTime(value);
  const [date, setDate] = useState<Date | undefined>(parsed.date);
  const [time, setTime] = useState(parsed.time);

  useEffect(() => {
    const next = parseDateTime(value);
    setDate(next.date);
    setTime(next.time);
  }, [value]);

  const display =
    date && isValid(date) ? `${format(date, "dd MMM yyyy")} · ${time}` : null;

  const apply = () => {
    if (!date) return;
    onChange(combineToIso(date, time));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 w-full justify-between gap-2 px-3 font-normal shadow-sm",
            !display && "text-muted-foreground",
            className,
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">{display ?? placeholder}</span>
          <CalendarClock className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => setDate(day)}
          defaultMonth={date}
          initialFocus
        />
        <div className="space-y-2 border-t p-3">
          <Label className="text-xs text-muted-foreground">Time</Label>
          <div className="relative">
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={timeInputClass}
            />
            <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" aria-hidden />
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t p-2">
          <Button type="button" size="sm" className="w-full bg-primary hover:bg-primary/90" onClick={apply} disabled={!date}>
            Apply
          </Button>
          {clearable && display ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={() => {
                onChange(null);
                setDate(undefined);
                setTime("09:00");
                setOpen(false);
              }}
            >
              <X className="mr-1.5 h-3.5 w-3.5" />
              Clear
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

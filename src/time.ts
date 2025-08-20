import type { Schedule } from "./types";

export function getCurrentTime(): Date {
  return new Date();
}

export function getWeekdayName(date: Date): keyof Schedule {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  return days[date.getDay()];
}

export function getHoursIntoDay(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}

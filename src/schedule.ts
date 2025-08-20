import { Schedule, ScheduleEntry } from './types';
import { getWeekdayName } from './time';

export function getScheduleForDay(schedule: Schedule, date: Date): ScheduleEntry {
  const dayName = getWeekdayName(date);
  return schedule[dayName][0]; // Taking first entry for simplicity
}

export function isAtWork(clockin: number, clockout: number, currentHours: number): boolean {
  if (clockin === clockout) return false; // No work day
  return currentHours >= clockin && currentHours <= clockout;
}

export function hourToIndex(
  hoursIn: number, 
  clockin: number, 
  clockout: number, 
  ledCount: number, 
  flip: boolean
): number {
  const index = Math.floor(ledCount * (hoursIn - clockin) / (clockout - clockin));
  
  if (flip) {
    return ledCount - 1 - index;
  }
  
  if (index <= 1 || index >= ledCount) {
    return -1;
  }
  
  return index;
}

export function isValidIndex(index: number, ledCount: number): boolean {
  return index >= 0 && index < ledCount;
}
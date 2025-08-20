export interface ScheduleEntry {
  clockin: string;
  clockout: string;
}

export interface Schedule {
  monday: ScheduleEntry[];
  tuesday: ScheduleEntry[];
  wednesday: ScheduleEntry[];
  thursday: ScheduleEntry[];
  friday: ScheduleEntry[];
  saturday: ScheduleEntry[];
  sunday: ScheduleEntry[];
}

export interface CalendarEvent {
  startTime: number;
  endTime: number;
  title?: string;
}

export interface Config {
  ledCount: number;
  barColor: [number, number, number];
  eventColor: [number, number, number];
  currentTimeColor: [number, number, number];
  flip: boolean;
  googleCalEnabled: boolean;
  wledUrl: string;
  schedule: Schedule;
}

export interface WLEDState {
  on: boolean;
  bri: number;
  seg: Array<{
    id: number;
    start: number;
    stop: number;
    col: Array<[number, number, number]>;
  }>;
}

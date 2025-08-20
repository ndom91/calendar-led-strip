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
  wledUrl: string;
  schedule: Schedule;
  debug: boolean;
  barBrightness: number;
}

interface WLEDSegment {
  id: number;
  start: number;
  stop: number;
  bri?: number;
  col: Array<[number, number, number]>;
}

export interface WLEDState {
  on: boolean;
  bri: number;
  transition?: number;
  v?: boolean; //verbose
  seg: WLEDSegment[];
}

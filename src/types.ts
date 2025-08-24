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

export type WLEDColor =
  | [number, number, number] // RGB
  | [number, number, number, number] // RGBW
  | string; // hex string e.g. "FFAA00"

export interface WLEDSegment {
  id?: number; // 0–info.maxseg-1
  start?: number; // 0–info.leds.count-1
  stop?: number; // 0–info.leds.count (exclusive)
  startY?: number; // 0–matrix width (2D)
  stopY?: number; // 1–matrix height (2D)
  len?: number; // stop - start
  grp?: number; // 0–255 (grouping)
  spc?: number; // 0–255 (spacing)
  of?: number; // -len+1 to len (offset)

  col?: WLEDColor[]; // Up to 3 colors: primary, secondary, tertiary

  fx?: number | "~" | "~- " | "r"; // Effect ID or increment/decrement/random
  sx?: number | string; // 0–255 or "~"/"~-"/"~10" etc
  ix?: number | string; // 0–255 or "~"/"~-"/"~10" etc
  c1?: number; // 0–255 custom slider
  c2?: number; // 0–255 custom slider
  c3?: number; // 0–31 custom slider
  o1?: boolean;
  o2?: boolean;
  o3?: boolean;

  pal?: number | "~" | "~- " | "r"; // Palette ID or increment/decrement/random

  sel?: boolean; // whether this segment is selected
  rev?: boolean; // horizontal flip
  rY?: boolean; // vertical flip (2D)
  on?: boolean; // segment power
  bri?: number; // 0–255
  mi?: boolean; // horizontal mirror
  mY?: boolean; // vertical mirror (2D)
  tp?: boolean; // transpose X/Y (2D)
  cct?: number; // 0–255 or 1900–10091 (white color temperature)

  // Loxone extensions (if compiled in)
  lx?: string | number;
  ly?: string | number;

  i?: WLEDColor[]; // Individual LED control (not included in state response)

  frz?: boolean; // freeze effect
  m12?: 0 | 1 | 2 | 3 | 4; // Expand 1D FX mode
  si?: 0 | 1 | 2 | 3; // Sound simulation type
  fxdef?: boolean; // force load effect defaults
  set?: 0 | 1 | 2 | 3; // group/set ID
  rpt?: boolean; // auto-repeat segment definition
}

export interface WLEDState {
  on?: boolean | "t";
  bri?: number; // 1–255 recommended (0 allowed, but not in state response)
  transition?: number; // 0–65535 (100ms per unit)
  tt?: number; // 0–65535 (applies only to current API call)
  ps?: number; // -1–250
  pss?: number; // 0–65535 (removed in v0.11.1)
  psave?: number; // 1–250
  pl?: number; // -1–250 (read-only)
  pdel?: number; // 1–250

  nl?: {
    on?: boolean;
    dur?: number; // 1–255 minutes
    fade?: boolean; // removed in 0.13.0
    mode?: 0 | 1 | 2 | 3; // (0: instant, 1: fade, 2: color fade, 3: sunrise)
    tbri?: number; // 0–255
    rem?: number; // -1–15300 seconds (read-only)
  };

  udpn?: {
    send?: boolean;
    recv?: boolean;
    sgrp?: number; // 0–255
    rgrp?: number; // 0–255
    nn?: boolean; // only for current API call
  };

  v?: boolean; // request full JSON response
  rb?: boolean; // reboot immediately
  live?: boolean; // realtime mode
  lor?: 0 | 1 | 2; // live data override
  time?: number; // uint32 UNIX timestamp
  mainseg?: number; // 0–info.leds.maxseg-1
  seg?: WLEDSegment[]; // segments definition
  playlist?: object; // custom preset playlists
  tb?: number; // uint32, timebase for effects
  ledmap?: number; // 0–9
  rmcpal?: boolean; // remove last custom palette
  np?: boolean; // advance to next preset in playlist
}

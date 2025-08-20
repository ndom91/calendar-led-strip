import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { CalendarEvent } from "./types";

const execAsync = promisify(exec);

export async function getTodayEvents(): Promise<CalendarEvent[]> {
  try {
    const today = new Date();
    const tmr = new Date();
    tmr.setDate(today.getDate() + 1);
    const todayString = today.toISOString().split("T")[0];
    const tmrString = tmr.toISOString().split("T")[0];
    const command = `GCALCLI_CONFIG=/opt/ndomino/hometime/config.toml gcalcli agenda --tsv --military ${todayString} ${tmrString}`;

    const { stdout } = await execAsync(command);
    const events: CalendarEvent[] = [];

    const lines = stdout.trim().split("\n");
    for (const line of lines) {
      if (line.trim() === "") continue;

      const columns = line.split("\t");
      if (columns.length > 4) {
        // Only process lines with both start_time and end_time
        if (columns[0] !== "start_date" && columns[1] !== "" && columns[3] !== "") {
          const startTimeStr = columns[1]; // Start time column
          const endTimeStr = columns[3]; // End time column

          const startMatch = startTimeStr.match(/(\d{1,2}):(\d{2})/);
          const endMatch = endTimeStr.match(/(\d{1,2}):(\d{2})/);

          if (startMatch && endMatch) {
            const startHours = parseInt(startMatch[1], 10);
            const startMinutes = parseInt(startMatch[2], 10);
            const startTime = startHours + startMinutes / 60;

            const endHours = parseInt(endMatch[1], 10);
            const endMinutes = parseInt(endMatch[2], 10);
            const endTime = endHours + endMinutes / 60;

            console.log("EVENT_PARSED", {
              startTime,
              endTime,
              title: columns[4] || "Unknown Event",
            });

            events.push({
              startTime,
              endTime,
              title: columns[4] || "Unknown Event",
            });
          }
        }
      }
    }

    console.log("events", events);
    return events;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }
}

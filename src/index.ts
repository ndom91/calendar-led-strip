import * as cron from "node-cron";
import { config } from "./config";
import { getCurrentTime, getHoursIntoDay } from "./time";
import { getTodayEvents } from "./calendar";
import { WLEDClient } from "./wled";
import { LEDVisualizer } from "./visualization";
import { getScheduleForDay, isAtWork } from "./schedule";
import type { CalendarEvent } from "./types";

class HometimeServer {
  private wled: WLEDClient;
  private visualizer: LEDVisualizer;
  private flashToggle: boolean = false;
  private hasShownRainbowToday: boolean = false;

  constructor() {
    this.wled = new WLEDClient(config.wledUrl);
    this.visualizer = new LEDVisualizer(this.wled, config);
  }

  private async updateDisplay(): Promise<void> {
    try {
      const now = getCurrentTime();
      const currentHours = getHoursIntoDay(now);
      const scheduleEntry = getScheduleForDay(config.schedule, now);
      const clockin = parseFloat(scheduleEntry.clockin);
      const clockout = parseFloat(scheduleEntry.clockout);

      const working = isAtWork(clockin, clockout, currentHours);
      console.log(`Current time: ${currentHours.toFixed(2)}, Working: ${working}`);

      if (working) {
        this.hasShownRainbowToday = false;

        const events = await getTodayEvents();

        // Update display with current progress and events
        await this.visualizer.displayWorkDay(currentHours, clockin, clockout, events);

        // Flash the current time indicator every second
        this.flashToggle = !this.flashToggle;
        const intensity = this.flashToggle ? 1 : 0.3;

        await this.visualizer.flashCurrentTimeIndicator(
          currentHours,
          clockin,
          clockout,
          events,
          intensity,
        );
      } else {
        // Not working - show rainbow once then turn off
        if (!this.hasShownRainbowToday) {
          console.log("Work day ended, showing rainbow celebration");
          await this.visualizer.rainbowCycle(5000);
          this.hasShownRainbowToday = true;
          await this.visualizer.turnOff();

          // Sleep for 10 minutes to avoid excessive API calls
          setTimeout(() => {}, 600000);
        }
      }
    } catch (error) {
      console.error("Error updating display:", error);
      // On error, turn off LEDs for safety
      try {
        await this.visualizer.turnOff();
      } catch (offError) {
        console.error("Error turning off LEDs:", offError);
      }
    }
  }

  private checkForSpecialReset(): void {
    const now = getCurrentTime();
    // Reset at 4:44 AM like the original (tribute to Jay-Z)
    if (now.getHours() === 4 && now.getMinutes() === 44 && now.getSeconds() === 0) {
      console.log("Daily reset at 4:44 AM");
      this.hasShownRainbowToday = false;
      // Could restart the process here if needed
      process.exit(0);
    }
  }

  public async start(): Promise<void> {
    console.log("Hometime Server starting...");

    try {
      // await this.visualizer.turnOff();
      await this.updateDisplay();

      // Run every 5 min
      cron.schedule("*/5 * * * *", async () => {
        await this.updateDisplay();
        this.checkForSpecialReset();
      });

      console.log("Hometime Server running. Press Ctrl+C to stop.");
    } catch (error) {
      console.error("Failed to start Hometime Server:", error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    console.log("Hometime Server stopping...");
    try {
      // await this.visualizer.turnOff();
    } catch (error) {
      console.error("Error turning off LEDs during shutdown:", error);
    }
  }
}

// Handle graceful shutdown
const server = new HometimeServer();

process.on("SIGINT", async () => {
  await server.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await server.stop();
  process.exit(0);
});

// Start the server
server.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

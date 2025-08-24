import cron from "node-cron";
import { getTodayEvents } from "./calendar";
import { config } from "./config";
import { getScheduleForDay, isAtWork } from "./schedule";
import { getCurrentTime, getHoursIntoDay } from "./time";
import { LEDVisualizer } from "./visualization";
import { WLEDClient } from "./wled";

class HometimeServer {
  private wled: WLEDClient;
  private visualizer: LEDVisualizer;

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
        const events = await getTodayEvents();

        // Update display with current progress and events
        await this.visualizer.displayWorkDay(currentHours, clockin, clockout, events);
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

  public async start(): Promise<void> {
    console.log("Hometime Server starting...");

    try {
      await this.visualizer.turnOff();
      await this.updateDisplay();

      // Run every 5 min
      cron.schedule("*/5 * * * *", async () => {
        await this.updateDisplay();
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
      await this.visualizer.turnOff();
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

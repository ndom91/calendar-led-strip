import { consola } from "consola";
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
      consola.info(`Current time: ${currentHours.toFixed(2)}, Working: ${working}`);

      if (working) {
        const events = await getTodayEvents();

        await this.visualizer.displayWorkDay(currentHours, clockin, clockout, events);
      }
    } catch (error) {
      consola.error("Error updating display:", error);
      await this.visualizer.turnOff();
    }
  }

  public async start(): Promise<void> {
    consola.start("Hometime Server starting...");

    try {
      await this.visualizer.turnOff();
      await this.updateDisplay();

      // Run every 5 min
      cron.schedule(
        "*/5 * * * *",
        async () => {
          await this.updateDisplay();
        },
        {
          name: "update_display",
        },
      );

      consola.success("Hometime Server running. Press Ctrl+C to stop.");
    } catch (error) {
      consola.error("Failed to start Hometime Server:", error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    consola.info("Hometime Server stopping...");
    await this.visualizer.turnOff();
  }
}

const server = new HometimeServer();

process.on("SIGINT", async () => {
  await server.stop();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await server.stop();
  process.exit(0);
});

server.start().catch((error) => {
  consola.error("Failed to start server:", error);
  process.exit(1);
});

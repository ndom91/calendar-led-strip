import { consola } from "consola";
import { hourToIndex, isValidIndex } from "./schedule";
import type { CalendarEvent, Config, WLEDColor } from "./types";
import type { WLEDClient } from "./wled";

export class LEDVisualizer {
  private wled: WLEDClient;
  private config: Config;

  constructor(wled: WLEDClient, config: Config) {
    this.wled = wled;
    this.config = config;
  }

  private createEmptyPixels(): WLEDColor[] {
    return Array(this.config.ledCount).fill([0, 0, 0]) as WLEDColor[];
  }

  async displayWorkDay(
    currentHours: number,
    clockin: number,
    clockout: number,
    events: CalendarEvent[],
  ): Promise<void> {
    const pixels = this.createEmptyPixels();

    // Fill work day background with bar color
    for (let i = 0; i < this.config.ledCount; i++) {
      pixels[i] = this.config.barColor as [number, number, number];
    }

    // Overlay event blocks
    for (const event of events) {
      const startIndex = hourToIndex(
        event.startTime,
        clockin,
        clockout,
        this.config.ledCount,
        this.config.flip,
      );
      const endIndex = hourToIndex(
        event.endTime,
        clockin,
        clockout,
        this.config.ledCount,
        this.config.flip,
      );

      if (startIndex >= 0 && endIndex >= 0) {
        const minIndex = Math.min(startIndex, endIndex);
        const maxIndex = Math.max(startIndex, endIndex);

        for (let i = minIndex; i <= maxIndex; i++) {
          if (isValidIndex(i, this.config.ledCount)) {
            pixels[i] = this.config.eventColor as [number, number, number];
          }
        }
      }
    }

    // Always on top - current time indicator
    const currentIndex = hourToIndex(
      currentHours,
      clockin,
      clockout,
      this.config.ledCount,
      this.config.flip,
    );
    if (isValidIndex(currentIndex, this.config.ledCount)) {
      pixels[currentIndex] = this.config.currentTimeColor;
    }

    await this.wled.setLEDs(pixels);
  }

  async turnOff(): Promise<void> {
    try {
      await this.wled.turnOff();
    } catch (offError) {
      consola.error("Error turning off LEDs:", offError);
    }
  }
}

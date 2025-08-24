import { hourToIndex, isValidIndex } from "./schedule";
import type { CalendarEvent, Config } from "./types";
import type { WLEDClient } from "./wled";

export class LEDVisualizer {
  private wled: WLEDClient;
  private config: Config;

  constructor(wled: WLEDClient, config: Config) {
    this.wled = wled;
    this.config = config;
  }

  private createEmptyPixels(): Array<[number, number, number]> {
    return Array(this.config.ledCount).fill([0, 0, 0]) as Array<[number, number, number]>;
  }

  async drawBar(currentHours: number, clockin: number, clockout: number): Promise<void> {
    const pixels = this.createEmptyPixels();
    const barUpTo = hourToIndex(
      currentHours,
      clockin,
      clockout,
      this.config.ledCount,
      this.config.flip,
    );

    for (let i = 0; i < this.config.ledCount; i++) {
      if (this.config.flip) {
        if (i >= barUpTo) {
          pixels[i] = this.config.barColor as [number, number, number];
        }
      } else {
        if (i <= barUpTo) {
          pixels[i] = this.config.barColor as [number, number, number];
        }
      }
    }

    await this.wled.setLEDs(pixels);
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

    // Add current time indicator (always on top)
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

  isCurrentlyInEvent(currentHours: number, events: CalendarEvent[]): boolean {
    return events.some((event) => currentHours >= event.startTime && currentHours <= event.endTime);
  }

  private wheel(pos: number): [number, number, number] {
    if (pos < 0 || pos > 255) {
      return [0, 0, 0];
    } else if (pos < 85) {
      return [Math.floor(pos * 3), Math.floor(255 - pos * 3), 0];
    } else if (pos < 170) {
      pos -= 85;
      return [Math.floor(255 - pos * 3), 0, Math.floor(pos * 3)];
    } else {
      pos -= 170;
      return [0, Math.floor(pos * 3), Math.floor(255 - pos * 3)];
    }
  }

  async rainbowCycle(duration: number = 5000): Promise<void> {
    const steps = 255;
    const stepDelay = duration / steps;

    for (let j = 0; j < steps; j++) {
      const pixels = this.createEmptyPixels();

      for (let i = 0; i < this.config.ledCount; i++) {
        const pixelIndex = (i * 256) / this.config.ledCount + j;
        pixels[i] = this.wheel(Math.floor(pixelIndex) & 255);
      }

      await this.wled.setLEDs(pixels);
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
    }
  }

  async turnOff(): Promise<void> {
    await this.wled.turnOff();
  }
}

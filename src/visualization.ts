import { Config } from './types';
import { WLEDClient } from './wled';
import { hourToIndex, isValidIndex } from './schedule';

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
    const barUpTo = hourToIndex(currentHours, clockin, clockout, this.config.ledCount, this.config.flip);
    
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

  async addEvents(events: number[], clockin: number, clockout: number): Promise<void> {
    const pixels = this.createEmptyPixels();
    
    // First draw the bar
    const currentHours = new Date().getHours() + new Date().getMinutes() / 60;
    const barUpTo = hourToIndex(currentHours, clockin, clockout, this.config.ledCount, this.config.flip);
    
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
    
    // Then overlay events
    for (const eventTime of events) {
      const index = hourToIndex(eventTime, clockin, clockout, this.config.ledCount, this.config.flip);
      if (isValidIndex(index, this.config.ledCount)) {
        pixels[index] = this.config.eventColor as [number, number, number];
      }
    }
    
    await this.wled.setLEDs(pixels);
  }

  async flashEvents(intensity: number = 1): Promise<void> {
    const pixels = this.createEmptyPixels();
    
    for (let i = 0; i < this.config.ledCount; i++) {
      const [r, g, b] = this.config.eventColor;
      pixels[i] = [r * intensity, g * intensity, b * intensity];
    }
    
    await this.wled.setLEDs(pixels);
  }

  async flashBarTip(currentHours: number, clockin: number, clockout: number, intensity: number = 1): Promise<void> {
    const pixels = this.createEmptyPixels();
    
    // Draw the full bar first
    const barUpTo = hourToIndex(currentHours, clockin, clockout, this.config.ledCount, this.config.flip);
    
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
    
    // Flash the tip
    const tipIndex = Math.min(barUpTo, this.config.ledCount - 1);
    if (isValidIndex(tipIndex, this.config.ledCount)) {
      const [r, g, b] = this.config.barColor;
      pixels[tipIndex] = [r * intensity, g * intensity, b * intensity];
    }
    
    await this.wled.setLEDs(pixels);
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
        const pixelIndex = (i * 256 / this.config.ledCount) + j;
        pixels[i] = this.wheel(Math.floor(pixelIndex) & 255);
      }
      
      await this.wled.setLEDs(pixels);
      await new Promise(resolve => setTimeout(resolve, stepDelay));
    }
  }

  async turnOff(): Promise<void> {
    await this.wled.turnOff();
  }
}
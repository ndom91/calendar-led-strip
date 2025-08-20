import axios from "axios";
import type { WLEDState } from "./types";

export class WLEDClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  async setState(state: Partial<WLEDState>): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/json/state`, state, {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      });
    } catch (error) {
      console.error("Error setting WLED state:", error);
      throw error;
    }
  }

  async setLEDs(pixels: Array<[number, number, number]>): Promise<void> {
    const colors: number[] = [];

    // Convert RGB tuples to flat array expected by WLED
    for (const [r, g, b] of pixels) {
      colors.push(r, g, b);
    }

    const state: Partial<WLEDState> = {
      on: true,
      seg: [
        {
          id: 0,
          start: 0,
          stop: pixels.length,
          col: pixels,
        },
      ],
    };

    await this.setState(state);
  }

  async turnOff(): Promise<void> {
    await this.setState({ on: false });
  }

  async setBrightness(brightness: number): Promise<void> {
    await this.setState({ bri: Math.max(0, Math.min(255, brightness)) });
  }
}

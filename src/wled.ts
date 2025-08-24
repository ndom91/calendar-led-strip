import { config } from "./config";
import type { WLEDSegment, WLEDState } from "./types";

export class WLEDClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  async setState(state: Partial<WLEDState>): Promise<void> {
    try {
      if (config.debug) {
        console.log("Setting WLED State", JSON.stringify(state, null, 2));
      }
      const req = await fetch(`${this.baseUrl}/json/state`, {
        method: "POST",
        body: JSON.stringify(state),
        headers: { "Content-Type": "application/json" },
      });
      const response = await req.json();

      if (config.debug) {
        console.log("WLED API Response", JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error("Error setting WLED state:", error);
      throw error;
    }
  }

  private groupPixelsIntoSegments(pixels: Array<[number, number, number]>): Array<{
    id: number;
    start: number;
    stop: number;
    col: Array<[number, number, number]>;
  }> {
    if (pixels.length === 0) return [];

    if (config.debug) {
      console.log("GENERATED PIXELS", pixels);
    }

    const segments: Array<{
      id: number;
      start: number;
      stop: number;
      col: Array<[number, number, number]>;
    }> = [];

    let currentColor = pixels[0];
    let segmentStart = 0;
    let segmentId = 0;

    for (let i = 1; i <= pixels.length; i++) {
      const nextColor = i < pixels.length ? pixels[i] : null;

      // Check if color changed or we're at the end
      const colorChanged =
        !nextColor ||
        currentColor[0] !== nextColor[0] ||
        currentColor[1] !== nextColor[1] ||
        currentColor[2] !== nextColor[2];

      if (colorChanged) {
        // Create segment for current color block
        // currentColor = currentColor.map((i) => Math.floor(i)) as [number, number, number];

        const currentSegment: WLEDSegment = {
          id: segmentId++,
          start: segmentStart,
          stop: i,
          col: [currentColor],
        };
        if (currentColor === config.barColor) {
          currentSegment.bri = 10;
        }

        segments.push(currentSegment);

        // Start new segment
        if (nextColor) {
          currentColor = nextColor;
          segmentStart = i;
        }
      }
    }

    if (config.debug) {
      console.log("GENERATED SEGMENTS", JSON.stringify(segments, null, 2));
    }
    return segments;
  }

  async setLEDs(pixels: Array<[number, number, number]>): Promise<void> {
    const segments = this.groupPixelsIntoSegments(pixels);

    const state: Partial<WLEDState> = {
      on: true,
      bri: config.barBrightness,
      transition: 5,
      v: config.debug,
      seg: segments,
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

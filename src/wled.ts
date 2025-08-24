import { consola } from "consola";
import { config } from "./config";
import type { WLEDColor, WLEDSegment, WLEDState } from "./types";

export class WLEDClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async getState(): Promise<WLEDState> {
    try {
      const req = await fetch(`${this.baseUrl}/json/state`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response = await req.json();

      if (config.debug) {
        consola.info("WLED State", JSON.stringify(response, null, 2));
      }
      return response as WLEDState;
    } catch (error) {
      consola.error("Error getting WLED state:", error);
      throw error;
    }
  }

  async setState(state: Partial<WLEDState>): Promise<void> {
    try {
      if (config.debug) {
        consola.info("Setting WLED State", JSON.stringify(state, null, 2));
      }
      const req = await fetch(`${this.baseUrl}/json/state`, {
        method: "POST",
        body: JSON.stringify(state),
        headers: { "Content-Type": "application/json" },
      });
      const response = await req.json();

      if (config.debug) {
        consola.info("WLED API Response", JSON.stringify(response, null, 2));
      }
    } catch (error) {
      consola.error("Error setting WLED state:", error);
      throw error;
    }
  }

  private groupPixelsIntoSegments(pixels: WLEDColor[]): WLEDSegment[] {
    if (pixels.length === 0) return [];

    if (config.debug) {
      consola.info("Generated Pixels", pixels);
    }

    const segments: WLEDSegment[] = [
      {
        id: 0,
        stop: 0,
      },
    ];
    let currentColor = pixels[0];
    let segmentStart = 0;
    let segmentId = 0;

    for (let i = 1; i <= pixels.length; i++) {
      const nextColor = i < pixels.length ? pixels[i] : null;

      // Check if color changed or we're at the end of segment
      const colorChanged =
        !nextColor ||
        currentColor[0] !== nextColor[0] ||
        currentColor[1] !== nextColor[1] ||
        currentColor[2] !== nextColor[2];

      if (colorChanged) {
        const currentSegment: WLEDSegment = {
          id: segmentId++,
          start: segmentStart,
          stop: i,
          col: [currentColor],
          fx: 0,
          pal: 0,
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
      consola.info("Generated Segments", JSON.stringify(segments, null, 2));
    }
    return segments;
  }

  async setLEDs(pixels: Array<[number, number, number]>): Promise<void> {
    const segments = this.groupPixelsIntoSegments(pixels);

    const state: Partial<WLEDState> = {
      on: true,
      bri: config.barBrightness,
      v: config.debug,
      seg: segments,
    };

    await this.setState(state);
  }

  async turnOff(): Promise<void> {
    const state = await this.getState();

    const availableSegmentIds = state.seg?.map((i) => i.id);
    if (availableSegmentIds) {
      await this.setState({
        on: false,
        v: true,
        seg: [
          ...availableSegmentIds.map((id) => ({
            id,
            stop: 0,
          })),
          {
            id: 0,
            stop: config.ledCount,
          },
        ],
      });
    }
  }

  async resetPreset(): Promise<void> {
    await this.setState({ on: true, ps: 2 });
  }

  async setBrightness(brightness: number): Promise<void> {
    await this.setState({ bri: Math.max(0, Math.min(255, brightness)) });
  }
}

import type { Config } from "./types";

export const config: Config = {
  ledCount: 100,
  barColor: [239, 169, 219],
  barBrightness: 100,
  eventColor: [25, 191, 111],
  currentTimeColor: [152, 80, 32],
  flip: false,
  debug: true,
  wledUrl: "http://10.0.2.29",
  schedule: {
    monday: [{ clockin: "9", clockout: "20" }],
    tuesday: [{ clockin: "9", clockout: "20" }],
    wednesday: [{ clockin: "9", clockout: "20" }],
    thursday: [{ clockin: "9", clockout: "20" }],
    friday: [{ clockin: "9", clockout: "20" }],
    saturday: [{ clockin: "0", clockout: "0" }],
    sunday: [{ clockin: "0", clockout: "0" }],
  },
};

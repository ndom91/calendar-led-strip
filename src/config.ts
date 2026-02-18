import type { Config } from "./types";

export const config: Config = {
  ledCount: 100,
  barColor: [239, 169, 219],
  barBrightness: 100,
  eventColor: [25, 191, 111],
  currentTimeColor: [152, 80, 32],
  flip: false,
  debug: false,
  wledUrl: "http://10.0.2.29",
  schedule: {
    monday: [{ clockin: "9", clockout: "19" }],
    tuesday: [{ clockin: "9", clockout: "19" }],
    wednesday: [{ clockin: "9", clockout: "19" }],
    thursday: [{ clockin: "9", clockout: "19" }],
    friday: [{ clockin: "9", clockout: "19" }],
    saturday: [{ clockin: "0", clockout: "0" }],
    sunday: [{ clockin: "0", clockout: "0" }],
  },
};

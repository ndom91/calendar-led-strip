import { Config } from './types';

export const config: Config = {
  ledCount: 100,
  barColor: [0, 25, 0],
  eventColor: [0, 0, 255],
  flip: false,
  googleCalEnabled: true,
  wledUrl: 'http://10.0.2.29',
  schedule: {
    monday: [{ clockin: '9', clockout: '17' }],
    tuesday: [{ clockin: '9', clockout: '17' }],
    wednesday: [{ clockin: '9', clockout: '17' }],
    thursday: [{ clockin: '9', clockout: '17' }],
    friday: [{ clockin: '9', clockout: '17' }],
    saturday: [{ clockin: '0', clockout: '0' }],
    sunday: [{ clockin: '0', clockout: '0' }]
  }
};
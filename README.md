# Hometime Server

A TypeScript server that visualizes work progress and calendar events on a WLED-controlled LED strip.

## Features

- **Work Progress Bar**: Shows current progress through your work day as a colored bar on the LED strip
- **Calendar Integration**: Uses `gcalcli` to fetch today's calendar events and highlights them on the strip
- **WLED Integration**: Controls LED strips via WLED API at configurable IP address
- **Configurable Schedule**: Set work hours for each day of the week
- **Visual Effects**: Rainbow celebration when work day ends, flashing effects for events

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure `gcalcli` is installed and configured on your system:
   ```bash
   # Install gcalcli (varies by system)
   pip install gcalcli
   
   # Configure authentication
   gcalcli list
   ```

3. Configure your WLED device IP in `src/config.ts`

4. Adjust work schedule and LED settings in `src/config.ts`

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Configuration

Edit `src/config.ts` to customize:
- LED count and colors
- WLED device IP address  
- Work schedule for each day
- Whether to enable Google Calendar integration

## Original Python Version

This TypeScript version replaces the original MicroPython implementation that ran on Raspberry Pi Pico, now running on your x86 server with WLED API integration instead of direct NeoPixel control.
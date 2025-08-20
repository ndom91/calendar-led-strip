# Hometime Server

> A TypeScript server that visualizes work progress and calendar events on a WLED-controlled LED strip.

A typescript rewrite of this [hometime](https://github.com/veebch/hometime) project. Instead of runnign this on a Raspberry Pi Pico, for example, this node script is run on a server in your house and will update a WLED-controlled LED Strip via its API.

## Features

- **Work Progress Bar**: Shows current progress through your work day as a colored bar on the LED strip
- **Calendar Integration**: Uses `gcalcli` to fetch today's calendar events and highlights them on the strip
- **WLED Integration**: Controls LED strips via WLED API at configurable IP address
- **Configurable Schedule**: Set work hours for each day of the week
- **Visual Effects**: Rainbow celebration when work day ends, flashing effects for events

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Make sure `gcalcli` is installed and configured on your system:
   ```bash
   pip install gcalcli
   gcalcli init
   ```

3. Configure your WLED device IP in `src/config.ts`

4. Adjust work schedule and LED settings in `src/config.ts`

5. Finally, ensure you can at least successfully run a gcalcli command like `gcalcli
   agenda` with the user that's going to be running this server.

## Usage

### Development
```bash
pnpm run dev
```

### Production
```bash
pnpm run build
pnpm start
```

To run this as a service, there is a demo systemd service file available at `hometime.service`. If you decide to use it, don't forget to double check and update variables like the working directory and the path to your `GCALCLI_CONFIG`.


## Configuration

Edit `src/config.ts` to customize:
- LED count and colors
- WLED device IP address
- Work schedule for each day
- Whether to enable Google Calendar integration

## License

MIT

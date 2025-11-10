# Hometime LED Strip Calendar 🔴🟠🟡🟢🔵🟣

> TypeScript project to visualize calendar events on any WLED-controlled LED strip

asdfThis project was inspired by the original [hometime](https://github.com/veebch/hometime) project. Instead of running the code on a Raspberry Pi Pico connected directly to some NeoPixels, for example, this Node script is run on a server in your LAN and will update any WLED-controlled LED Strip via its API.

![example](./hometime.png)

## 🛠️ Features

- **Work Progress Bar**: Shows current progress through your work day as a colored bar on the LED strip
- **Calendar Integration**: Uses `gcalcli` to fetch today's calendar events and highlights them on the strip
- **WLED Integration**: Controls LED strips via WLED API at configurable IP address
- **Configurable Schedule**: Set work hours for each day of the week

## 🏗️ Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Install `gcalcli` and init the authentication. For more details see their [API Auth](https://github.com/insanum/gcalcli/blob/main/docs/api-auth.md) docs.
   ```bash
   brew install gcalcli
   gcalcli init
   ```

3. Configure your WLED device IP in `src/config.ts`

4. Adjust work schedule and LED settings in `src/config.ts`

5. Finally, ensure you can at least successfully run a gcalcli command like `gcalcli
   agenda` with the user that's going to be running this server.

## 🧑‍🔧 Usage

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


## ⚙️ Configuration

Edit `src/config.ts` to customize:
- LED count and colors
- WLED device IP address
- Work schedule for each day

## 📝 License

MIT

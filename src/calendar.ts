import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function getTodayEvents(): Promise<number[]> {
	try {
		const today = new Date();
		const tmr = new Date();
		tmr.setDate(today.getDate() + 1);
		const todayString = today.toISOString().split("T")[0];
		const tmrString = tmr.toISOString().split("T")[0];
		const command = `GCALCLI_CONFIG=/opt/ndomino/hometime/config.toml gcalcli agenda --tsv --military ${todayString} ${tmrString}`;

		const { stdout } = await execAsync(command);
		const events: number[] = [];

		const lines = stdout.trim().split("\n");
		for (const line of lines) {
			if (line.trim() === "") continue;

			const columns = line.split("\t");
			if (columns.length > 4) {
				// Only we have a start_time and end_time
				if (
					columns[0] !== "start_date" &&
					columns[1] !== "" &&
					columns[3] !== ""
				) {
					const timeStr = columns[1]; // Time column
					const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
					if (timeMatch) {
						const hours = parseInt(timeMatch[1], 10);
						const minutes = parseInt(timeMatch[2], 10);
						const hoursFloat = hours + minutes / 60;
						console.log("TIME_MATCH", {
							hours,
							minutes,
							hoursFloat,
						});
						events.push(hoursFloat);
					}
				}
			}
		}

		console.log("events", events);
		// process.exit(0);
		return events;
	} catch (error) {
		console.error("Error fetching calendar events:", error);
		return [];
	}
}


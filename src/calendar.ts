import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getTodayEvents(): Promise<number[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const command = `gcalcli agenda --tsv --nocolor --details=calendar ${today} ${today}`;
    
    const { stdout } = await execAsync(command);
    const events: number[] = [];
    
    // Parse gcalcli TSV output
    const lines = stdout.trim().split('\n');
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const columns = line.split('\t');
      if (columns.length >= 2) {
        const timeStr = columns[1]; // Time column
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          const hoursFloat = hours + minutes / 60;
          events.push(hoursFloat);
        }
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}
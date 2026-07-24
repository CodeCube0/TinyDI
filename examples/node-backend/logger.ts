export interface ILogger {
  info(message: string): void;
  error(message: string): void;
}

export class ConsoleLogger implements ILogger {
  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`);
  }
}

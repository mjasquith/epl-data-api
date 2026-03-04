export interface LogMessage {
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
  context: string;
  customAttributes?: Record<string, any>; // Add this line
}

export function log(logMessage: LogMessage): void {
  const { level, message, context, customAttributes } = logMessage;
  console.log(JSON.stringify({ level, message, context, ...customAttributes }));
}
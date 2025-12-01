import util from "util";

const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[36m",    // info
  yellow: "\x1b[33m",  // warn
  green: "\x1b[32m",   // success
  red: "\x1b[31m",     // error
  magenta: "\x1b[35m", // debug
};

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export function log(
  tag: string,
  message: string,
  data: any = null,
  level: LogLevel = "INFO"
) {
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });

  let color = colors.blue;
  if (level === "WARN") color = colors.yellow;
  if (level === "ERROR") color = colors.red;
  if (level === "DEBUG") color = colors.magenta;
  if (level === "INFO") color = colors.blue;

  const prefix = `${color}[${timestamp}] [${level}] [${tag}]${colors.reset}`;

  if (data !== null && data !== undefined) {
    if (data instanceof Error) {
      console.error(prefix, message, data.stack);
    } else if (typeof data === "object") {
      console.log(prefix, message, util.inspect(data, { depth: null, colors: true }));
    } else {
      console.log(prefix, message, data);
    }
  } else {
    console.log(prefix, message);
  }
}

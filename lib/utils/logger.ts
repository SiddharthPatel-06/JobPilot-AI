const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
};

export function log(tag: string, message: string, data: any = null, color: keyof typeof colors = "blue") {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour12: false });
  const prefix = `${colors[color]}[${timestamp}] [${tag}]${colors.reset}`;
  if (data !== null && data !== undefined) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
}

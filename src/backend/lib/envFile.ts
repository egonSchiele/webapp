// parse .env file if it exists into process.env
import { existsSync, readFileSync } from "fs";
import { resolve, join } from "path";

export const __dirname = import.meta.dirname;
export const rootDir = join(__dirname, "../../");
const envfiles = [
  resolve(rootDir, "..", ".env.local"),
  resolve(rootDir, "..", ".env"),
];
for (const envfile of envfiles) {
  if (tryEnvFile(envfile)) {
    break;
  }
}

function tryEnvFile(envfile: string) {
  console.log("Checking for env file at", envfile);
  if (existsSync(envfile)) {
    console.log("Reading env file at", envfile);
    const env = readFileSync(envfile, "utf-8");
    env.split("\n").forEach((line) => {
      if (line.trim() === "" || line.startsWith("#")) {
        return;
      }
      const [key, value] = line.split("=");
      process.env[key] = value;
      console.log("Setting", key, "to", value);
    });
    return true;
  }
  return false;
}

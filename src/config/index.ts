import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
  footballDataApiToken: string;
  cache?: {
    defaultTtlMs?: number;
    matches?: {
      fixtures?: number;
      results?: number;
    };
  };
}

function loadConfig(): Config {
  // 1. Check command line arguments
  const args = process.argv.slice(2);
  const cmdLineToken = args.find((arg) =>
    arg.startsWith('footballDataApiToken=')
  );
  if (cmdLineToken) {
    const token = cmdLineToken.split('=')[1];
    if (token) {
      return { footballDataApiToken: token };
    }
  }

  // 2. Check environment variable
  const envToken = process.env.FOOTBALL_DATA_API_TOKEN;
  if (envToken) {
    return { footballDataApiToken: envToken };
  }

  // 3. Check config.json file
  const configPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(configPath)) {
    const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (configFile.footballDataApiToken) {
      return configFile;
    }
  }

  throw new Error(
    'footballDataApiToken not found in command line args, FOOTBALL_DATA_API_TOKEN env var, or src/config/config.json'
  );
}

export const config = loadConfig();
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

interface Config {
  footballDataApiToken: string;
  cache?: {
    defaultTtlMs?: number;
    matches?: {
      fixtures?: number;
      results?: number;
      all?: number;
    };
  };
}

function loadConfig(): Config {
  var config: Config = { footballDataApiToken: '' }

  // 1. Load config.json file
  const configPath = path.join(__dirname, 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      config = configFile;
    } catch (error) {
      console.error('Error reading config.json:', error);
    }
  }

  // 2. Check for environment variable override of footballDataApiToken
  const envToken = process.env.FOOTBALL_DATA_API_TOKEN;
  if (envToken) {
    config.footballDataApiToken = envToken;
  }

  // 3. Check for command line argument override of footballDataApiToken (e.g. footballDataApiToken=yourtoken)
  const args = process.argv.slice(2);
  const cmdLineToken = args.find((arg) =>
    arg.startsWith('footballDataApiToken=')
  );
  if (cmdLineToken) {
    const token = cmdLineToken.split('=')[1];
    if (token) {
      config.footballDataApiToken = token;
    }
  }

  if (!config.footballDataApiToken) {
    throw new Error(
      'footballDataApiToken not found in command line args, FOOTBALL_DATA_API_TOKEN env var, or src/config/config.json'
    );
  }
  return config;
}

export function getCacheTtl(cacheCategory: string, cacheType: string): number {
  if (!config.cache || !config.cache.hasOwnProperty(cacheCategory)) {
    return config.cache?.defaultTtlMs ?? 5 * 60 * 1000;
  }
  const endpointTtlConfigs: Record<string, number> = config.cache[cacheCategory as keyof typeof config.cache] as Record<string, number>;
  if (endpointTtlConfigs.hasOwnProperty(cacheType)) {
    return endpointTtlConfigs[cacheType as keyof typeof endpointTtlConfigs] ?? config.cache?.defaultTtlMs ?? 5 * 60 * 1000;
  } else {
    return config.cache?.defaultTtlMs ?? 5 * 60 * 1000;
  }
}

export const config = loadConfig();
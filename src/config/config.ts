/* local imports */
import { ConfigKey } from "./enum";

export default () => ({
  [ConfigKey.PORT]: parseInt(process.env.PORT ?? "4000", 10),
  [ConfigKey.NODE_ENV]: process.env.NODE_ENV ?? "development",
  [ConfigKey.SDK_FINANCE_BASE_URL]: process.env.SDK_FINANCE_BASE_URL,
  [ConfigKey.INTERNAL_AUTH_SECRET_BANKING_SERVICE]:
    process.env.INTERNAL_AUTH_SECRET_BANKING_SERVICE,

  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST ?? "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT ?? "6379", 10),

  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_TO_CONSOLE: process.env.LOG_TO_CONSOLE !== "false",
  LOG_TO_FILE: process.env.LOG_TO_FILE === "true",
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || "logs/app.log",
});

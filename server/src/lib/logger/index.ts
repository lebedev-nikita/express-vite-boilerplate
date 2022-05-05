import { configure, getLogger as createLogger } from "log4js";

if (process.env.LOG_CONFIG_PATH) {
  configure(process.env.LOG_CONFIG_PATH);
}

export const getLogger = (category?: string) => {
  const logger = createLogger(category);

  if (!process.env.LOG_CONFIG_PATH) {
    logger.level = process.env.LOG_DEFAULT_LEVEL || "info";
  }

  return {
    trace: (msg) => logger.trace(msg),
    debug: (msg) => logger.debug(msg),
    info: (msg) => logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg) => logger.error(msg),
    fatal: (msg) => logger.fatal(msg),
  };
};

export const logger = getLogger();

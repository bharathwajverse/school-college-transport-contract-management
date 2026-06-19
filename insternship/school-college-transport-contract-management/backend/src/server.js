const app = require("./app");
const { env } = require("./config/env");
const { startAlertCron } = require("./cron/alertCron");
const logger = require("./utils/logger");

app.listen(env.port, () => {
  logger.info(`API server running on port ${env.port}`);

  if (env.enableCron) {
    startAlertCron();
  }
});

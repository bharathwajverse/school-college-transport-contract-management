const cron = require("node-cron");
const { runAlertEngine } = require("../services/alertService");
const logger = require("../utils/logger");

let scheduledTask = null;

function startAlertCron() {
  if (scheduledTask) {
    return scheduledTask;
  }

  scheduledTask = cron.schedule("0 9 * * *", async () => {
    try {
      const result = await runAlertEngine();
      logger.info("Alert engine completed successfully", { result });
    } catch (error) {
      logger.error("Alert engine cron failed", { error });
    }
  });

  logger.info("Alert engine cron scheduled for 09:00 daily");
  return scheduledTask;
}

module.exports = { startAlertCron };


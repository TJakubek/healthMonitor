import { monitorNodeHealth } from "./nodeHealthMonitor";
import { monitorTsoSubmissions } from "./tsoSubmissionMonitor";
import { startTelegramBot } from "./telegram";
import { tsoSubmissionConfig, nodeHealthConfig } from "./configs";
require("dotenv").config();

const runHealthMonitor = () => {
  console.log("-----------------");
  console.log("starting monitor");
  startTelegramBot();
  for (let tsoConfig of tsoSubmissionConfig) {
    monitorTsoSubmissions(tsoConfig);
  }
  for (let nodeConfig of nodeHealthConfig) {
    monitorNodeHealth(nodeConfig);
  }
};
runHealthMonitor();

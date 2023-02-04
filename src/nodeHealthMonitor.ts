import fetch from "node-fetch";
import { NodeHealthConfig } from "./configs";

import { sendMessageToTelegramBot } from "./telegram";
import { sleep } from "./utils";

export const monitorNodeHealth = async (config: NodeHealthConfig) => {
  let failureMessageSent: boolean = false;

  console.log("monitoring", config.nodeAlias);
  let unhealthyCount = 0;
  while (true) {
    try {
      const healthQuery = await fetch(config.healthEndpoint).then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Health query failed");
      });

      if (!healthQuery.healthy) {
        unhealthyCount += 1;
      } else {
        if (unhealthyCount >= config.failuresBeforeNotified) {
          sendMessageToTelegramBot(`${config.nodeAlias} health reestablished`);
          failureMessageSent = false;
        }
        unhealthyCount = 0;
      }
    } catch (e) {
      unhealthyCount += 1;
    }

    if (
      unhealthyCount >= config.failuresBeforeNotified &&
      !failureMessageSent
    ) {
      sendMessageToTelegramBot(`${config.nodeAlias} health failure`);
      failureMessageSent = true;
    }
    await sleep(config.interval * 1000);
  }
};

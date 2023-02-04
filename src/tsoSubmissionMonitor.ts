import { providers } from "ethers";
import {
  MainnetPriceSubmitter__factory,
  SongbirdPriceSubmitter__factory,
} from "../types/ethers-contracts/factories/";
import { TsoSubmissionConfig } from "./configs";
import { sendMessageToTelegramBot } from "./telegram";
import { addToProviderMap, providerMap, sleep } from "./utils";

export const monitorTsoSubmissions = async (config: TsoSubmissionConfig) => {
  let revealFailureMessageSent = false;
  let submitFailureMessageSent = false;
  console.log(`monitoring ${config.tsoAlias} submissions`);
  if (!providerMap.has(config.websocket)) {
    const newProvider = new providers.WebSocketProvider(config.websocket);

    addToProviderMap(config.websocket, newProvider);
  }
  const provider = providerMap.get(config.websocket)!;
  const factory =
    config.chain === "FLARE"
      ? MainnetPriceSubmitter__factory
      : SongbirdPriceSubmitter__factory;
  const priceSubmitter = factory.connect(
    "0x1000000000000000000000000000000000000003",
    provider
  );

  const epochLength = 3 * 60 * 1000;

  let lastReveal = new Date().getTime();
  let lastSubmission = new Date().getTime();

  const hashEvent =
    config.chain === "FLARE" ? "HashSubmitted" : "PriceHashesSubmitted";
  const revealEvent =
    config.chain === "FLARE" ? "PricesRevealed" : "PricesRevealed";
  priceSubmitter.on(hashEvent, (address: string) => {
    if (address.toLowerCase() === config.tsoAddress.toLowerCase()) {
      lastSubmission = new Date().getTime();
    }
  });
  priceSubmitter.on(revealEvent, (address: string) => {
    if (address.toLowerCase() === config.tsoAddress.toLowerCase()) {
      lastReveal = new Date().getTime();
    }
  });

  let consecutiveFailedSubmissionCount = 0;
  let consecutiveFailedRevealCount = 0;

  while (true) {
    if (lastReveal + epochLength < new Date().getTime()) {
      consecutiveFailedRevealCount += 1;
    } else {
      if (consecutiveFailedRevealCount >= config.revealFailuresBeforeNotified) {
        sendMessageToTelegramBot(`${config.tsoAlias} reveal success`);
        revealFailureMessageSent = false;
      }
      consecutiveFailedRevealCount = 0;
    }
    if (lastSubmission + epochLength < new Date().getTime()) {
      consecutiveFailedSubmissionCount += 1;
    } else {
      if (
        consecutiveFailedSubmissionCount >= config.submitFailuresBeforeNotified
      ) {
        sendMessageToTelegramBot(`${config.tsoAlias} submit success`);
        submitFailureMessageSent = false;
      }
      consecutiveFailedSubmissionCount = 0;
    }

    if (
      consecutiveFailedSubmissionCount >= config.submitFailuresBeforeNotified
    ) {
      sendMessageToTelegramBot(`${config.tsoAlias}  submit failure`);
      submitFailureMessageSent = true;
    }

    if (
      consecutiveFailedSubmissionCount >= config.revealFailuresBeforeNotified
    ) {
      sendMessageToTelegramBot(`${config.tsoAlias} reveal failure`);
      revealFailureMessageSent = true;
    }
    await sleep(epochLength);
  }
};

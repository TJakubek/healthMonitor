import { promisify } from "util";
import { Provider } from "@ethersproject/abstract-provider";

export const sleep = promisify(setTimeout);

export const providerMap = new Map<string, Provider>();

export const addToProviderMap = (websocket: string, provider: Provider) => {
  providerMap.set(websocket, provider);
};

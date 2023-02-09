export type NodeHealthConfig = {
  healthEndpoint: string; // endpoint to call for health check
  interval: number; // seconds between querying
  nodeAlias: string; // alias identifying node
  failuresBeforeNotified: number; // number of unhealthy calls before notification sent
  callback?: Function; // optional callback if you want something triggered on failure other than telegram message
};

export const nodeHealthConfig: NodeHealthConfig[] = [];

export type TsoSubmissionConfig = {
  websocket: string; // websocket of node for chain connection
  chain: "FLARE" | "SGB"; // chain id
  tsoAddress: string; // address of tso which should be monitored
  tsoAlias: string; // alias identifying TSO
  submitFailuresBeforeNotified: number; // number of unhealthy submits before notification sent
  revealFailuresBeforeNotified: number; // number of unhealthy reveals before notification sent
  submitCallback?: Function; // optional callback if you want something triggered on failure other than telegram message
  revealCallback?: Function; // optional callback if you want something triggered on failure other than telegram message
};

export const tsoSubmissionConfig: TsoSubmissionConfig[] = [];

export type ClaimConfig = {
  websocket: string; // websocket of node for chain connection
  chain: "FLARE" | "SGB"; // chain id
  tsoAddress: string; // tso address from which to claim from
  claimToAddress: string; // address to which claim will be done
  privateKeyFromEnv: string; // key in env which has the PK for claiming
};

export const claimConfig: ClaimConfig[] = [];

import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv({ path: "../../.env" });
loadEnv();

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  API_ORIGIN: z.string().default("http://localhost:3000"),
  BASE_SEPOLIA_RPC_URL: z.string().optional(),
  GAME_CONTRACT_ADDRESS: z.string().optional(),
  TOKEN_CONTRACT_ADDRESS: z.string().optional(),
  AGENT_NFT_ADDRESS: z.string().optional(),
  OPERATOR_PRIVATE_KEY: z.string().optional(),
  MANAGED_AGENT_IDS: z.string().default("1,2,3"),
  AI_LOOP_INTERVAL_MS: z.coerce.number().default(30_000)
});

export const appConfig = schema.parse(process.env);

export const managedAgentIds = appConfig.MANAGED_AGENT_IDS.split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value > 0);

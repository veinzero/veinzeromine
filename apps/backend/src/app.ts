import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";

import { AutonomyLoop } from "./ai/autonomy-loop.js";
import { DecisionEngine } from "./ai/decision-engine.js";
import { AgentMemoryStore } from "./ai/memory-store.js";
import { GameChainClient } from "./lib/chain.js";
import { appConfig } from "./lib/config.js";
import { agentRoutes } from "./routes/agents.js";
import { gameRoutes } from "./routes/game.js";
import { healthRoute } from "./routes/health.js";

declare module "fastify" {
  interface FastifyInstance {
    gameChain: GameChainClient;
    decisionEngine: DecisionEngine;
    memoryStore: AgentMemoryStore;
  }
}

export function createApp() {
  const app = Fastify({
    logger: true
  });

  const gameChain = new GameChainClient({
    rpcUrl: appConfig.BASE_SEPOLIA_RPC_URL,
    gameAddress: appConfig.GAME_CONTRACT_ADDRESS as `0x${string}` | undefined,
    tokenAddress: appConfig.TOKEN_CONTRACT_ADDRESS as `0x${string}` | undefined,
    nftAddress: appConfig.AGENT_NFT_ADDRESS as `0x${string}` | undefined,
    operatorPrivateKey: appConfig.OPERATOR_PRIVATE_KEY as `0x${string}` | undefined
  });
  const memoryStore = new AgentMemoryStore();
  const decisionEngine = new DecisionEngine(memoryStore);
  const autonomyLoop = new AutonomyLoop(gameChain, decisionEngine, appConfig.AI_LOOP_INTERVAL_MS, app.log);

  app.decorate("gameChain", gameChain);
  app.decorate("decisionEngine", decisionEngine);
  app.decorate("memoryStore", memoryStore);

  app.register(cors, {
    origin: appConfig.API_ORIGIN
  });
  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  app.register(healthRoute);
  app.register(gameRoutes, { prefix: "/api" });
  app.register(agentRoutes, { prefix: "/api" });

  app.addHook("onReady", async () => {
    autonomyLoop.start();
  });

  app.addHook("onClose", async () => {
    autonomyLoop.stop();
  });

  return app;
}

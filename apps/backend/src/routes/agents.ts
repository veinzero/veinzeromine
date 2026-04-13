import { FastifyPluginAsync } from "fastify";
import { formatEther } from "viem";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["mine", "rest", "upgrade", "claim"]),
  upgradePath: z.enum(["power", "efficiency", "resilience"]).optional()
});

export const agentRoutes: FastifyPluginAsync = async (app) => {
  app.get("/agents/:agentId", async (request) => {
    const params = z.object({ agentId: z.coerce.number().int().positive() }).parse(request.params);
    const agent = await app.gameChain.getAgentSnapshot(params.agentId);
    const [memory, decision] = await Promise.all([
      app.memoryStore.get(params.agentId),
      app.decisionEngine.decide(agent, { persist: false })
    ]);

    return {
      agent: {
        ...agent,
        pendingRewards: formatEther(agent.pendingRewards),
        totalMined: formatEther(agent.totalMined),
        totalClaimed: formatEther(agent.totalClaimed),
        walletTokenBalance: formatEther(agent.walletTokenBalance),
        previewMineReward: formatEther(agent.previewMineReward),
        upgradeCost: formatEther(agent.upgradeCost)
      },
      memory,
      decision
    };
  });

  app.get("/agents/:agentId/memory", async (request) => {
    const params = z.object({ agentId: z.coerce.number().int().positive() }).parse(request.params);
    return app.memoryStore.get(params.agentId);
  });

  app.get("/agents/:agentId/decision", async (request) => {
    const params = z.object({ agentId: z.coerce.number().int().positive() }).parse(request.params);
    const agent = await app.gameChain.getAgentSnapshot(params.agentId);
    return app.decisionEngine.decide(agent, { persist: false });
  });

  app.post("/agents/:agentId/actions/execute", async (request, reply) => {
    const params = z.object({ agentId: z.coerce.number().int().positive() }).parse(request.params);
    const body = actionSchema.parse(request.body);
    const result = await app.gameChain.executeAction(params.agentId, body.action, body.upgradePath);

    if (!result.executed) {
      return reply.status(409).send(result);
    }

    return result;
  });
};

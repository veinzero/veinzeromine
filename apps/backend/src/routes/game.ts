import { FastifyPluginAsync } from "fastify";
import { formatEther } from "viem";

export const gameRoutes: FastifyPluginAsync = async (app) => {
  app.get("/game/overview", async () => {
    const agents = await app.gameChain.getManagedAgents();
    const leaderboard = await app.gameChain.getLeaderboard();

    const totalMined = agents.reduce((accumulator, agent) => accumulator + agent.totalMined, 0n);
    const totalPending = agents.reduce((accumulator, agent) => accumulator + agent.pendingRewards, 0n);

    return {
      brand: {
        title: "VeinZero",
        tagline: "Wake the machine beneath the chain.",
        theme: "Subterranean AI mining economy"
      },
      metrics: {
        activeAgents: agents.length,
        totalMined: formatEther(totalMined),
        pendingRewards: formatEther(totalPending),
        mockMode: app.gameChain.mockMode
      },
      agents: agents.map((agent) => ({
        ...agent,
        pendingRewards: formatEther(agent.pendingRewards),
        totalMined: formatEther(agent.totalMined),
        totalClaimed: formatEther(agent.totalClaimed),
        walletTokenBalance: formatEther(agent.walletTokenBalance),
        previewMineReward: formatEther(agent.previewMineReward),
        upgradeCost: formatEther(agent.upgradeCost)
      })),
      leaderboard
    };
  });

  app.get("/game/leaderboard", async () => ({
    entries: await app.gameChain.getLeaderboard()
  }));
};

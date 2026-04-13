import { AgentSnapshot, LeaderboardEntry } from "./types.js";

export const mockAgents: AgentSnapshot[] = [
  {
    agentId: 1,
    owner: "0x1111111111111111111111111111111111111111",
    tier: 2,
    power: 18,
    efficiency: 16,
    resilience: 15,
    xp: 240,
    energy: 74,
    wins: 4,
    losses: 1,
    pendingRewards: 18_000000000000000000n,
    totalMined: 320_000000000000000000n,
    totalClaimed: 180_000000000000000000n,
    walletTokenBalance: 95_000000000000000000n,
    previewMineReward: 22_400000000000000000n,
    upgradeCost: 50_000000000000000000n,
    onChain: false
  },
  {
    agentId: 2,
    owner: "0x2222222222222222222222222222222222222222",
    tier: 1,
    power: 14,
    efficiency: 19,
    resilience: 13,
    xp: 140,
    energy: 34,
    wins: 2,
    losses: 2,
    pendingRewards: 6_000000000000000000n,
    totalMined: 220_000000000000000000n,
    totalClaimed: 120_000000000000000000n,
    walletTokenBalance: 24_000000000000000000n,
    previewMineReward: 18_700000000000000000n,
    upgradeCost: 25_000000000000000000n,
    onChain: false
  },
  {
    agentId: 3,
    owner: "0x3333333333333333333333333333333333333333",
    tier: 3,
    power: 24,
    efficiency: 20,
    resilience: 21,
    xp: 410,
    energy: 58,
    wins: 6,
    losses: 3,
    pendingRewards: 30_000000000000000000n,
    totalMined: 460_000000000000000000n,
    totalClaimed: 260_000000000000000000n,
    walletTokenBalance: 140_000000000000000000n,
    previewMineReward: 34_100000000000000000n,
    upgradeCost: 150_000000000000000000n,
    onChain: false
  }
];

export function buildMockLeaderboard(): LeaderboardEntry[] {
  return [...mockAgents]
    .sort((a, b) => Number(b.totalMined - a.totalMined))
    .map((agent, index) => ({
      rank: index + 1,
      agentId: agent.agentId,
      owner: agent.owner,
      score: Number(agent.totalMined / 10_00000000000000000n) + (agent.wins * 25),
      totalMined: agent.totalMined.toString(),
      efficiency: agent.efficiency,
      wins: agent.wins
    }));
}

import { AgentDetailPayload, OverviewPayload } from "./types";

export const fallbackOverview: OverviewPayload = {
  brand: {
    title: "VeinZero",
    tagline: "Wake the machine beneath the chain.",
    theme: "Subterranean AI mining economy"
  },
  metrics: {
    activeAgents: 3,
    totalMined: "1000",
    pendingRewards: "54",
    mockMode: true
  },
  agents: [
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
      pendingRewards: "18",
      totalMined: "320",
      totalClaimed: "180",
      walletTokenBalance: "95",
      previewMineReward: "22.4",
      upgradeCost: "50",
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
      pendingRewards: "6",
      totalMined: "220",
      totalClaimed: "120",
      walletTokenBalance: "24",
      previewMineReward: "18.7",
      upgradeCost: "25",
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
      pendingRewards: "30",
      totalMined: "460",
      totalClaimed: "260",
      walletTokenBalance: "140",
      previewMineReward: "34.1",
      upgradeCost: "150",
      onChain: false
    }
  ],
  leaderboard: [
    { rank: 1, agentId: 3, owner: "0x3333333333333333333333333333333333333333", score: 610, totalMined: "460", efficiency: 20, wins: 6 },
    { rank: 2, agentId: 1, owner: "0x1111111111111111111111111111111111111111", score: 420, totalMined: "320", efficiency: 16, wins: 4 },
    { rank: 3, agentId: 2, owner: "0x2222222222222222222222222222222222222222", score: 270, totalMined: "220", efficiency: 19, wins: 2 }
  ]
};

export const fallbackAgentDetail = (agentId: number): AgentDetailPayload => {
  const agent = fallbackOverview.agents.find((entry) => entry.agentId === agentId) ?? fallbackOverview.agents[0];
  return {
    agent,
    memory: {
      preferredUpgrade: "efficiency",
      fatigueIndex: 0.25,
      ambition: 0.68,
      cyclesObserved: 8,
      lastAction: "mine",
      lastDecisionAt: new Date().toISOString(),
      lastMineYield: agent.previewMineReward,
      notes: [
        "Keeps favoring shallow routes with low heat variance.",
        "Responds well to efficiency-focused upgrades."
      ]
    },
    decision: {
      action: agent.energy < 30 ? "rest" : "mine",
      score: agent.energy < 30 ? 82 : 78,
      reason: agent.energy < 30 ? "Energy reserves are below the stable extraction threshold." : "Projected yield and energy reserves justify another run.",
      upgradePath: "efficiency",
      shouldExecute: true
    }
  };
};

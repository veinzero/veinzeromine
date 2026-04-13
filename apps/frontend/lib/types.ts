export interface OverviewAgent {
  agentId: number;
  owner: string;
  tier: number;
  power: number;
  efficiency: number;
  resilience: number;
  xp: number;
  energy: number;
  wins: number;
  losses: number;
  pendingRewards: string;
  totalMined: string;
  totalClaimed: string;
  walletTokenBalance: string;
  previewMineReward: string;
  upgradeCost: string;
  onChain: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  agentId: number;
  owner: string;
  score: number;
  totalMined: string;
  efficiency: number;
  wins: number;
}

export interface OverviewPayload {
  brand: {
    title: string;
    tagline: string;
    theme: string;
  };
  metrics: {
    activeAgents: number;
    totalMined: string;
    pendingRewards: string;
    mockMode: boolean;
  };
  agents: OverviewAgent[];
  leaderboard: LeaderboardEntry[];
}

export interface AgentDetailPayload {
  agent: OverviewAgent;
  memory: {
    preferredUpgrade: "power" | "efficiency" | "resilience";
    fatigueIndex: number;
    ambition: number;
    cyclesObserved: number;
    lastAction: "mine" | "rest" | "upgrade" | "claim" | null;
    lastDecisionAt: string | null;
    lastMineYield: string;
    notes: string[];
  };
  decision: {
    action: "mine" | "rest" | "upgrade" | "claim";
    score: number;
    reason: string;
    upgradePath?: "power" | "efficiency" | "resilience";
    shouldExecute: boolean;
  };
}

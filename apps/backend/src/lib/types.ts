export type UpgradePath = "power" | "efficiency" | "resilience";

export type AgentAction = "mine" | "rest" | "upgrade" | "claim";

export interface AgentSnapshot {
  agentId: number;
  owner: `0x${string}`;
  tier: number;
  power: number;
  efficiency: number;
  resilience: number;
  xp: number;
  energy: number;
  wins: number;
  losses: number;
  pendingRewards: bigint;
  totalMined: bigint;
  totalClaimed: bigint;
  walletTokenBalance: bigint;
  previewMineReward: bigint;
  upgradeCost: bigint;
  onChain: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  agentId: number;
  owner: `0x${string}`;
  score: number;
  totalMined: string;
  efficiency: number;
  wins: number;
}

export interface AgentMemory {
  agentId: number;
  preferredUpgrade: UpgradePath;
  fatigueIndex: number;
  ambition: number;
  cyclesObserved: number;
  lastAction: AgentAction | null;
  lastDecisionAt: string | null;
  lastMineYield: string;
  notes: string[];
}

export interface DecisionCandidate {
  action: AgentAction;
  score: number;
  reason: string;
  upgradePath?: UpgradePath;
}

export interface DecisionResult extends DecisionCandidate {
  memory: AgentMemory;
  shouldExecute: boolean;
}

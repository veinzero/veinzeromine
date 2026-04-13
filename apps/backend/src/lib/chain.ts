import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  parseEther
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

import { managedAgentIds } from "./config.js";
import { veinZeroAgentNftAbi, veinZeroGameAbi, veinZeroRewardTokenAbi } from "./contracts.js";
import { buildMockLeaderboard, mockAgents } from "./mock.js";
import { AgentAction, AgentSnapshot, LeaderboardEntry, UpgradePath } from "./types.js";

interface ChainConfig {
  rpcUrl?: string;
  gameAddress?: `0x${string}`;
  tokenAddress?: `0x${string}`;
  nftAddress?: `0x${string}`;
  operatorPrivateKey?: `0x${string}`;
}

export class GameChainClient {
  readonly mockMode: boolean;
  readonly canExecute: boolean;

  private readonly publicClient;
  private readonly walletClient;
  private readonly operatorAccount;
  private readonly config: ChainConfig;

  constructor(config: ChainConfig) {
    this.config = config;
    this.mockMode = !config.rpcUrl || !config.gameAddress || !config.tokenAddress || !config.nftAddress;
    this.operatorAccount = config.operatorPrivateKey ? privateKeyToAccount(config.operatorPrivateKey) : undefined;
    this.canExecute = !this.mockMode && Boolean(this.operatorAccount);

    this.publicClient = this.mockMode ? undefined : createPublicClient({
      chain: baseSepolia,
      transport: http(config.rpcUrl)
    });

    this.walletClient = this.canExecute && this.operatorAccount ? createWalletClient({
      account: this.operatorAccount,
      chain: baseSepolia,
      transport: http(config.rpcUrl)
    }) : undefined;
  }

  async getAgentSnapshot(agentId: number): Promise<AgentSnapshot> {
    if (this.mockMode || !this.publicClient || !this.config.gameAddress || !this.config.nftAddress || !this.config.tokenAddress) {
      const mock = mockAgents.find((agent) => agent.agentId === agentId);
      if (!mock) {
        throw new Error(`Agent ${agentId} not found in mock dataset`);
      }

      return mock;
    }

    const owner = await this.publicClient.readContract({
      address: this.config.nftAddress,
      abi: veinZeroAgentNftAbi,
      functionName: "ownerOf",
      args: [BigInt(agentId)]
    });

    const state = await this.publicClient.readContract({
      address: this.config.gameAddress,
      abi: veinZeroGameAbi,
      functionName: "agentStates",
      args: [BigInt(agentId)]
    });

    const previewMineReward = await this.publicClient.readContract({
      address: this.config.gameAddress,
      abi: veinZeroGameAbi,
      functionName: "previewMineReward",
      args: [BigInt(agentId)]
    });

    const upgradeCost = await this.publicClient.readContract({
      address: this.config.gameAddress,
      abi: veinZeroGameAbi,
      functionName: "upgradeCost",
      args: [BigInt(agentId)]
    });

    const walletTokenBalance = await this.publicClient.readContract({
      address: this.config.tokenAddress,
      abi: veinZeroRewardTokenAbi,
      functionName: "balanceOf",
      args: [owner]
    });

    return {
      agentId,
      owner,
      power: Number(state[0]),
      efficiency: Number(state[1]),
      resilience: Number(state[2]),
      xp: Number(state[3]),
      energy: Number(state[4]),
      wins: Number(state[5]),
      losses: Number(state[6]),
      tier: Number(state[7]),
      pendingRewards: state[10],
      totalMined: state[11],
      totalClaimed: state[12],
      walletTokenBalance,
      previewMineReward,
      upgradeCost,
      onChain: true
    };
  }

  async getManagedAgents(): Promise<AgentSnapshot[]> {
    if (this.mockMode) {
      return mockAgents;
    }

    return Promise.all(managedAgentIds.map((id) => this.getAgentSnapshot(id)));
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (this.mockMode) {
      return buildMockLeaderboard();
    }

    const agents = await this.getManagedAgents();
    return [...agents]
      .sort((a, b) => Number((b.totalMined - a.totalMined) + BigInt((b.wins - a.wins) * 10)))
      .map((agent, index) => ({
        rank: index + 1,
        agentId: agent.agentId,
        owner: agent.owner,
        score: Number(BigInt(agent.wins * 20) + (agent.totalMined / parseEther("1"))),
        totalMined: formatEther(agent.totalMined),
        efficiency: agent.efficiency,
        wins: agent.wins
      }));
  }

  async executeAction(agentId: number, action: AgentAction, upgradePath?: UpgradePath) {
    if (!this.canExecute || !this.publicClient || !this.walletClient || !this.config.gameAddress || !this.operatorAccount) {
      return {
        executed: false,
        reason: "Operator wallet or on-chain configuration not available."
      };
    }

    if (action === "mine") {
      const simulation = await this.publicClient.simulateContract({
        address: this.config.gameAddress,
        abi: veinZeroGameAbi,
        functionName: "mine",
        args: [BigInt(agentId)],
        account: this.operatorAccount
      });

      const hash = await this.walletClient.writeContract(simulation.request);
      await this.publicClient.waitForTransactionReceipt({ hash });

      return {
        executed: true,
        hash
      };
    }

    if (action === "rest") {
      const simulation = await this.publicClient.simulateContract({
        address: this.config.gameAddress,
        abi: veinZeroGameAbi,
        functionName: "rest",
        args: [BigInt(agentId)],
        account: this.operatorAccount
      });

      const hash = await this.walletClient.writeContract(simulation.request);
      await this.publicClient.waitForTransactionReceipt({ hash });

      return {
        executed: true,
        hash
      };
    }

    if (action === "claim") {
      const simulation = await this.publicClient.simulateContract({
        address: this.config.gameAddress,
        abi: veinZeroGameAbi,
        functionName: "claimRewards",
        args: [BigInt(agentId)],
        account: this.operatorAccount
      });

      const hash = await this.walletClient.writeContract(simulation.request);
      await this.publicClient.waitForTransactionReceipt({ hash });

      return {
        executed: true,
        hash
      };
    }

    const encodedPath = upgradePath === "efficiency" ? 1 : upgradePath === "resilience" ? 2 : 0;
    const simulation = await this.publicClient.simulateContract({
      address: this.config.gameAddress,
      abi: veinZeroGameAbi,
      functionName: "upgrade",
      args: [BigInt(agentId), encodedPath],
      account: this.operatorAccount
    });

    const hash = await this.walletClient.writeContract(simulation.request);
    await this.publicClient.waitForTransactionReceipt({ hash });

    return {
      executed: true,
      hash
    };
  }
}

import { formatEther } from "viem";

import { AgentMemoryStore } from "./memory-store.js";
import { mineSkill } from "./skills/mine-skill.js";
import { restSkill } from "./skills/rest-skill.js";
import { upgradeSkill } from "./skills/upgrade-skill.js";
import { DecisionSkill } from "./types.js";
import { AgentSnapshot, DecisionCandidate, DecisionResult } from "../lib/types.js";

const skills: DecisionSkill[] = [mineSkill, restSkill, upgradeSkill];

export class DecisionEngine {
  constructor(private readonly memoryStore: AgentMemoryStore) {}

  async decide(agent: AgentSnapshot, options?: { persist?: boolean }): Promise<DecisionResult> {
    const persist = options?.persist ?? true;
    const memory = await this.memoryStore.get(agent.agentId);
    const candidates = skills.map((skill) => skill.evaluate({ agent }));

    if (agent.pendingRewards > 0n) {
      const pending = Number(formatEther(agent.pendingRewards));
      candidates.push({
        action: "claim",
        score: pending >= 20 ? 70 : pending >= 8 ? 55 : 28,
        reason: `The agent has ${pending.toFixed(2)} NLT waiting to be claimed.`
      });
    }

    const adjusted = candidates.map((candidate) => this.adjustWithMemory(candidate, memory));
    adjusted.sort((a, b) => b.score - a.score);
    const winner = adjusted[0];

    const nextMemory = persist
      ? await this.memoryStore.update(agent.agentId, (current) => ({
          ...current,
          cyclesObserved: current.cyclesObserved + 1,
          fatigueIndex: Number(Math.min(1, ((100 - agent.energy) / 100) * 0.7 + current.fatigueIndex * 0.3).toFixed(2)),
          ambition: Number(Math.min(1, ((agent.tier / 5) * 0.6 + current.ambition * 0.4)).toFixed(2)),
          preferredUpgrade: winner.upgradePath ?? current.preferredUpgrade,
          lastAction: winner.action,
          lastDecisionAt: new Date().toISOString(),
          lastMineYield: agent.previewMineReward.toString(),
          notes: [
            ...current.notes.slice(-3),
            `${new Date().toISOString()}: selected ${winner.action} with score ${winner.score.toFixed(1)}.`
          ]
        }))
      : memory;

    return {
      ...winner,
      memory: nextMemory,
      shouldExecute: winner.score >= 60
    };
  }

  private adjustWithMemory(candidate: DecisionCandidate, memory: Awaited<ReturnType<AgentMemoryStore["get"]>>) {
    let modifier = 0;

    if (candidate.action === "rest") {
      modifier += memory.fatigueIndex * 20;
    }

    if (candidate.action === "upgrade" && candidate.upgradePath === memory.preferredUpgrade) {
      modifier += 8;
    }

    if (candidate.action === "mine") {
      modifier += memory.ambition * 12;
    }

    return {
      ...candidate,
      score: Math.max(0, Math.min(100, candidate.score + modifier))
    };
  }
}

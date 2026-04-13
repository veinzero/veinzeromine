import { formatEther } from "viem";

import { DecisionSkill } from "../types.js";

export const mineSkill: DecisionSkill = {
  id: "mine",
  evaluate({ agent }) {
    const yieldValue = Number(formatEther(agent.previewMineReward));
    const energyBias = agent.energy >= 70 ? 22 : agent.energy >= 45 ? 12 : -18;
    const efficiencyBias = agent.efficiency * 1.4;
    const winBias = agent.wins * 2;
    const score = Math.max(0, Math.min(100, 32 + energyBias + efficiencyBias + winBias + yieldValue));

    return {
      action: "mine",
      score,
      reason: `Energy is ${agent.energy}, projected yield is ${yieldValue.toFixed(2)} NLT, and efficiency is ${agent.efficiency}.`
    };
  }
};

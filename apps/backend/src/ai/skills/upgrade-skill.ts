import { formatEther } from "viem";

import { DecisionSkill } from "../types.js";

export const upgradeSkill: DecisionSkill = {
  id: "upgrade",
  evaluate({ agent }) {
    const wallet = Number(formatEther(agent.walletTokenBalance));
    const cost = Number(formatEther(agent.upgradeCost));
    const affordable = wallet >= cost;

    let upgradePath: "power" | "efficiency" | "resilience" = "efficiency";
    if (agent.power < agent.efficiency && agent.power < agent.resilience) {
      upgradePath = "power";
    } else if (agent.resilience < agent.power && agent.resilience < agent.efficiency) {
      upgradePath = "resilience";
    }

    const score = affordable
      ? Math.max(0, Math.min(100, 40 + (agent.tier * 8) + (agent.xp / 15)))
      : Math.max(0, Math.min(100, 10 + (wallet / Math.max(cost, 1)) * 20));

    return {
      action: "upgrade",
      score,
      reason: affordable
        ? `Wallet balance covers the ${cost.toFixed(2)} NLT upgrade cost, and the agent can reinforce its weakest stat.`
        : `Upgrade costs ${cost.toFixed(2)} NLT while the wallet only holds ${wallet.toFixed(2)} NLT.`,
      upgradePath
    };
  }
};

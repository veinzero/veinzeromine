import { DecisionSkill } from "../types.js";

export const restSkill: DecisionSkill = {
  id: "rest",
  evaluate({ agent }) {
    const fatigue = 100 - agent.energy;
    const lossPressure = agent.losses * 5;
    const resilienceRelief = agent.resilience;
    const score = Math.max(0, Math.min(100, 18 + fatigue + lossPressure - resilienceRelief));

    return {
      action: "rest",
      score,
      reason: `Energy is down to ${agent.energy} and the agent's resilience buffer is ${agent.resilience}.`
    };
  }
};

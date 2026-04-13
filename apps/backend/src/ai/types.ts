import { AgentSnapshot, DecisionCandidate } from "../lib/types.js";

export interface SkillContext {
  agent: AgentSnapshot;
}

export interface DecisionSkill {
  id: string;
  evaluate(context: SkillContext): DecisionCandidate;
}

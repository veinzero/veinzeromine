import { describe, expect, it } from "vitest";

import { DecisionEngine } from "../src/ai/decision-engine.js";
import { AgentMemoryStore } from "../src/ai/memory-store.js";
import { mockAgents } from "../src/lib/mock.js";

describe("DecisionEngine", () => {
  it("prefers mining when energy and yield are strong", async () => {
    const engine = new DecisionEngine(new AgentMemoryStore());
    const result = await engine.decide(mockAgents[0]);

    expect(["mine", "upgrade", "claim"]).toContain(result.action);
    expect(result.score).toBeGreaterThan(55);
  });

  it("leans toward rest when the agent is drained", async () => {
    const engine = new DecisionEngine(new AgentMemoryStore());
    const result = await engine.decide({
      ...mockAgents[1],
      energy: 12
    });

    expect(result.action).toBe("rest");
  });
});

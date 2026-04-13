import { FastifyBaseLogger } from "fastify";

import { GameChainClient } from "../lib/chain.js";
import { managedAgentIds } from "../lib/config.js";
import { DecisionEngine } from "./decision-engine.js";

export class AutonomyLoop {
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(
    private readonly chainClient: GameChainClient,
    private readonly decisionEngine: DecisionEngine,
    private readonly intervalMs: number,
    private readonly logger: FastifyBaseLogger
  ) {}

  start() {
    if (this.running) return;
    this.running = true;

    if (!this.chainClient.canExecute) {
      this.logger.info("Autonomy loop running in advisory mode. No operator wallet configured.");
    }

    this.timer = setInterval(() => {
      void this.tick();
    }, this.intervalMs);

    void this.tick();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.running = false;
  }

  private async tick() {
    for (const agentId of managedAgentIds) {
      try {
        const agent = await this.chainClient.getAgentSnapshot(agentId);
        const decision = await this.decisionEngine.decide(agent);

        this.logger.info({
          agentId,
          action: decision.action,
          score: decision.score,
          shouldExecute: decision.shouldExecute
        }, "AI decision generated");

        if (decision.shouldExecute) {
          const result = await this.chainClient.executeAction(agentId, decision.action, decision.upgradePath);
          this.logger.info({ agentId, result }, "AI execution result");
        }
      } catch (error) {
        this.logger.error({ error, agentId }, "Autonomy loop failed for agent");
      }
    }
  }
}

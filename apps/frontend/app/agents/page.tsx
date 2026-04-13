import { AgentCard } from "@/components/agent-card";
import { getAgentDetail, getOverview } from "@/lib/api";

export default async function AgentsPage() {
  const overview = await getOverview();
  const details = await Promise.all(overview.agents.map((agent) => getAgentDetail(agent.agentId)));

  return (
    <div className="space-y-8">
      <section className="panel p-8">
        <div className="eyebrow">My Agents</div>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.18em] text-fog">Fleet Registry</h1>
        <p className="mt-4 max-w-3xl text-fog/70">
          Each agent stores combat record, extraction efficiency, and memory traces surfaced by the AI operator layer. Connect your wallet to act directly on-chain.
        </p>
      </section>

      <section className="grid gap-6">
        {details.map((detail) => (
          <AgentCard key={detail.agent.agentId} agent={detail.agent} decision={detail.decision} />
        ))}
      </section>
    </div>
  );
}

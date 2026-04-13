import { AgentActions } from "./agent-actions";
import { OverviewAgent } from "@/lib/types";
import { shortAddress } from "@/lib/utils";

interface AgentCardProps {
  agent: OverviewAgent;
  decision?: {
    action: string;
    score: number;
    reason: string;
  };
}

export function AgentCard({ agent, decision }: AgentCardProps) {
  return (
    <article className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Agent #{agent.agentId}</div>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.18em] text-fog">Tier {agent.tier} Prospect Core</h3>
          <p className="mt-2 text-sm text-fog/65">Owner {shortAddress(agent.owner)} • {agent.onChain ? "on-chain" : "mock mode"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-steel">Energy</div>
          <div className="font-display text-3xl text-cyan">{agent.energy}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Power" value={String(agent.power)} />
        <Stat label="Efficiency" value={String(agent.efficiency)} />
        <Stat label="Resilience" value={String(agent.resilience)} />
        <Stat label="XP" value={String(agent.xp)} />
        <Stat label="Pending" value={`${agent.pendingRewards} NLT`} />
        <Stat label="Yield" value={`${agent.previewMineReward} NLT`} />
        <Stat label="Upgrade" value={`${agent.upgradeCost} NLT`} />
        <Stat label="Record" value={`${agent.wins}-${agent.losses}`} />
      </div>

      {decision ? (
        <div className="mt-5 rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">AI Recommendation</div>
          <p className="mt-3 font-display text-xl uppercase tracking-[0.16em] text-fog">
            {decision.action} • {decision.score.toFixed(0)}%
          </p>
          <p className="mt-2 text-sm text-fog/70">{decision.reason}</p>
        </div>
      ) : null}

      <AgentActions agentId={agent.agentId} />
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-steel">{label}</div>
      <div className="mt-2 text-sm text-fog">{value}</div>
    </div>
  );
}

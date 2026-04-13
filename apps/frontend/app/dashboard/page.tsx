import { LeaderboardTable } from "@/components/leaderboard-table";
import { MetricCard } from "@/components/metric-card";
import { MintAgentPanel } from "@/components/mint-agent-panel";
import { getOverview } from "@/lib/api";

export default async function DashboardPage() {
  const overview = await getOverview();

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-8">
          <div className="eyebrow">Operations</div>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.18em] text-fog">Command Dashboard</h1>
          <p className="mt-4 max-w-2xl text-fog/70">
            Coordinate your mining fleet, review live telemetry, and connect a wallet to push new agents into the Vein.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Agents" value={String(overview.metrics.activeAgents)} note="Currently tracked cores." />
            <MetricCard label="Pending" value={`${overview.metrics.pendingRewards} NLT`} note="Unclaimed rewards in reserve." />
            <MetricCard label="Mode" value={overview.metrics.mockMode ? "SIM" : "LIVE"} note="Backend data source status." />
          </div>
        </div>

        <MintAgentPanel />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="panel p-8">
          <div className="eyebrow">Agent Feed</div>
          <div className="mt-5 space-y-4">
            {overview.agents.map((agent) => (
              <div key={agent.agentId} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-[0.16em] text-fog">Agent #{agent.agentId}</h3>
                    <p className="mt-1 text-sm text-fog/65">
                      Tier {agent.tier} • Yield {agent.previewMineReward} NLT • Pending {agent.pendingRewards} NLT
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyan/20 bg-cyan/10 px-4 py-3 text-cyan">{agent.energy} energy</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 eyebrow">Leaderboard Snapshot</div>
          <LeaderboardTable entries={overview.leaderboard} />
        </div>
      </section>
    </div>
  );
}

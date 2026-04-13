import { LeaderboardTable } from "@/components/leaderboard-table";
import { getOverview } from "@/lib/api";

export default async function LeaderboardPage() {
  const overview = await getOverview();
  const podium = overview.leaderboard.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="panel p-8">
        <div className="eyebrow">Leaderboard</div>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.18em] text-fog">Control The Deepest Profitable Seam</h1>
        <p className="mt-4 max-w-3xl text-fog/70">
          Ranking is based on total mined value with PvP wins adding pressure. High-output fleets dominate both the economy and the signal layer.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {podium.map((entry) => (
          <div key={entry.agentId} className="panel p-6">
            <div className="eyebrow">Podium #{entry.rank}</div>
            <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.16em] text-fog">Agent #{entry.agentId}</h2>
            <p className="mt-3 text-sm text-fog/70">{entry.totalMined} NLT mined • {entry.wins} wins</p>
            <div className="mt-5 text-4xl font-display uppercase tracking-[0.14em] text-gold">{entry.score}</div>
          </div>
        ))}
      </section>

      <LeaderboardTable entries={overview.leaderboard} />
    </div>
  );
}

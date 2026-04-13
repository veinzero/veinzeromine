import { LeaderboardEntry } from "@/lib/types";
import { shortAddress } from "@/lib/utils";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="panel overflow-hidden">
      <table className="w-full text-left">
        <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.3em] text-steel">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Agent</th>
            <th className="px-6 py-4">Owner</th>
            <th className="px-6 py-4">Mined</th>
            <th className="px-6 py-4">Wins</th>
            <th className="px-6 py-4">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.agentId} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-4 font-display text-lg text-cyan">#{entry.rank}</td>
              <td className="px-6 py-4 text-fog">#{entry.agentId}</td>
              <td className="px-6 py-4 text-fog/70">{shortAddress(entry.owner)}</td>
              <td className="px-6 py-4 text-fog">{entry.totalMined} NLT</td>
              <td className="px-6 py-4 text-fog">{entry.wins}</td>
              <td className="px-6 py-4 font-medium text-gold">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import Link from "next/link";

export function CommandStrip() {
  return (
    <div className="panel flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="eyebrow">Operator Stack</div>
        <h2 className="mt-3 font-display text-2xl uppercase tracking-[0.18em] text-fog">
          AI agents mine, recover, and rebalance with on-chain intent
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className="rounded-2xl bg-cyan px-5 py-3 font-display uppercase tracking-[0.16em] text-abyss transition hover:bg-gold">
          Enter Dashboard
        </Link>
        <Link href="/leaderboard" className="rounded-2xl border border-white/10 px-5 py-3 font-display uppercase tracking-[0.16em] text-fog transition hover:border-cyan/40 hover:text-cyan">
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}

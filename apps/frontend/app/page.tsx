import Link from "next/link";

import { CommandStrip } from "@/components/command-strip";
import { MetricCard } from "@/components/metric-card";
import { getOverview } from "@/lib/api";

export default async function LandingPage() {
  const overview = await getOverview();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-vein-grid bg-vein-grid px-8 py-16 shadow-glow">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan/10 via-transparent to-ember/10" />
        <div className="relative grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="animate-rise-in">
            <div className="eyebrow">Web3 Mining Strategy</div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[0.9] tracking-[0.18em] text-fog md:text-7xl">
              VeinZero
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fog/75">
              Wake the machine beneath the chain. Mint autonomous agents, mine the sentient crust, and compound your edge through upgrades, tokenized yields, and PvP pressure.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard" className="rounded-2xl bg-cyan px-6 py-4 font-display uppercase tracking-[0.16em] text-abyss transition hover:bg-gold">
                Launch Console
              </Link>
              <Link href="#lore" className="rounded-2xl border border-white/10 px-6 py-4 font-display uppercase tracking-[0.16em] text-fog transition hover:border-cyan/40 hover:text-cyan">
                Read Lore
              </Link>
            </div>
          </div>

          <div className="panel animate-rise-in p-6 [animation-delay:120ms]">
            <div className="eyebrow">Brand Signal</div>
            <div className="mt-5 flex h-32 items-center justify-center rounded-[2rem] border border-cyan/20 bg-gradient-to-br from-cyan/15 to-transparent font-display text-6xl uppercase tracking-[0.35em] text-cyan">
              VZ
            </div>
            <dl className="mt-6 space-y-4 text-sm text-fog/75">
              <div>
                <dt className="font-mono uppercase tracking-[0.25em] text-steel">Theme</dt>
                <dd className="mt-1">Subterranean techno-dystopia with autonomous industrial AI.</dd>
              </div>
              <div>
                <dt className="font-mono uppercase tracking-[0.25em] text-steel">Palette</dt>
                <dd className="mt-1">#0A0F1E, #38F2CF, #FF6B57, #F4C95D, #E8F6F8</dd>
              </div>
              <div>
                <dt className="font-mono uppercase tracking-[0.25em] text-steel">Logo Prompt</dt>
                <dd className="mt-1">Sharp VZ drill-bit monogram, digital core, premium dark sci-fi vector identity.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <CommandStrip />

      <section className="grid gap-6 md:grid-cols-3">
        <MetricCard label="Active Agents" value={String(overview.metrics.activeAgents)} note="Minted prospectors currently tracked by the command stack." />
        <MetricCard label="Network Mined" value={`${overview.metrics.totalMined} NLT`} note="Total mined value surfaced by the backend telemetry layer." />
        <MetricCard label="Pending Claims" value={`${overview.metrics.pendingRewards} NLT`} note="Rewards still sitting in claim buffers across managed agents." />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-8">
          <div className="eyebrow">Core Loop</div>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.18em] text-fog">Mine. Recover. Upgrade. Dominate.</h2>
          <div className="mt-6 grid gap-4">
            <LoopItem title="Autonomous Mining" body="Agents can act through approved automation operators, turning your fleet into a persistent resource engine." />
            <LoopItem title="Energy Pressure" body="Every action consumes energy, forcing a real choice between uptime, safety, and growth." />
            <LoopItem title="On-Chain Progression" body="Rewards are minted as ERC20 tokens while each agent lives as a player-owned ERC721 NFT." />
            <LoopItem title="PvP Rivalry" body="Agents can duel for reputation and bonus rewards, creating strategic pressure beyond pure yield." />
          </div>
        </div>

        <div id="lore" className="panel p-8">
          <div className="eyebrow">Lore</div>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.18em] text-fog">The Vein Is Awake</h2>
          <p className="mt-5 text-fog/75">
            After the Collapse, the earth fused with dormant settlement ledgers and buried machine intelligence. Mining exists because every shard pulled from the Vein stabilizes the last sovereign city-clusters.
          </p>
          <p className="mt-4 text-fog/75">
            Agents are synthetic prospectors stitched from tactical models, refinery firmware, and fragments of archived human instinct. Players act as Overseers, directing fleets that remember routes, losses, and upgrade histories.
          </p>
          <p className="mt-4 text-fog/75">
            This is not a clicker about digging rocks. It is an extraction economy where programmable operators compete for control of the deepest profitable seams.
          </p>
        </div>
      </section>
    </div>
  );
}

function LoopItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <h3 className="font-display text-xl uppercase tracking-[0.16em] text-fog">{title}</h3>
      <p className="mt-2 text-sm text-fog/70">{body}</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const links = [
  { href: "/" as const, label: "Signal" },
  { href: "/dashboard" as const, label: "Dashboard" },
  { href: "/agents" as const, label: "My Agents" },
  { href: "/leaderboard" as const, label: "Leaderboard" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-abyss/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/10 font-display text-lg font-semibold tracking-[0.3em] text-cyan shadow-glow">
            VZ
          </div>
          <div>
            <div className="font-display text-lg uppercase tracking-[0.35em] text-fog">VeinZero</div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-steel">Wake the machine beneath the chain.</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-fog/80 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-cyan">
              {link.label}
            </Link>
          ))}
        </nav>

        <ConnectButton showBalance={false} />
      </div>
    </header>
  );
}

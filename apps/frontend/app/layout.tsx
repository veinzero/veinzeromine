import type { Metadata } from "next";
import { IBM_Plex_Mono, Oxanium, Space_Grotesk } from "next/font/google";

import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { Web3Provider } from "@/components/providers/web3-provider";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex"
});

export const metadata: Metadata = {
  title: "VeinZero",
  description: "Autonomous Web3 mining game on Base Sepolia."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${oxanium.variable} ${spaceGrotesk.variable} ${plexMono.variable} font-body`}>
        <Web3Provider>
          <SiteHeader />
          <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}

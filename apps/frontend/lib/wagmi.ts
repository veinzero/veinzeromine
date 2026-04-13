"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defaultChain } from "./contracts";

export const wagmiConfig = getDefaultConfig({
  appName: "VeinZero",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "veinzero-dev-project",
  chains: [defaultChain],
  ssr: true
});

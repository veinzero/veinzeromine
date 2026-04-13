"use client";

import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { gameAddress, veinZeroGameAbi } from "@/lib/contracts";

export function AgentActions({ agentId }: { agentId: number }) {
  const [message, setMessage] = useState<string | null>(null);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  async function runMine() {
    if (!gameAddress) {
      setMessage("Configure the game contract address to enable commands.");
      return;
    }

    setMessage(null);

    try {
      await writeContractAsync({
        address: gameAddress,
        abi: veinZeroGameAbi,
        functionName: "mine",
        args: [BigInt(agentId)]
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    }
  }

  async function runRest() {
    if (!gameAddress) {
      setMessage("Configure the game contract address to enable commands.");
      return;
    }

    setMessage(null);

    try {
      await writeContractAsync({
        address: gameAddress,
        abi: veinZeroGameAbi,
        functionName: "rest",
        args: [BigInt(agentId)]
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    }
  }

  async function runClaim() {
    if (!gameAddress) {
      setMessage("Configure the game contract address to enable commands.");
      return;
    }

    setMessage(null);

    try {
      await writeContractAsync({
        address: gameAddress,
        abi: veinZeroGameAbi,
        functionName: "claimRewards",
        args: [BigInt(agentId)]
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    }
  }

  async function runUpgrade() {
    if (!gameAddress) {
      setMessage("Configure the game contract address to enable commands.");
      return;
    }

    setMessage(null);

    try {
      await writeContractAsync({
        address: gameAddress,
        abi: veinZeroGameAbi,
        functionName: "upgrade",
        args: [BigInt(agentId), 1]
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm font-medium text-cyan transition hover:bg-cyan/20"
          disabled={isPending}
          onClick={runMine}
        >
          Mine
        </button>
        <button
          className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-medium text-gold transition hover:bg-gold/20"
          disabled={isPending}
          onClick={runRest}
        >
          Rest
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-fog transition hover:bg-white/10"
          disabled={isPending}
          onClick={runClaim}
        >
          Claim Rewards
        </button>
        <button
          className="rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm font-medium text-ember transition hover:bg-ember/20"
          disabled={isPending}
          onClick={runUpgrade}
        >
          Upgrade Efficiency
        </button>
      </div>

      {hash ? (
        <p className="text-sm text-fog/70">
          Tx: {hash.slice(0, 10)}...{hash.slice(-6)} {receipt.isSuccess ? "confirmed" : "pending"}
        </p>
      ) : null}

      {message ? <p className="text-sm text-ember">{message}</p> : null}
    </div>
  );
}

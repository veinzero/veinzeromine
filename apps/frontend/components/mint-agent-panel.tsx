"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { gameAddress, veinZeroGameAbi } from "@/lib/contracts";

export function MintAgentPanel() {
  const [metadataUri, setMetadataUri] = useState("ipfs://veinzero/agent-template.json");
  const { data: hash, isPending, writeContract } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });

  return (
    <div className="panel p-6">
      <div className="eyebrow">Mint Agent</div>
      <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.18em] text-fog">Commission a Prospecting Core</h3>
      <p className="mt-3 text-sm text-fog/70">
        Mint a new AI mining agent on-chain. Default mint price is 0.001 ETH on Base Sepolia.
      </p>

      <label className="mt-6 block text-sm text-fog/75">
        Metadata URI
        <input
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-fog outline-none transition focus:border-cyan/60"
          value={metadataUri}
          onChange={(event) => setMetadataUri(event.target.value)}
        />
      </label>

      <button
        className="mt-5 w-full rounded-2xl bg-cyan px-4 py-3 font-display uppercase tracking-[0.18em] text-abyss transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!gameAddress || isPending}
        onClick={() =>
          writeContract({
            address: gameAddress!,
            abi: veinZeroGameAbi,
            functionName: "mintStarterAgent",
            args: [metadataUri],
            value: parseEther("0.001")
          })
        }
      >
        {isPending ? "Minting..." : "Mint Agent"}
      </button>

      {hash ? (
        <p className="mt-4 text-sm text-cyan">
          Submitted: {hash.slice(0, 10)}...{hash.slice(-6)} {receipt.isSuccess ? "confirmed" : "pending"}
        </p>
      ) : null}

      {!gameAddress ? <p className="mt-4 text-sm text-ember">Set `NEXT_PUBLIC_GAME_CONTRACT_ADDRESS` to enable minting.</p> : null}
    </div>
  );
}

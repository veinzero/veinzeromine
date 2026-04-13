import { baseSepolia } from "wagmi/chains";

export const gameAddress = process.env.NEXT_PUBLIC_GAME_CONTRACT_ADDRESS as `0x${string}` | undefined;

export const veinZeroGameAbi = [
  {
    type: "function",
    name: "mintStarterAgent",
    stateMutability: "payable",
    inputs: [{ name: "metadataURI", type: "string" }],
    outputs: [{ name: "agentId", type: "uint256" }]
  },
  {
    type: "function",
    name: "mine",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "rest",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "upgrade",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "path", type: "uint8" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "claimRewards",
    stateMutability: "nonpayable",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: []
  }
] as const;

export const defaultChain = baseSepolia;

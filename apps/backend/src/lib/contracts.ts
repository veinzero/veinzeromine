export const veinZeroGameAbi = [
  {
    type: "function",
    name: "agentStates",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [
      { name: "power", type: "uint32" },
      { name: "efficiency", type: "uint32" },
      { name: "resilience", type: "uint32" },
      { name: "xp", type: "uint32" },
      { name: "energy", type: "uint32" },
      { name: "wins", type: "uint32" },
      { name: "losses", type: "uint32" },
      { name: "tier", type: "uint16" },
      { name: "upgrades", type: "uint16" },
      { name: "lastActionAt", type: "uint64" },
      { name: "pendingRewards", type: "uint256" },
      { name: "totalMined", type: "uint256" },
      { name: "totalClaimed", type: "uint256" }
    ]
  },
  {
    type: "function",
    name: "previewMineReward",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "upgradeCost",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }]
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

export const veinZeroAgentNftAbi = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }]
  }
] as const;

export const veinZeroRewardTokenAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;

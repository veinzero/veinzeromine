# VeinZero

VeinZero is a complete Web3 mining game monorepo built around autonomous AI mining agents, on-chain rewards, NFT-based ownership, and a branded operator console.

## Creative Direction

- **Game title:** VeinZero
- **Tagline:** Wake the machine beneath the chain.
- **Theme:** Subterranean techno-dystopia, machine ecology, on-chain extraction economy
- **Tone:** Dark, futuristic, premium startup energy
- **Logo concept:** A sharp `VZ` monogram shaped like a drill bit descending into a digital core, with subtle circuitry and telemetry cuts
- **Palette:** `#0A0F1E`, `#38F2CF`, `#FF6B57`, `#F4C95D`, `#E8F6F8`
- **Typography:** Oxanium, Space Grotesk, IBM Plex Mono

Extended branding lives in [docs/brand-book.md](/C:/Users/lenovo/OneDrive/Documents/New%20project/docs/brand-book.md).

## Lore

After the Collapse, the planet fused with dormant ledgers and abandoned machine intelligence. The result was the Vein: a living mineral network that transforms heat, memory, and computation into extractable value. Players become Overseers who mint synthetic prospectors, direct their growth, and race rival operators for the deepest profitable seams.

## Core Gameplay

### Main Loop

1. Mint a starter AI mining agent as an ERC721 NFT.
2. Send the agent to mine on-chain and accrue pending ERC20 rewards.
3. Rest strategically to recover energy.
4. Burn reward tokens to upgrade power, efficiency, or resilience.
5. Claim rewards and recycle them into stronger agents.
6. Duel rival agents to improve leaderboard standing.

### Systems

- **Mining:** Explicit on-chain mining actions generate pending `NLT` rewards based on tier, power, and efficiency.
- **Energy:** Mining and duels consume energy; rest and elapsed time restore it.
- **Upgrades:** Players burn reward tokens to improve agent stats and raise tier progression.
- **Leaderboard:** Rankings are derived from mined output and PvP wins.
- **PvP:** Deterministic duels reward stronger agents without relying on weak randomness.
- **AI automation:** Players can authorize an operator wallet to act for their agent automatically.

## Tech Stack

### Frontend

- Next.js 15 App Router
- TailwindCSS
- Wagmi + Viem
- RainbowKit

### Backend

- Node.js
- Fastify
- Viem for chain reads and optional operator writes
- JSON-backed memory store
- Vitest

### Blockchain

- Solidity 0.8.24
- Hardhat
- OpenZeppelin
- Base Sepolia deployment target by default

### AI Agent System

- Modular skills for `mine`, `rest`, and `upgrade`
- Memory store tracking fatigue, ambition, preferred upgrades, and action history
- Decision engine with weighted scoring
- Optional autonomous execution loop through an approved operator wallet

## Monorepo Structure

```text
.
|-- apps
|   |-- backend
|   |   |-- .env.example
|   |   |-- data/agent-memory.json
|   |   |-- src
|   |   |   |-- ai
|   |   |   |   |-- skills
|   |   |   |   |   |-- mine-skill.ts
|   |   |   |   |   |-- rest-skill.ts
|   |   |   |   |   `-- upgrade-skill.ts
|   |   |   |   |-- autonomy-loop.ts
|   |   |   |   |-- decision-engine.ts
|   |   |   |   `-- memory-store.ts
|   |   |   |-- lib
|   |   |   |   |-- chain.ts
|   |   |   |   |-- config.ts
|   |   |   |   |-- contracts.ts
|   |   |   |   |-- mock.ts
|   |   |   |   `-- types.ts
|   |   |   |-- routes
|   |   |   |   |-- agents.ts
|   |   |   |   |-- game.ts
|   |   |   |   `-- health.ts
|   |   |   |-- app.ts
|   |   |   `-- index.ts
|   |   |-- tests
|   |   |   |-- app.test.ts
|   |   |   `-- decision-engine.test.ts
|   |   `-- package.json
|   `-- frontend
|       |-- .env.local.example
|       |-- app
|       |   |-- agents/page.tsx
|       |   |-- dashboard/page.tsx
|       |   |-- leaderboard/page.tsx
|       |   |-- globals.css
|       |   |-- layout.tsx
|       |   `-- page.tsx
|       |-- components
|       |   |-- providers/web3-provider.tsx
|       |   |-- agent-actions.tsx
|       |   |-- agent-card.tsx
|       |   |-- command-strip.tsx
|       |   |-- leaderboard-table.tsx
|       |   |-- metric-card.tsx
|       |   |-- mint-agent-panel.tsx
|       |   `-- site-header.tsx
|       |-- lib
|       |   |-- api.ts
|       |   |-- contracts.ts
|       |   |-- fallback-data.ts
|       |   |-- types.ts
|       |   |-- utils.ts
|       |   `-- wagmi.ts
|       |-- next.config.mjs
|       |-- package.json
|       |-- postcss.config.js
|       |-- tailwind.config.ts
|       `-- tsconfig.json
|-- docs
|   `-- brand-book.md
|-- packages
|   `-- contracts
|       |-- .env.example
|       |-- contracts
|       |   |-- core/VeinZeroGame.sol
|       |   `-- tokens
|       |       |-- VeinZeroAgentNFT.sol
|       |       `-- VeinZeroRewardToken.sol
|       |-- scripts/deploy.ts
|       |-- test/VeinZeroGame.ts
|       |-- hardhat.config.ts
|       `-- package.json
|-- .env.example
|-- package.json
`-- tsconfig.base.json
```

## Smart Contracts

### `VeinZeroRewardToken`

- ERC20 reward token
- Symbol: `NLT`
- Minter role granted to the game contract
- Used for claims and upgrade burns

### `VeinZeroAgentNFT`

- ERC721 agent ownership
- Each minted token represents a player-owned AI miner
- Minting authority granted to the game contract

### `VeinZeroGame`

- Starter minting
- Mining
- Resting
- Upgrades
- Reward claiming
- PvP duels
- Automation operator approvals
- Owner-controlled economy tuning
- Pause support
- Reentrancy protection

## Backend API

### Routes

- `GET /health`
- `GET /api/game/overview`
- `GET /api/game/leaderboard`
- `GET /api/agents/:agentId`
- `GET /api/agents/:agentId/memory`
- `GET /api/agents/:agentId/decision`
- `POST /api/agents/:agentId/actions/execute`

### AI Behavior

- The backend scores three core skills: mine, rest, upgrade.
- A claim action is injected when pending rewards warrant it.
- Memory modifies urgency and preferred upgrade direction.
- If an operator wallet is configured and approved on-chain, the loop can execute the selected action automatically.

## Frontend Pages

- `/` landing page with branding, lore, and loop overview
- `/dashboard` live metrics, mint panel, leaderboard snapshot
- `/agents` fleet registry with AI recommendations and command buttons
- `/leaderboard` standings and podium view

## Environment Setup

### Root

Copy the root env file:

```bash
cp .env.example .env
```

### Contracts

Required values:

- `BASE_SEPOLIA_RPC_URL`
- `PRIVATE_KEY`
- `BASESCAN_API_KEY`
- `TREASURY_ADDRESS`

### Backend

Required values:

- `PORT`
- `API_ORIGIN`
- `GAME_CONTRACT_ADDRESS`
- `TOKEN_CONTRACT_ADDRESS`
- `AGENT_NFT_ADDRESS`

Optional values:

- `BASE_SEPOLIA_RPC_URL`
- `OPERATOR_PRIVATE_KEY`
- `MANAGED_AGENT_IDS`
- `AI_LOOP_INTERVAL_MS`

### Frontend

Required values:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_GAME_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_AGENT_NFT_ADDRESS`

## Local Development

Install dependencies:

```bash
npm install
```

Run contracts:

```bash
npm --workspace packages/contracts run test
```

Run backend:

```bash
npm --workspace apps/backend run dev
```

Run frontend:

```bash
npm --workspace apps/frontend run dev
```

Typecheck:

```bash
npm --workspace apps/backend run typecheck
npm --workspace apps/frontend run typecheck
```

## Deployment

### 1. Deploy Contracts

```bash
npm --workspace packages/contracts run deploy:base-sepolia
```

The script deploys:

1. `VeinZeroRewardToken`
2. `VeinZeroAgentNFT`
3. `VeinZeroGame`
4. Grants token and NFT minting roles to the game contract

### 2. Configure Backend

Deploy `apps/backend` to Railway, Render, Fly.io, or any Node host.

Recommended production environment:

- `PORT=4000`
- `API_ORIGIN=https://your-frontend-domain`
- `BASE_SEPOLIA_RPC_URL=<rpc>`
- `GAME_CONTRACT_ADDRESS=<deployed_game>`
- `TOKEN_CONTRACT_ADDRESS=<deployed_token>`
- `AGENT_NFT_ADDRESS=<deployed_nft>`
- `OPERATOR_PRIVATE_KEY=<optional_automation_wallet>`

### 3. Configure Frontend

Deploy `apps/frontend` to Vercel.

Set:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_GAME_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_AGENT_NFT_ADDRESS`

### 4. Enable Automation

If you want the backend to execute agent actions:

1. Fund the operator wallet with testnet ETH.
2. Set `OPERATOR_PRIVATE_KEY` in the backend.
3. Call `setAutomationOperator(operator, true)` from the player wallet on the `VeinZeroGame` contract.

## Security

- `ReentrancyGuard` on mutable gameplay functions
- `Pausable` emergency stop
- strict mint payment validation
- role-based token and NFT mint permissions
- deterministic PvP, avoiding insecure pseudo-random rewards
- rate limiting on backend endpoints
- zod input validation for backend requests

## Testing Status

### Verified

- Contract tests: `5 passing`
- Backend tests: `4 passing`
- Backend typecheck: passing
- Frontend typecheck: passing
- Frontend production build: passing

### Notes

- RainbowKit can emit optional dependency warnings during build if your WalletConnect project id is not configured yet.
- The sample frontend falls back to mock API data when the backend is unavailable, so the UI still renders in local brand/demo mode.

## Bonus Features Included

- PvP duels
- Autonomous operator approvals
- AI decision engine with memory
- Mock fallback mode for local demos

## Next Extensions

- Agent marketplace using ERC721 listings
- Token staking vaults for boosted reward curves
- Referral and guild systems
- Full on-chain leaderboard snapshots
- Rich metadata hosting on IPFS

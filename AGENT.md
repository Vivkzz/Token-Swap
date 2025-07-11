# Agent Instructions for Token Swap DEX

## Commands
- **Build**: `forge build`
- **Test**: `forge test` (single test: `forge test --match-test TestName`)
- **Format**: `forge fmt`
- **Gas snapshots**: `forge snapshot`
- **Frontend dev**: `cd my-dex-frontend && npm run dev`
- **Frontend build**: `cd my-dex-frontend && npm run build`
- **Frontend lint**: `cd my-dex-frontend && npm run lint`

## Architecture
**Smart Contracts (src/)**: Uniswap V2-style DEX with Factory, Router, Pair, and LPToken contracts. Uses OpenZeppelin for ERC20 functionality.
**Frontend (my-dex-frontend/)**: React + Vite app with ethers.js integration and TailwindCSS styling.
**Deployment**: Foundry scripts in script/ directory for contract deployment.

## Code Style
- **Solidity**: Version 0.8.20, SPDX license headers, OpenZeppelin imports via `@openzeppelin` remapping
- **Frontend**: React functional components, ESLint config, TailwindCSS classes
- **Naming**: camelCase for functions, PascalCase for contracts, descriptive variable names
- **Comments**: Minimal inline comments, focus on clear function/variable names
- **Error handling**: `require()` statements with descriptive messages in contracts

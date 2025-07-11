# WizzSwap DEX Frontend

A modern, Uniswap-inspired decentralized exchange frontend built with Next.js, TypeScript, and wagmi.

## Features

- 🔄 **Token Swapping**: Swap tokens with real-time pricing and slippage protection
- 💧 **Liquidity Management**: Add and remove liquidity from pools
- 🌈 **Wallet Integration**: Connect with multiple wallets via RainbowKit
- 📱 **Responsive Design**: Mobile-friendly interface with smooth animations
- 🎨 **Modern UI**: Clean, intuitive design inspired by Uniswap/PancakeSwap

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **Web3**: wagmi v2, viem, RainbowKit
- **UI Components**: shadcn/ui components, Lucide React icons
- **State Management**: React hooks with wagmi for blockchain state

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure contracts**:
   Update contract addresses in `src/lib/config.ts`:
   ```typescript
   export const CONTRACT_ADDRESSES = {
     FACTORY: '0x...', // Your deployed Factory contract
     ROUTER: '0x...', // Your deployed Router contract
     TOKEN_A: '0x...', // Your deployed TokenA contract
     TOKEN_B: '0x...', // Your deployed TokenB contract
   };
   ```

3. **Get a WalletConnect Project ID**:
   - Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
   - Create a new project
   - Update the `projectId` in `src/lib/config.ts`

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Swap page
│   └── liquidity/      # Liquidity management
├── components/         # React components
│   ├── layout/        # Layout components (Header, etc.)
│   ├── swap/          # Swap interface components
│   ├── liquidity/     # Liquidity management components
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
│   ├── useSwap.ts     # Swap functionality
│   ├── useLiquidity.ts # Liquidity management
│   └── useTokenBalance.ts # Token balance queries
├── lib/               # Utilities and configuration
│   ├── config.ts      # Contract addresses and ABIs
│   └── utils.ts       # Helper functions
└── providers/         # React context providers
    └── wagmi-provider.tsx # Web3 provider setup
```

## Smart Contract Integration

The frontend integrates with your DEX contracts:

- **Factory Contract**: Creates new trading pairs
- **Router Contract**: Handles swaps and liquidity operations
- **Pair Contracts**: Individual liquidity pools
- **ERC20 Tokens**: Token balance and approval management

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (recommended):
   ```bash
   npx vercel
   ```

3. **Or deploy to any static hosting**:
   The built files will be in the `.next` directory.

## Configuration

### Supported Networks

Currently configured for:
- Ethereum Mainnet
- Sepolia Testnet

To add more networks, update the `chains` array in `src/lib/config.ts`.

### Custom Tokens

Add your tokens to the `COMMON_TOKENS` array in `src/components/swap/token-selector.tsx`.

## License

MIT License - see LICENSE file for details.

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'WizzSwap DEX',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID_HERE',
  chains: [sepolia, mainnet],
  ssr: true,
});

export const CONTRACT_ADDRESSES = {
  FACTORY: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x...',
  ROUTER: process.env.NEXT_PUBLIC_ROUTER_ADDRESS || '0x...',
  TOKEN_A: process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS || '0x...',
  TOKEN_B: process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS || '0x...',
} as const;

// Contract ABIs
export const FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "token0", "type": "address"},
      {"internalType": "address", "name": "token1", "type": "address"}
    ],
    "name": "createPair",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "", "type": "address"},
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "getPair",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ROUTER_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"},
      {"internalType": "uint256", "name": "amountA", "type": "uint256"},
      {"internalType": "uint256", "name": "amountB", "type": "uint256"}
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenA", "type": "address"},
      {"internalType": "address", "name": "tokenB", "type": "address"},
      {"internalType": "uint256", "name": "liquidity", "type": "uint256"}
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenIn", "type": "address"},
      {"internalType": "address", "name": "tokenOut", "type": "address"},
      {"internalType": "uint256", "name": "amountIn", "type": "uint256"}
    ],
    "name": "swapExactToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const ERC20_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

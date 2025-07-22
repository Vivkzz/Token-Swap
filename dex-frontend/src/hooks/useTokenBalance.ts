'use client';

import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '@/lib/config';
import { formatBalance, toHex } from '@/lib/utils';

export function useTokenBalance(tokenAddress?: string, userAddress?: string) {
  const { data: balance, isError, isLoading } = useReadContract({
    address: toHex(tokenAddress),
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [toHex(userAddress)!],
    query: {
      enabled: !!tokenAddress && !!userAddress,
    },
  });

  const { data: decimals } = useReadContract({
    address: toHex(tokenAddress),
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: symbol } = useReadContract({
    address: toHex(tokenAddress),
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const formattedBalance = balance && decimals
    ? formatBalance(balance as bigint, decimals as number)
    : '0.00';

  return {
    balance: formattedBalance,
    decimals: decimals as number,
    symbol: symbol as string,
    isError,
    isLoading,
  };
}

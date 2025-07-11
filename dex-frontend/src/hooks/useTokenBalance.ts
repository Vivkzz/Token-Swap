'use client';

import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '@/lib/config';
import { formatBalance } from '@/lib/utils';

export function useTokenBalance(tokenAddress: string, userAddress: string) {
  const { data: balance, isError, isLoading } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
    query: {
      enabled: !!tokenAddress && !!userAddress,
    },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
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

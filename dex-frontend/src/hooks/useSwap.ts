'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ROUTER_ABI, CONTRACT_ADDRESSES } from '@/lib/config';
import { parseUnits } from '@/lib/utils';

export function useSwap() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const swapTokens = async (
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    decimals: number = 18
  ) => {
    try {
      const amount = parseUnits(amountIn, decimals);
      
      writeContract({
        address: CONTRACT_ADDRESSES.ROUTER,
        abi: ROUTER_ABI,
        functionName: 'swapExactToken',
        args: [tokenIn, tokenOut, amount],
      });
    } catch (error) {
      console.error('Swap error:', error);
      throw error;
    }
  };

  return {
    swapTokens,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

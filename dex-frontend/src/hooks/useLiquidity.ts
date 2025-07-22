'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ROUTER_ABI, CONTRACT_ADDRESSES } from '@/lib/config';
import { parseUnits, toHex } from '@/lib/utils';

export function useLiquidity() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const addLiquidity = async (
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string,
    decimals: number = 18
  ) => {
    try {
      const amountABigInt = parseUnits(amountA, decimals);
      const amountBBigInt = parseUnits(amountB, decimals);

      writeContract({
        address: toHex(CONTRACT_ADDRESSES.ROUTER)!,
        abi: ROUTER_ABI,
        functionName: 'addLiquidity',
        args: [toHex(tokenA)!, toHex(tokenB)!, amountABigInt, amountBBigInt],
      });
    } catch (error) {
      console.error('Add liquidity error:', error);
      throw error;
    }
  };

  const removeLiquidity = async (
    tokenA: string,
    tokenB: string,
    liquidity: string,
    decimals: number = 18
  ) => {
    try {
      const liquidityBigInt = parseUnits(liquidity, decimals);

      writeContract({
        address: toHex(CONTRACT_ADDRESSES.ROUTER)!,
        abi: ROUTER_ABI,
        functionName: 'removeLiquidity',
        args: [toHex(tokenA)!, toHex(tokenB)!, liquidityBigInt],
      });
    } catch (error) {
      console.error('Remove liquidity error:', error);
      throw error;
    }
  };

  return {
    addLiquidity,
    removeLiquidity,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

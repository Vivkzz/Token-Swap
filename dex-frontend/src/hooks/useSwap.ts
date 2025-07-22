'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ROUTER_ABI, ERC20_ABI, CONTRACT_ADDRESSES } from '@/lib/config';
import { parseUnits, maxUint256, toHex } from '@/lib/utils';

export function useSwap(
  tokenInAddress?: string,
  amountIn?: string,
  decimals?: number
) {
  const { address } = useAccount();

  // State for the allowance check
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: toHex(tokenInAddress),
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address!, toHex(CONTRACT_ADDRESSES.ROUTER)!],
    query: {
      enabled: !!tokenInAddress && !!address && !!amountIn,
    },
  });

  // Generic transaction state
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const [isApprovalNeeded, setIsApprovalNeeded] = useState(false);

  useEffect(() => {
    if (allowance !== undefined && amountIn && decimals) {
      try {
        const amount = parseUnits(amountIn, decimals);
        setIsApprovalNeeded(allowance < amount);
      } catch {
        // Ignore errors from invalid amountIn strings
        setIsApprovalNeeded(false);
      }
    } else {
      setIsApprovalNeeded(false);
    }
  }, [allowance, amountIn, decimals]);

  // When a transaction (approval) is confirmed, refetch the allowance
  useEffect(() => {
    if (isConfirmed) {
      refetchAllowance();
    }
  }, [isConfirmed, refetchAllowance]);

  const approve = () => {
    if (!tokenInAddress) return;
    writeContract({
      address: toHex(tokenInAddress)!,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [toHex(CONTRACT_ADDRESSES.ROUTER)!, maxUint256],
    });
  };

  const swap = (tokenOutAddress: string) => {
    if (!tokenInAddress || !amountIn || !decimals || !tokenOutAddress) return;
    const amount = parseUnits(amountIn, decimals);
    writeContract({
      address: toHex(CONTRACT_ADDRESSES.ROUTER)!,
      abi: ROUTER_ABI,
      functionName: 'swapExactToken',
      args: [toHex(tokenInAddress)!, toHex(tokenOutAddress)!, amount],
    });
  };

  return {
    approve,
    swap,
    isApprovalNeeded,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    reset,
  };
}


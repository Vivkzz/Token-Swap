'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenSelector } from './token-selector';
import { ArrowDownUp, Settings } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useSwap } from '@/hooks/useSwap';
import { useTokenBalance } from '@/hooks/useTokenBalance';

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
}

export function SwapCard() {
  const { address, isConnected } = useAccount();
  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  const tokenABalance = useTokenBalance(
    tokenA?.address || '',
    address || ''
  );
  
  const tokenBBalance = useTokenBalance(
    tokenB?.address || '',
    address || ''
  );

  const {
    approve,
    swap,
    isApprovalNeeded,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    reset,
  } = useSwap(
    tokenA?.address,
    amountA,
    tokenABalance.decimals
  );

  const handleSwapTokens = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(amountB);
    setAmountB(amountA);
    reset(); // Reset transaction state
  };

  const calculateOutputAmount = (inputAmount: string) => {
    if (!inputAmount || !tokenA || !tokenB) return '0';
    const input = parseFloat(inputAmount);
    const output = input * 0.997 * 1.05; // Mock calculation
    return output.toFixed(6);
  };

  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    if (value && tokenA && tokenB) {
      const calculatedOutput = calculateOutputAmount(value);
      setAmountB(calculatedOutput);
    } else {
      setAmountB('');
    }
    reset(); // Reset transaction state on amount change
  };

  const handleAction = () => {
    if (isApprovalNeeded) {
      approve();
    } else if (tokenB) {
      swap(tokenB.address);
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (!tokenA || !tokenB) return 'Select Tokens';
    if (!amountA) return 'Enter Amount';
    if (isPending) return isApprovalNeeded ? 'Approving...' : 'Confirm in Wallet...';
    if (isConfirming) return 'Swapping...';
    if (isConfirmed) return 'Swap Complete!';
    if (isApprovalNeeded) return `Approve ${tokenA.symbol}`;
    return 'Swap';
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Swap</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Token A Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">From</span>
            {tokenA && (
              <span className="text-sm text-gray-500">
                Balance: {tokenABalance.balance} {tokenA.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0.0"
                value={amountA}
                onChange={(e) => handleAmountAChange(e.target.value)}
                className="text-lg font-medium h-12 border-gray-200"
              />
            </div>
            <TokenSelector
              token={tokenA}
              onTokenSelect={(t) => { setTokenA(t); reset(); }}
              otherToken={tokenB}
            />
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwapTokens}
            className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-50"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Token B Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">To</span>
            {tokenB && (
              <span className="text-sm text-gray-500">
                Balance: {tokenBBalance.balance} {tokenB.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0.0"
                value={amountB}
                readOnly
                className="text-lg font-medium h-12 border-gray-200 bg-gray-50"
              />
            </div>
            <TokenSelector
              token={tokenB}
              onTokenSelect={(t) => { setTokenB(t); reset(); }}
              otherToken={tokenA}
            />
          </div>
        </div>

        {/* Swap Info */}
        {tokenA && tokenB && amountA && amountB && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rate</span>
              <span>1 {tokenA.symbol} = {(parseFloat(amountB) / parseFloat(amountA)).toFixed(4)} {tokenB.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fee</span>
              <span>0.3%</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAction}
          disabled={!isConnected || !tokenA || !tokenB || !amountA || isPending || isConfirming}
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium transition-all"
        >
          {getButtonText()}
        </Button>

        {error && (
          <div className="text-red-500 text-sm text-center pt-2">
            Error: {error.message || 'Transaction failed'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

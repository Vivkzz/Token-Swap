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
  
  const { swapTokens, isPending, isConfirming, isConfirmed, error } = useSwap();
  
  const tokenABalance = useTokenBalance(
    tokenA?.address || '',
    address || ''
  );
  
  const tokenBBalance = useTokenBalance(
    tokenB?.address || '',
    address || ''
  );

  const handleSwapTokens = () => {
    setTokenA(tokenB);
    setTokenB(tokenA);
    setAmountA(amountB);
    setAmountB(amountA);
  };

  // Calculate output amount when input changes
  const calculateOutputAmount = (inputAmount: string) => {
    if (!inputAmount || !tokenA || !tokenB) return '0';
    
    // Simple mock calculation - in real implementation, this would call the contract
    // Using a mock exchange rate of 1:1.05 (slightly favorable)
    const input = parseFloat(inputAmount);
    const output = input * 0.997 * 1.05; // 0.3% fee + 5% favorable rate
    return output.toFixed(6);
  };

  // Update output amount when input amount changes
  const handleAmountAChange = (value: string) => {
    setAmountA(value);
    if (value && tokenA && tokenB) {
      const calculatedOutput = calculateOutputAmount(value);
      setAmountB(calculatedOutput);
    } else {
      setAmountB('');
    }
  };

  const handleSwap = async () => {
    if (!tokenA || !tokenB || !amountA || !isConnected) return;
    
    try {
      await swapTokens(
        tokenA.address,
        tokenB.address,
        amountA,
        tokenABalance.decimals
      );
    } catch (error) {
      console.error('Swap error:', error);
    }
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
              onTokenSelect={setTokenA}
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
                onChange={(e) => setAmountB(e.target.value)}
                className="text-lg font-medium h-12 border-gray-200"
                readOnly
              />
            </div>
            <TokenSelector
              token={tokenB}
              onTokenSelect={setTokenB}
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
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Minimum received</span>
              <span>{(parseFloat(amountB) * 0.995).toFixed(4)} {tokenB.symbol}</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={handleSwap}
          disabled={!tokenA || !tokenB || !amountA || !isConnected || isPending || isConfirming}
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium"
        >
          {!isConnected
            ? 'Connect Wallet'
            : !tokenA || !tokenB
            ? 'Select Tokens'
            : !amountA
            ? 'Enter Amount'
            : isPending
            ? 'Confirm in Wallet...'
            : isConfirming
            ? 'Swapping...'
            : isConfirmed
            ? 'Swap Complete!'
            : 'Swap'}
        </Button>
      </CardContent>
    </Card>
  );
}

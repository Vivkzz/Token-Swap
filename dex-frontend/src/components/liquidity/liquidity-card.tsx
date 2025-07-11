'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TokenSelector } from '@/components/swap/token-selector';
import { Plus, Settings } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useLiquidity } from '@/hooks/useLiquidity';
import { useTokenBalance } from '@/hooks/useTokenBalance';

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
}

export function LiquidityCard() {
  const { address, isConnected } = useAccount();
  const [tokenA, setTokenA] = useState<Token | null>(null);
  const [tokenB, setTokenB] = useState<Token | null>(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  
  const { addLiquidity, removeLiquidity, isPending, isConfirming, isConfirmed, error } = useLiquidity();
  
  const tokenABalance = useTokenBalance(
    tokenA?.address || '',
    address || ''
  );
  
  const tokenBBalance = useTokenBalance(
    tokenB?.address || '',
    address || ''
  );

  const handleAddLiquidity = async () => {
    if (!tokenA || !tokenB || !amountA || !amountB || !isConnected) return;
    
    try {
      await addLiquidity(
        tokenA.address,
        tokenB.address,
        amountA,
        amountB,
        tokenABalance.decimals
      );
    } catch (error) {
      console.error('Add liquidity error:', error);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!tokenA || !tokenB || !amountA || !isConnected) return;
    
    try {
      await removeLiquidity(
        tokenA.address,
        tokenB.address,
        amountA,
        18 // LP token decimals
      );
    } catch (error) {
      console.error('Remove liquidity error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Liquidity</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={mode === 'add' ? 'default' : 'ghost'}
            onClick={() => setMode('add')}
            className="flex-1 h-8"
          >
            Add
          </Button>
          <Button
            variant={mode === 'remove' ? 'default' : 'ghost'}
            onClick={() => setMode('remove')}
            className="flex-1 h-8"
          >
            Remove
          </Button>
        </div>

        {mode === 'add' ? (
          <>
            {/* Token A Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Token A</span>
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
                    onChange={(e) => setAmountA(e.target.value)}
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

            {/* Plus Icon */}
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Token B Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Token B</span>
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
                  />
                </div>
                <TokenSelector
                  token={tokenB}
                  onTokenSelect={setTokenB}
                  otherToken={tokenA}
                />
              </div>
            </div>

            {/* Pool Info */}
            {tokenA && tokenB && amountA && amountB && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pool Share</span>
                  <span>0.01%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{tokenA.symbol} per {tokenB.symbol}</span>
                  <span>1.05</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{tokenB.symbol} per {tokenA.symbol}</span>
                  <span>0.95</span>
                </div>
              </div>
            )}

            {/* Add Liquidity Button */}
            <Button
              onClick={handleAddLiquidity}
              disabled={!tokenA || !tokenB || !amountA || !amountB || !isConnected || isPending || isConfirming}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium"
            >
              {!isConnected
                ? 'Connect Wallet'
                : !tokenA || !tokenB
                ? 'Select Tokens'
                : !amountA || !amountB
                ? 'Enter Amounts'
                : isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                ? 'Adding Liquidity...'
                : isConfirmed
                ? 'Liquidity Added!'
                : 'Add Liquidity'}
            </Button>
          </>
        ) : (
          <>
            {/* Remove Liquidity Mode */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">LP Tokens</span>
                <span className="text-sm text-gray-500">
                  Balance: 0.00 LP
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amountA}
                    onChange={(e) => setAmountA(e.target.value)}
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

            {/* Remove Liquidity Button */}
            <Button
              onClick={handleRemoveLiquidity}
              disabled={!tokenA || !amountA || !isConnected || isPending || isConfirming}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium"
            >
              {!isConnected
                ? 'Connect Wallet'
                : !tokenA
                ? 'Select Pool'
                : !amountA
                ? 'Enter Amount'
                : isPending
                ? 'Confirm in Wallet...'
                : isConfirming
                ? 'Removing Liquidity...'
                : isConfirmed
                ? 'Liquidity Removed!'
                : 'Remove Liquidity'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

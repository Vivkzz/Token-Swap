'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Droplets, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                WizzSwap
              </span>
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeftRight className="w-4 h-4" />
                <span className="font-medium">Swap</span>
              </Link>
              <Link href="/liquidity" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Droplets className="w-4 h-4" />
                <span className="font-medium">Liquidity</span>
              </Link>
              <Link href="/analytics" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

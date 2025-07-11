"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
}

interface TokenSelectorProps {
  token: Token | null;
  onTokenSelect: (token: Token) => void;
  otherToken?: Token | null;
}

const COMMON_TOKENS: Token[] = [
  {
    address: "0x81ffb89db9efc92c76327939c1838fe4cfacf95a",
    symbol: "TokenA",
    name: "Token A",
  },
  {
    address: "0x9eF74098e8e79b013F107d69d5c6105952611459",
    symbol: "TokenB",
    name: "Token B",
  },
  {
    address: "0x3456789012cdef123456789012cdef1234567890",
    symbol: "WIZZ",
    name: "WizzSwap Token",
  },
  {
    address: "0x456789013def123456789013def12345678901a",
    symbol: "WETH",
    name: "Wrapped Ethereum",
  },
  {
    address: "0x56789014ef123456789014ef12345678901ab",
    symbol: "USDC",
    name: "USD Coin",
  },
  {
    address: "0x6789015f123456789015f12345678901abc",
    symbol: "USDT",
    name: "Tether USD",
  },
  {
    address: "0x789016f123456789016f12345678901abcd",
    symbol: "DAI",
    name: "Dai Stablecoin",
  },
];

export function TokenSelector({
  token,
  onTokenSelect,
  otherToken,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = COMMON_TOKENS.filter(
    (t) =>
      t.address !== otherToken?.address &&
      (t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center space-x-2 px-3 py-2 h-12 bg-gray-50 hover:bg-gray-100 border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {token ? (
          <>
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {token.symbol.charAt(0)}
              </span>
            </div>
            <span className="font-medium">{token.symbol}</span>
          </>
        ) : (
          <span className="text-gray-500">Select Token</span>
        )}
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-1 z-50 shadow-xl bg-white border border-gray-200 w-80 max-w-sm min-w-max">
          <CardContent className="p-4 bg-white">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredTokens.map((t) => (
                <button
                  key={t.address}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors bg-white text-gray-900 border border-transparent hover:border-gray-200"
                  onClick={() => {
                    onTokenSelect(t);
                    setIsOpen(false);
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {t.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {t.symbol}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {t.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

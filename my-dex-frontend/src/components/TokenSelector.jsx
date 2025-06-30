import { useState } from "react";
import { TOKENS } from "../tokens";

export default function TokenSelector({ label, value, onChange, variant = "default" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [custom, setCustom] = useState(false);

  const selectedToken = TOKENS.find(token => token.address === value);

  if (variant === "minimal") {
    return (
      <div className="relative z-10"> {/* Added z-10 to ensure dropdown is above other elements */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-xl transition-all"
        >
          <div className="flex items-center space-x-3">
            {selectedToken ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {selectedToken.symbol.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{selectedToken.symbol}</div>
                  <div className="text-xs text-gray-300">{selectedToken.name}</div>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 text-sm">?</div>
                <span className="text-gray-300">Select token</span>
              </>
            )}
          </div>
          <svg style={{ width: '16px', height: '16px' }} className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
            <div className="p-3 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search tokens..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="py-2">
              {TOKENS.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    onChange(token.address);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {token.symbol.charAt(0)}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-white">{token.symbol}</div>
                    <div className="text-xs text-gray-300">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">0.00</div>
                    <div className="text-xs text-gray-400">$0.00</div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  setCustom(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700/50 transition-colors border-t border-gray-700"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-gray-300">Add custom token</span>
              </button>
            </div>
          </div>
        )}

        {custom && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter token address (0x...)"
              className="w-full bg-gray-700 text-white placeholder-gray-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setCustom(false)}
              autoFocus
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative">
        {!custom ? (
          <select
            value={value}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustom(true);
              } else {
                onChange(e.target.value);
              }
            }}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="">Select a token</option>
            {TOKENS.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
            <option value="custom">🔧 Enter custom token</option>
          </select>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter token address (0x...)"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => onChange(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => setCustom(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              ← Back to token list
            </button>
          </div>
        )}
        
        {!custom && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg style={{ width: '16px', height: '16px' }} className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
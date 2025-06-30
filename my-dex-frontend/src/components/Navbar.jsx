import { Link, useLocation } from "react-router-dom";
import { ethers } from "ethers";

export default function Navbar({ account, setAccount }) {
  const location = useLocation();

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">Wizz</span>
              </div>
              <span className="text-white font-bold text-xl tracking-wide">DEX</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-purple-600/20 text-purple-400 border border-purple-600/30" // Active state
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50" // Inactive state
              }`}
            >
              Swap
            </Link>
            <Link
              to="/liquidity"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                location.pathname === "/liquidity"
                  ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                  : "text-gray-300 hover:text-white hover:bg-gray-800/50"}`}
            >
              Liquidity
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center">
            {account ? (
              <div className="bg-gray-800 text-white px-4 py-2 rounded-xl font-mono text-sm">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </div>
            ) : (
              <button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
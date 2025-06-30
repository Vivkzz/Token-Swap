import { useState } from "react";
import { ethers } from "ethers";
import RouterABI from "../abi/Router.json";
import ERC20ABI from "../abi/ERC20.json";
import FactoryABI from "../abi/Factory.json";
import TokenSelector from "../components/TokenSelector";

const ROUTER = import.meta.env.VITE_ROUTER;
const FACTORY = import.meta.env.VITE_FACTORY;

export default function SwapPage() {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSwap() {
    if (!window.ethereum) return alert("Install Metamask!");
    if (!tokenIn || !tokenOut || !amountIn) return alert("Please fill all fields!");

    // Validate ROUTER and FACTORY addresses
    if (!ROUTER || !ethers.isAddress(ROUTER)) {
      console.error("Invalid ROUTER address:", ROUTER);
      alert("Configuration Error: ROUTER address is invalid.");
      return;
    }
    if (!FACTORY || !ethers.isAddress(FACTORY)) {
      console.error("Invalid FACTORY address:", FACTORY);
      alert("Configuration Error: FACTORY address is invalid.");
      return;
    }

    setIsLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const router = new ethers.Contract(ROUTER, RouterABI, signer);
    const factory = new ethers.Contract(FACTORY, FactoryABI, signer);

    const pair = await factory.getPair(tokenIn, tokenOut);
    if (pair === ethers.ZeroAddress) {
      setStatus("❌ Pair not available");
      setIsLoading(false);
      return;
    }

    const token = new ethers.Contract(tokenIn, ERC20ABI, signer);
    const parsedAmount = ethers.parseUnits(amountIn, 18);

    try {
      setStatus("Approving...");
      const tx1 = await token.approve(ROUTER, parsedAmount);
      await tx1.wait();

      setStatus("Swapping...");
      const tx2 = await router.swapExactToken(tokenIn, tokenOut, parsedAmount);
      await tx2.wait();

      setStatus("✅ Swap successful!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error during swap");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 space-y-6 border-2 border-purple-500/20 backdrop-blur-sm" style={{width: "651px"}}>
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Swap Tokens</h2>

        <div className="space-y-5">
          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <label htmlFor="tokenIn" className="block text-sm font-medium text-gray-300 mb-2">From</label>
            <TokenSelector id="tokenIn" value={tokenIn} onChange={setTokenIn} />
            <input
              id="amountIn"
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
            />
          </div>

          <div className="flex justify-center -my-3">
            <button className="p-3 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
            <label htmlFor="tokenOut" className="block text-sm font-medium text-gray-300 mb-2">To</label>
            <TokenSelector id="tokenOut" value={tokenOut} onChange={setTokenOut} />
            <input
              type="text"
              placeholder="0.0"
              value="0.0" // This should be dynamically updated based on swap calculation
              readOnly
              className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white focus:outline-none border border-gray-600"
            />
          </div>

          <button
            onClick={handleSwap}
            disabled={isLoading || !tokenIn || !tokenOut || !amountIn}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? "Processing..." : "Swap"}
          </button>
        </div>

        {status && (
          <p className="mt-6 text-center text-sm text-gray-400">{status}</p>
        )}
      </div>
    </div>
  );
}
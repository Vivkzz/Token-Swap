import { useState } from "react";
import { ethers } from "ethers";
import RouterABI from "../abi/Router.json";
import FactoryABI from "../abi/Factory.json";
import ERC20ABI from "../abi/ERC20.json";
import TokenSelector from "../components/TokenSelector";

const FACTORY = import.meta.env.VITE_FACTORY;
const ROUTER = import.meta.env.VITE_ROUTER;

export default function LiquidityPage() {
  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("add"); // "add" or "remove"

  async function handleLiquidity() {
    if (!window.ethereum) return alert("Install Metamask!");
    if (!tokenIn || !tokenOut || !amountA || !amountB) return alert("Please fill all fields!");
    
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

    const factory = new ethers.Contract(FACTORY, FactoryABI, signer);
    const router = new ethers.Contract(ROUTER, RouterABI, signer);
    const parsedA = ethers.parseUnits(amountA, 18);
    const parsedB = ethers.parseUnits(amountB, 18);

    try {
      let pair = await factory.getPair(tokenIn, tokenOut);
      if (pair === ethers.ZeroAddress) {
        setStatus("Creating pair...");
        const tx = await factory.createPair(tokenIn, tokenOut);
        await tx.wait();
        pair = await factory.getPair(tokenIn, tokenOut);
      }

      const tokenAContract = new ethers.Contract(tokenIn, ERC20ABI, signer);
      const tokenBContract = new ethers.Contract(tokenOut, ERC20ABI, signer);

      setStatus("Approving tokens...");
      const tx1 = await tokenAContract.approve(ROUTER, parsedA);
      const tx2 = await tokenBContract.approve(ROUTER, parsedB);
      await Promise.all([tx1.wait(), tx2.wait()]);

      setStatus("Adding liquidity...");
      const tx3 = await router.addLiquidity(tokenIn, tokenOut, parsedA, parsedB);
      await tx3.wait();

      setStatus("✅ Liquidity added successfully!");
      setAmountA("");
      setAmountB("");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to add liquidity");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-900 rounded-[2.5rem] shadow-2xl p-8 space-y-6 border-2 border-purple-500/20 backdrop-blur-sm" style={{width: "500px"}}>
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">Liquidity</h2>

        <div className="flex bg-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "add" ? "bg-blue-600 text-white shadow-md" : "text-gray-300 hover:text-white"}`}
          >
            Add Liquidity
          </button>
          <button
            onClick={() => setActiveTab("remove")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${activeTab === "remove" ? "bg-blue-600 text-white shadow-md" : "text-gray-300 hover:text-white"}`}
          >
            Remove Liquidity
          </button>
        </div>

        {activeTab === "add" && (
          <div className="space-y-5">
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <label htmlFor="tokenA" className="block text-sm font-medium text-gray-300 mb-2">Token A</label>
              <TokenSelector id="tokenA" value={tokenIn} onChange={setTokenIn} />
              <input
                id="amountA"
                type="number"
                placeholder="0.0"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
            </div>
            <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
              <label htmlFor="tokenB" className="block text-sm font-medium text-gray-300 mb-2">Token B</label>
              <TokenSelector id="tokenB" value={tokenOut} onChange={setTokenOut} />
              <input
                id="amountB"
                type="number"
                placeholder="0.0"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="w-full p-3 mt-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
              />
            </div>
            <button
              onClick={handleLiquidity}
              disabled={isLoading || !tokenIn || !tokenOut || !amountA || !amountB}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Processing..." : "Add Liquidity"}
            </button>
          </div>
        )}

        {activeTab === "remove" && (
          <div className="space-y-5">
            <p className="text-gray-300 text-center">Remove liquidity functionality coming soon.</p>
          </div>
        )}

        {status && (
          <p className="mt-6 text-center text-sm text-gray-400">{status}</p>
        )}
      </div>
    </div>
  );
}
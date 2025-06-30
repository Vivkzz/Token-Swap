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

  async function handleSwap() {
    if (!window.ethereum) return alert("Install Metamask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const router = new ethers.Contract(ROUTER, RouterABI.abi, signer);
    const factory = new ethers.Contract(FACTORY, FactoryABI.abi, signer);

    const pair = await factory.getPair(tokenIn, tokenOut);
    if (pair === ethers.ZeroAddress) {
      return setStatus("❌ Pair not available");
    }

    const token = new ethers.Contract(tokenIn, ERC20ABI.abi, signer);
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
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:bg-black rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-6 text-white flex items-center gap-2">
          <span className="inline-block bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-xl">🔁</span>
          Swap Tokens
        </h2>
        <div className="space-y-4">
          <TokenSelector label="Token In" value={tokenIn} onChange={setTokenIn} />
          <TokenSelector label="Token Out" value={tokenOut} onChange={setTokenOut} />
          <input
            placeholder="Amount to Swap"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button onClick={handleSwap} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition">Swap</button>
        </div>
        <p className="mt-6 text-center text-gray-400 min-h-[24px]">{status}</p>
      </div>
    </div>
  );
}

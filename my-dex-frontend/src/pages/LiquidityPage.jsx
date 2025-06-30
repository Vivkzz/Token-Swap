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

  async function handleLiquidity() {
    if (!window.ethereum) return alert("Install Metamask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const factory = new ethers.Contract(FACTORY, FactoryABI.abi, signer);
    const router = new ethers.Contract(ROUTER, RouterABI.abi, signer);
    const parsedA = ethers.parseUnits(amountA, 18);
    const parsedB = ethers.parseUnits(amountB, 18);

    let pair = await factory.getPair(tokenIn, tokenOut);
    if (pair === ethers.ZeroAddress) {
      setStatus("Creating Pair...");
      const tx = await factory.createPair(tokenIn, tokenOut);
      await tx.wait();
      pair = await factory.getPair(tokenIn, tokenOut);
    }

    const tokenAContract = new ethers.Contract(tokenIn, ERC20ABI.abi, signer);
    const tokenBContract = new ethers.Contract(tokenOut, ERC20ABI.abi, signer);

    try {
      setStatus("Approving tokens...");
      const tx1 = await tokenAContract.approve(ROUTER, parsedA);
      const tx2 = await tokenBContract.approve(ROUTER, parsedB);
      await Promise.all([tx1.wait(), tx2.wait()]);

      setStatus("Adding Liquidity...");
      const tx3 = await router.addLiquidity(tokenIn, tokenOut, parsedA, parsedB);
      await tx3.wait();

      setStatus("✅ Liquidity added!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to add liquidity");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:bg-black rounded-2xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-extrabold mb-6 text-white flex items-center gap-2">
          <span className="inline-block bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-xl">💧</span>
          Add Liquidity
        </h2>
        <div className="space-y-4">
          <TokenSelector label="Token In" value={tokenIn} onChange={setTokenIn} />
          <TokenSelector label="Token Out" value={tokenOut} onChange={setTokenOut} />
          <input
            placeholder="Amount Token A"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            placeholder="Amount Token B"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button onClick={handleLiquidity} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition">Add Liquidity</button>
        </div>
        <p className="mt-6 text-center text-gray-400 min-h-[24px]">{status}</p>
      </div>
    </div>
  );
}

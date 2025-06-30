import { useState } from "react";
import { ethers } from "ethers";
import RouterJSON from "../abi/Router.json";
import ERC20JSON from "../abi/ERC20.json";

const ROUTER = import.meta.env.VITE_ROUTER;
const TOKENA = import.meta.env.VITE_TOKENA;
const TOKENB = import.meta.env.VITE_TOKENB;

const RouterABI = RouterJSON.abi;
const ERC20ABI = ERC20JSON.abi;

export default function Swap({ provider, userAddress }) {
  const [amountIn, setAmountIn] = useState("");
  const [status, setStatus] = useState("");

  async function handleSwap() {
    const signer = await provider.getSigner();

    const tokenIn = new ethers.Contract(TOKENA, ERC20ABI, signer);
    const tokenOut = TOKENB;

    const parsedAmount = ethers.parseUnits(amountIn, 18);
    const router = new ethers.Contract(ROUTER, RouterABI, signer);

    try {
      setStatus("Approving...");
      const tx1 = await tokenIn.approve(ROUTER, parsedAmount);
      await tx1.wait();

      setStatus("Swapping...");
      const tx2 = await router.swapExactToken(TOKENA, tokenOut, parsedAmount);
      await tx2.wait();

      setStatus("✅ Swap complete!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error during swap");
    }
  }

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid gray" }}>
      <h2>🔁 Swap Tokens</h2>

      <input
        placeholder="Amount Token A"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      /><br /><br />

      <button onClick={handleSwap}>Swap TokenA → TokenB</button>

      <p>{status}</p>
    </div>
  );
}

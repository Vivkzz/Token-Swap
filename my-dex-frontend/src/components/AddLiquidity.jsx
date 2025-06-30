import { useState } from "react";
import { ethers } from "ethers";
import RouterABI from "../abi/Router.json";
import ERC20ABI from "../abi/ERC20.json";

const ROUTER = import.meta.env.VITE_ROUTER;
const TOKENA = import.meta.env.VITE_TOKENA;
const TOKENB = import.meta.env.VITE_TOKENB;

export default function AddLiquidity({ provider, userAddress }) {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [status, setStatus] = useState("");

  async function handleAddLiquidity() {
    if (!amountA || !amountB) return alert("Enter both amounts!");

    const signer = await provider.getSigner();

    const tokenA = new ethers.Contract(TOKENA, ERC20ABI, signer);
    const tokenB = new ethers.Contract(TOKENB, ERC20ABI, signer);
    const router = new ethers.Contract(ROUTER, RouterABI, signer);

    const parsedA = ethers.parseUnits(amountA, 18);
    const parsedB = ethers.parseUnits(amountB, 18);

    try {
      setStatus("Approving tokens...");

      const tx1 = await tokenA.approve(ROUTER, parsedA);
      await tx1.wait();

      const tx2 = await tokenB.approve(ROUTER, parsedB);
      await tx2.wait();

      setStatus("Adding liquidity...");

      const tx = await router.addLiquidity(TOKENA, TOKENB, parsedA, parsedB);
      await tx.wait();

      setStatus("✅ Liquidity added!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed. Check console.");
    }
  }

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid gray" }}>
      <h2>🧪 Add Liquidity</h2>

      <input
        placeholder="Amount Token A"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
      /><br /><br />

      <input
        placeholder="Amount Token B"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
      /><br /><br />

      <button onClick={handleAddLiquidity}>Add Liquidity</button>

      <p>{status}</p>
    </div>
  );
}
    
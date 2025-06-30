import { useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import SwapPage from "./pages/SwapPage";
import LiquidityPage from "./pages/LiquidityPage";

export default function App() {
  const [account, setAccount] = useState(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar account={account} setAccount={setAccount} />
      <div className="flex-1 flex flex-col justify-center items-center">
        <Routes>
          <Route path="/" element={<SwapPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
        </Routes>
      </div>
    </div>
  );
}

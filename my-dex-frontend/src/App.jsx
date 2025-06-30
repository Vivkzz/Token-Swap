import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import SwapPage from "./pages/SwapPage";
import LiquidityPage from "./pages/LiquidityPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center">
        <Routes>
          <Route path="/" element={<SwapPage />} />
          <Route path="/liquidity" element={<LiquidityPage />} />
        </Routes>
      </div>
    </div>
  );
}

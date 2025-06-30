import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import ReactDOM from "react-dom/client";
import SwapPage from "./pages/SwapPage";
import LiquidityPage from "./pages/LiquidityPage";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);

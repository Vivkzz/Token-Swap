import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "2rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Swap</Link>
      <Link to="/liquidity">Liquidity</Link>
    </nav>
  );
}

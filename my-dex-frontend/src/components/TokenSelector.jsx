import { useState } from "react";
import { TOKENS } from "../tokens";

export default function TokenSelector({ label, value, onChange }) {
  const [custom, setCustom] = useState(false);

  return (
    <div className="mb-4">
      <label className="block font-semibold">{label}</label>
      {!custom ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a token</option>
          {TOKENS.map((token) => (
            <option key={token.address} value={token.address}>
              {token.symbol} - {token.address.slice(0, 6)}...
            </option>
          ))}
          <option value="custom">🔧 Enter custom token</option>
        </select>
      ) : (
        <input
          type="text"
          placeholder="Enter token address"
          className="w-full p-2 border rounded"
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {value === "custom" && !custom && setCustom(true)}
    </div>
  );
}

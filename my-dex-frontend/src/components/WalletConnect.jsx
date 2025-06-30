import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ setProvider, setAddress }) {
  const [connected, setConnected] = useState(false);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setProvider(provider);
      setAddress(address);
      setConnected(true);
    } else {
      alert("Install Metamask first!");
    }
  }

  return (
    <div className="wallet-connect">
      <button onClick={connectWallet}>
        {connected ? "Wallet Connected ✅" : "Connect Wallet"}
      </button>
    </div>
  );
}
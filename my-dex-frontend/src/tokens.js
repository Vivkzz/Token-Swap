const TOKENA_ADDRESS = import.meta.env.VITE_TOKENA;
const TOKENB_ADDRESS = import.meta.env.VITE_TOKENB;

export const TOKENS = [
  {
    name: "Token A",
    symbol: "TKA",
    address: TOKENA_ADDRESS
  },
  {
    name: "Token B",
    symbol: "TKB",
    address: TOKENB_ADDRESS
  },
    {
    name: "Sepolia ETH",
    symbol: "ETH",
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" // or mock WETH
  },
  {
    name: "Test LINK",
    symbol: "LINK",
    address: "0x1234567890abcdef1234567890abcdef12345678"
  },
  {
    name: "Test DAI",
    symbol: "DAI",
    address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
  },
  // Add other tokens here if needed
];
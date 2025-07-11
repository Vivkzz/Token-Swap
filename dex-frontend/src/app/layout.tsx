import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProviders } from "@/providers/wagmi-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WizzSwap DEX",
  description: "Decentralized Exchange - Swap tokens with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProviders>
          {children}
        </WagmiProviders>
      </body>
    </html>
  );
}

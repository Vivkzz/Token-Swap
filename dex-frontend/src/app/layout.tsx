import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProvidersWrapper } from "@/components/providers-wrapper";

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
        <ProvidersWrapper>
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}

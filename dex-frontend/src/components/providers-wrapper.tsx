'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const WagmiProviders = dynamic(
  () => import('@/providers/wagmi-provider').then((mod) => ({ default: mod.WagmiProviders })),
  { ssr: false }
);

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <WagmiProviders>{children}</WagmiProviders>;
}

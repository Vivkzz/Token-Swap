import { Header } from '@/components/layout/header';
import { SwapCard } from '@/components/swap/swap-card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-violet-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Swap tokens instantly
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trade tokens in an instant with the best rates and lowest fees on WizzSwap DEX
            </p>
          </div>
          
          <div className="flex justify-center">
            <SwapCard />
          </div>
        </div>
      </main>
    </div>
  );
}

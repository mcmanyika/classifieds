import BusinessFilters from '@/components/BusinessFilters';
import MainTabs from '@/components/MainTabs';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full px-4 py-8">
        <header className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            <div className="flex justify-center">
              <Image src="../../images/paysell.png" alt="PaySell" width={180} height={100} />
            </div>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find businesses and professionals across Zimbabwe
          </p>
        </header>
            <MainTabs />
            <Toaster />
      </div>
    </div>
  );
}
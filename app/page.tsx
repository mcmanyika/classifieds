import MainTabs from '@/components/MainTabs';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Texas Directory
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find businesses and people across Texas
          </p>
        </header>
        <MainTabs />
        <Toaster />
      </div>
    </div>
  );
}
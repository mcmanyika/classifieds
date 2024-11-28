'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PricingPlan from "@/components/pricing/PricingPlan";

export default function PricingPage() {
  const router = useRouter();

  // Add this function to handle navigation
  const handleBackToSearch = () => {
    router.push('/');
  };


  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Add Back to Search button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToSearch}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        </div>

        {/* Rest of your existing JSX */}
        <PricingPlan />
      </div>
    </div>
  );
}

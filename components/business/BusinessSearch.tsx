'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from 'sonner';
import { BusinessCard } from "./BusinessCard";
import { Business } from "@/types/business";
import { searchBusinesses } from "@/lib/api/business";

export default function BusinessSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchBusinesses(searchTerm);
      setBusinesses(results);
      
      if (results.length === 0) {
        toast.info("No results found", {
          description: "Try adjusting your search terms"
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch businesses. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Search businesses in Texas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="grid gap-4">
        {businesses.map((business, index) => (
          <BusinessCard key={business.placeId || index} business={business} />
        ))}
      </div>
    </div>
  );
}
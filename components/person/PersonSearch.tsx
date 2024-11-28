'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from 'sonner';
import { PersonCard } from "./PersonCard";
import { Person } from "@/types/person";
import { searchPerson } from "@/lib/api/person";

export default function PersonSearch() {
  const [name, setName] = useState('');
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const result = await searchPerson(name);
      setPerson(result);
      
      if (!result) {
        toast.info("No results found", {
          description: "No person found with that name"
        });
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to fetch person details. Please try again."
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
          placeholder="Enter person's name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading || !name.trim()}>
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {person && <PersonCard person={person} />}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Phone, User } from "lucide-react";
import { toast } from 'sonner';

interface Person {
  name: string;
  phone: string;
}

export default function PersonSearch() {
  const [name, setName] = useState('');
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock database of people
      const mockDatabase: Person[] = [
        { name: "Easy Larry", phone: "(512) 555-1234" },
        { name: "Sarah Johnson", phone: "(512) 555-5678" },
        { name: "Michael Brown", phone: "(512) 555-9012" },
        { name: "Emily Davis", phone: "(512) 555-3456" },
        { name: "David Wilson", phone: "(512) 555-7890" }
      ];

      // Simple search logic
      const searchResult = mockDatabase.find(
        person => person.name.toLowerCase().includes(name.toLowerCase())
      );

      if (searchResult) {
        setPerson(searchResult);
      } else {
        // If no exact match, create a new mock person
        const mockPerson: Person = {
          name: name,
          phone: "(512) 555-" + Math.floor(1000 + Math.random() * 9000)
        };
        setPerson(mockPerson);
      }
      
      toast.success("Person found!");
    } catch (error) {
      toast.error("Failed to fetch person details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input
          placeholder="Enter person's name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading || !name.trim()}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {person && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-semibold">{person.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                  <p className="font-semibold">{person.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
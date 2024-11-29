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
  profession?: string;
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
        { name: "Easy Larry", phone: "(512) 555-1234", profession: "Sales Rep" },
        { name: "Partson", phone: "(512) 555-5678", profession: "Software Engineer" },
        { name: "Micah", phone: "(512) 555-9012", profession: "Web Developer" },
        { name: "Betty", phone: "(512) 555-3456", profession: "Sales" },
        { name: "David Wilson", phone: "(512) 555-7890", profession: "Lawyer" }
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
          phone: "(512) 555-" + Math.floor(1000 + Math.random() * 9000),
          profession: "Unknown"
        };
        setPerson(mockPerson);
      }
      
    } catch (error) {
      toast.error("Failed to fetch person details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-4"
      >
        <Input
          placeholder="Enter person's name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || !name.trim()}>
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      {person && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-semibold">{person.name}</p>
                  {person.profession && (
                    <p className="text-sm text-gray-500">{person.profession}</p>
                  )}
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
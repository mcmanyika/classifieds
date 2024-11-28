'use client';

import { Card, CardContent } from "@/components/ui/card";
import { User, Phone } from "lucide-react";
import { Person } from "@/types/person";

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
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
  );
}
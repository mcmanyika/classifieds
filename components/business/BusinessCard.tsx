'use client';

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { Business } from "@/types/business";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {business.address}
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {business.phone}
              </p>
              {business.rating > 0 && (
                <p className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  {business.rating.toFixed(1)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Clock className={`w-4 h-4 mr-2 ${business.openNow ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm ${business.openNow ? 'text-green-500' : 'text-red-500'}`}>
              {business.openNow ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
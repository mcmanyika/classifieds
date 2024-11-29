'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, User } from "lucide-react";
import BusinessSearch from "./BusinessSearch";
import PersonSearch from "./PersonSearch";

export default function MainTabs() {
  return (
    <Tabs defaultValue="business" className="w-full">
      <TabsList className="grid max-w-3xl mx-auto grid-cols-2 mb-20">
        <TabsTrigger value="business" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Businesses
        </TabsTrigger>
        <TabsTrigger value="person" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Professionals
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="business">
        <BusinessSearch />
      </TabsContent>
      
      <TabsContent value="person">
        <PersonSearch />
      </TabsContent>
    </Tabs>
  );
}
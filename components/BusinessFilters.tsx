import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface BusinessFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
}

export interface FilterState {
  categories: string[];
  hasWebsite: boolean;
  hasPhone: boolean;
  hasImage: boolean;
}

export default function BusinessFilters({ onFilterChange, totalResults }: BusinessFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    hasWebsite: false,
    hasPhone: false,
    hasImage: false,
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const commonCategories = [
    'restaurant',
    'store',
    'shopping',
    'food',
    'cafe',
    'bar',
    'Finance',
    'hotel',
    'health',
    'beauty',
    'fitness'
  ];

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleFilter = (key: keyof FilterState) => {
    if (key === 'categories') return;
    
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      hasWebsite: false,
      hasPhone: false,
      hasImage: false,
    });
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold">Filters</h3>
          <p className="text-sm text-gray-500">{totalResults} results</p>
        </div>
        <div className="flex gap-2">
          {(filters.categories.length > 0 || filters.hasWebsite || filters.hasPhone || filters.hasImage) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X className="h-4 w-4" /> : "Show Filters"}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {commonCategories.map(category => (
                <Button
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Additional Filters</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.hasWebsite ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter('hasWebsite')}
              >
                Has Website
              </Button>
              <Button
                variant={filters.hasPhone ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter('hasPhone')}
              >
                Has Phone
              </Button>
              <Button
                variant={filters.hasImage ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter('hasImage')}
              >
                Has Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 
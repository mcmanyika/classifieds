'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Phone, Clock, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BusinessFilters from './BusinessFilters';

interface Business {
  name: string;
  address: string;
  phone: string;
  rating: number;
  userRatingsTotal: number;
  openNow: boolean;
  types: string[];
  placeId: string;
  photoUrl?: string;
  website?: string;
}

interface Suggestion {
  description: string;
  placeId: string;
}

interface FilterState {
  categories: string[];
  hasWebsite: boolean;
  hasPhone: boolean;
  hasImage: boolean;
}

// Add this helper function at the top of your component
const normalizeString = (str: string): string => {
  return str.toLowerCase().replace(/_/g, '').replace(/\s+/g, '');
};

export default function BusinessSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const router = useRouter();
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    categories: [],
    hasWebsite: false,
    hasPhone: false,
    hasImage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Add this helper function at the top of your component
  const formatWebsiteUrl = (url: string): string | null => {
    try {
      // Add https if no protocol is specified
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      const urlObject = new URL(urlWithProtocol);
      return urlObject.hostname;
    } catch (error) {
      console.error('Invalid URL:', url);
      return null;
    }
  };

  // Function to fetch businesses with pagination
  const fetchBusinesses = (service: google.maps.places.PlacesService, query: string, newSearch: boolean = false) => {
    // Update location context for Zimbabwe
    const searchQuery = `${query.trim()} in Zimbabwe`;
    
    const request: google.maps.places.TextSearchRequest = {
      query: searchQuery,
      region: 'ZW', // Zimbabwe region code
      location: new google.maps.LatLng(-17.8292, 31.0522), // Harare coordinates
      radius: 500000 // 500km radius to cover Zimbabwe
    };

    // Only add pageToken if this is a pagination request
    if (!newSearch && pageToken) {
      (request as any).pageToken = pageToken;
    }

    setLoading(true);

    service.textSearch(request, (results, status, pagination) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const formattedResults: Business[] = results.map(place => ({
          placeId: place.place_id || '',
          name: place.name || 'Unknown',
          address: place.formatted_address || 'No address available',
          phone: 'Fetching...',
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          openNow: place.opening_hours?.isOpen() || false,
          types: place.types || [],
          website: 'Fetching...'
        }));

        // Update businesses based on whether this is a new search or pagination
        setAllBusinesses(prev => newSearch ? formattedResults : [...prev, ...formattedResults]);

        // Update pagination state
        if (pagination?.hasNextPage) {
          pagination.nextPage!(); // This will trigger the next page token to be generated
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
          setPageToken(null);
        }

        // Fetch additional details
        formattedResults.forEach((_, index) => {
          if (results[index].place_id) {
            service.getDetails(
              {
                placeId: results[index].place_id!,
                fields: ['formatted_phone_number', 'opening_hours', 'photos', 'website']
              },
              (placeDetails, detailStatus) => {
                if (detailStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                  setAllBusinesses(prev => {
                    const updated = [...prev];
                    const businessIndex = newSearch ? index : prev.length - formattedResults.length + index;
                    
                    if (businessIndex >= 0 && businessIndex < updated.length) {
                      updated[businessIndex] = {
                        ...updated[businessIndex],
                        phone: placeDetails.formatted_phone_number || 'No phone available',
                        openNow: placeDetails.opening_hours?.isOpen() || false,
                        photoUrl: placeDetails.photos?.[0]?.getUrl({ maxWidth: 300, maxHeight: 200 }),
                        website: placeDetails.website || 'No website available'
                      };
                    }
                    return updated;
                  });
                }
              }
            );
          }
        });
      } else {
        toast.error(newSearch ? "No results found" : "Failed to load more results");
        setHasNextPage(false);
        setPageToken(null);
      }
      setLoading(false);
    });
  };

  // Add this effect to handle pagination token updates
  useEffect(() => {
    const handlePageTokenUpdate = () => {
      if (placesService) {
        const nextPage = (placesService as any).getNextPage?.();
        const token = nextPage?.toString();
        setPageToken(token || null);
      }
    };

    // Add event listener for page token updates
    if (placesService) {
      google.maps.event.addListener(placesService, 'page_changed', handlePageTokenUpdate);
    }

    return () => {
      if (placesService) {
        google.maps.event.clearListeners(placesService, 'page_changed');
      }
    };
  }, [placesService]);

  // Initialize Places service and Autocomplete
  useEffect(() => {
    const initializeServices = () => {
      if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
        try {
          // Initialize Places Service
          const mapDiv = document.createElement('div');
          const map = new window.google.maps.Map(mapDiv, {
            center: { lat: -17.8292, lng: 31.0522 }, // Harare coordinates
            zoom: 7,
          });
          const service = new window.google.maps.places.PlacesService(map);
          setPlacesService(service);

          // Initialize Autocomplete
          if (inputRef.current && !autoCompleteRef.current) {
            autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
              componentRestrictions: { country: 'zw' },
              fields: ['formatted_address', 'geometry', 'name', 'place_id'],
              bounds: {
                north: -15.6088,
                south: -22.4241,
                east: 33.0563,
                west: 25.2373
              },
              strictBounds: true
            });

            autoCompleteRef.current.addListener('place_changed', () => {
              const place = autoCompleteRef.current?.getPlace();
              if (place?.name) {
                setSearchTerm(place.name);
                setShowSuggestions(false);
                handleSearch();
              }
            });
          }

          // Initialize Autocomplete Service
          autocompleteService.current = new google.maps.places.AutocompleteService();
          
          // Fetch initial results
          fetchBusinesses(service, 'businesses in Zimbabwe', true);
        } catch (error) {
          console.error("Error initializing services:", error);
          toast.error("Failed to initialize search services");
        }
      } else {
        console.log("Google Maps not yet loaded, retrying...");
        setTimeout(initializeServices, 500);
      }
    };

    initializeServices();

    return () => {
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
      setPlacesService(null);
      autoCompleteRef.current = null;
      autocompleteService.current = null;
    };
  }, []);

  // Update filter handler to use normalizeString
  const handleFilterChange = useCallback((filters: FilterState) => {
    setCurrentFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
    
    const filtered = allBusinesses.filter(business => {
      // Check categories
      if (filters.categories.length > 0) {
        const businessTypes = business.types?.map(type => normalizeString(type)) || [];
        const normalizedCategories = filters.categories.map(cat => normalizeString(cat));
        
        if (!normalizedCategories.some(category => 
          businessTypes.some(type => type.includes(category))
        )) {
          return false;
        }
      }

      // Check website
      if (filters.hasWebsite) {
        if (!business.website || business.website === 'No website available') {
          return false;
        }
      }

      // Check phone
      if (filters.hasPhone) {
        if (!business.phone || business.phone === 'No phone available') {
          return false;
        }
      }

      // Check image
      if (filters.hasImage) {
        if (!business.photoUrl) {
          return false;
        }
      }

      return true;
    });

    setFilteredBusinesses(filtered);
  }, [allBusinesses]);

  // Apply filters whenever allBusinesses changes
  useEffect(() => {
    handleFilterChange(currentFilters);
  }, [allBusinesses, handleFilterChange, currentFilters]);

  const handleSearch = async () => {
    if (!placesService || !searchTerm.trim()) {
      return;
    }
    
    setAllBusinesses([]); // Clear all businesses on new search
    setFilteredBusinesses([]);
    setPageToken(null); // Reset pagination
    setHasNextPage(false);
    setCurrentPage(1); // Reset to first page
    
    try {
      fetchBusinesses(placesService, searchTerm, true);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search businesses");
      setLoading(false);
    }
  };

  // Handle clicks outside of search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'zw' },
          types: ['establishment'],
          locationBias: {
            center: { lat: -17.8292, lng: 31.0522 }, // Harare center
            radius: 500000 // 500km radius
          } as google.maps.places.LocationBias
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            const formattedSuggestions = predictions.map(prediction => ({
              description: prediction.description,
              placeId: prediction.place_id
            }));
            setSuggestions(formattedSuggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchTerm(suggestion.description);
    setShowSuggestions(false);
    handleSearch();
  };

  // Helper function to filter and format categories
  function filterAndFormatCategories(types: string[]): string[] {
    const excludedTypes = [
      'point_of_interest',
      'establishment',
      'place',
      'business'
    ];
    
    return types
      .filter(type => !excludedTypes.includes(type))
      .map(type => 
        type
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      );
  }

  // Handle business card click
  const handleBusinessClick = (placeId: string) => {
    router.push(`/business/${placeId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className='w-1/4'>
          {/* Add filters */}
      {allBusinesses.length > 0 && (
        <BusinessFilters 
          onFilterChange={handleFilterChange}
          totalResults={filteredBusinesses.length}
        />
      )}
</div>
<div className='w-2/4 space-y-6'>
<div ref={searchRef} className="relative">
        <div className="flex gap-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-4 w-full">
            <Input
              ref={inputRef}
              placeholder="Search businesses"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !searchTerm.trim()}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.placeId}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{suggestion.description}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      {/* Results */}
      <div className="grid gap-4">
        {filteredBusinesses
          .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
          .map((business, index) => (
            <Card 
              key={`${business.placeId}-${index}`}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleBusinessClick(business.placeId)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  
                  <div className="flex justify-between gap-6">
                    <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{business.name}</h3>

                    {business.types && filterAndFormatCategories(business.types).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {filterAndFormatCategories(business.types).map((type, typeIndex) => (
                          <span
                            key={typeIndex}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-300 capitalize"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {business.address}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {business.phone}
                        </p>
                        {business.website && business.website !== 'No website available' && (
                          <p className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            <a 
                              href={business.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {formatWebsiteUrl(business.website) || business.website}
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-yellow-400 dark:text-yellow-300">
                      {business.rating > 0 && (
                        <>
                          <span className="font-medium">{business.rating.toFixed(1)}</span>
                          <span>({business.userRatingsTotal.toLocaleString()} reviews)</span>
                        </>
                      )}
                    </div>
                    </div>
                    
                    {business.photoUrl && (
                      <div className="relative w-[200px] h-[150px] flex-shrink-0">
                        <Image
                          src={business.photoUrl}
                          alt={business.name}
                          fill
                          className="rounded-lg object-cover"
                          priority
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Pagination Controls */}
      {filteredBusinesses.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-3 py-1 text-sm">
            Page {currentPage} of {Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)))}
            disabled={currentPage === Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE)}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Load More button - only show when on the last page */}
      {hasNextPage && !loading && filteredBusinesses.length > 0 && 
        currentPage === Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE) && (
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              if (searchTerm.trim()) {
                fetchBusinesses(placesService!, searchTerm, false);
              } else {
                fetchBusinesses(placesService!, 'businesses in Zimbabwe', false);
              }
            }}
            disabled={loading}
            className="px-4 py-2"
          >
            Load More
          </Button>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

</div>
      </div>
      
    </div>
  );
}

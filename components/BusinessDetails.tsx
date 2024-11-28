'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, Clock, Star, ArrowLeft, Globe, ExternalLink, ChevronRight, ThumbsUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

interface Review {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  profile_photo_url: string;
}

interface Business {
  name: string;
  address: string;
  phone: string;
  rating: number;
  openNow: boolean;
  types: string[];
  location?: google.maps.LatLngLiteral;
  website?: string;
  photos?: string[];
  openingHours?: string[];
  reviews?: Review[];
  user_ratings_total?: number;
}

// Helper function to filter and format categories
function filterAndFormatCategories(types: string[]): string[] {
  const excludedTypes = [
    'point_of_interest',
    'establishment',
    'food',
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

export default function BusinessDetails({ id }: { id: string }) {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);

  useEffect(() => {
    const fetchBusinessDetails = () => {
      if (typeof window !== 'undefined' && window.google) {
        const mapDiv = document.createElement('div');
        const map = new window.google.maps.Map(mapDiv);
        const service = new window.google.maps.places.PlacesService(map);

        service.getDetails(
          {
            placeId: id,
            fields: [
              'name',
              'formatted_address',
              'formatted_phone_number',
              'rating',
              'opening_hours',
              'types',
              'geometry',
              'website',
              'photos',
              'reviews',
              'user_ratings_total'
            ]
          },
          async (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              // Handle photos
              const photoUrls = place.photos 
                ? await Promise.all(
                    place.photos.slice(0, 5).map(photo => {
                      return new Promise<string>((resolve) => {
                        resolve(photo.getUrl({ maxWidth: 800, maxHeight: 600 }));
                      });
                    })
                  )
                : [];

              setBusiness({
                name: place.name || 'Unknown',
                address: place.formatted_address || 'No address available',
                phone: place.formatted_phone_number || 'No phone available',
                rating: place.rating || 0,
                openNow: place.opening_hours?.isOpen() || false,
                types: place.types || [],
                location: place.geometry?.location?.toJSON(),
                website: place.website,
                openingHours: place.opening_hours?.weekday_text,
                photos: photoUrls,
                reviews: place.reviews || [],
                user_ratings_total: place.user_ratings_total
              });
            }
            setLoading(false);
          }
        );
      }
    };

    fetchBusinessDetails();
  }, [id]);

  // Initialize map when business data is available
  useEffect(() => {
    if (!business?.location || !mapRef.current) return;

    const mapOptions: google.maps.MapOptions = {
      center: business.location,
      zoom: 15,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    };

    // Create new map
    const map = new google.maps.Map(mapRef.current, mapOptions);
    googleMapRef.current = map;

    // Add marker
    const marker = new google.maps.Marker({
      position: business.location,
      map: map,
      title: business.name,
      animation: google.maps.Animation.DROP
    });
    markerRef.current = marker;

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold">${business.name}</h3>
          <p class="text-sm">${business.address}</p>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Clean up
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [business?.location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <div className="text-center text-gray-600 dark:text-gray-400">
          Business not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Search
      </Button>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{business?.name}</h1>

        {/* Photos Gallery */}
        {business?.photos && business.photos.length > 0 && (
          <div className="space-y-2">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src={business.photos[selectedPhoto]}
                alt={`${business.name} photo ${selectedPhoto + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {business.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {business.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhoto(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden 
                      ${selectedPhoto === index ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <Image
                      src={photo}
                      alt={`${business.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {business?.types && filterAndFormatCategories(business.types).map((type, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300"
            >
              {type}
            </span>
          ))}
        </div>

        {/* Map */}
        <div 
          ref={mapRef} 
          className="w-full h-[300px] rounded-lg overflow-hidden shadow-lg"
        />

        {/* Details */}
        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <MapPin className="w-5 h-5" />
            <span>{business?.address}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Phone className="w-5 h-5" />
            <span>{business?.phone}</span>
          </div>

          {business?.website && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Globe className="w-5 h-5" />
              <a 
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 flex items-center gap-1 transition-colors"
              >
                Visit Website
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}


          {business?.rating && business.rating > 0 && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>{business.rating.toFixed(1)} / 5</span>
            </div>
          )}

          {/* Opening Hours */}
          {business?.openingHours && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">Opening Hours</span>
              </div>
              <div className="ml-8 space-y-1">
                {business.openingHours.map((hours, index) => (
                  <div 
                    key={index}
                    className={`text-sm ${
                      hours.toLowerCase().includes(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())
                      ? 'text-blue-500 font-medium'
                      : 'text-gray-600 dark:text-gray-300'
                    }`}
                    style={{
                      display: 'inline-block',
                      width: '33%'
                    }}
                  >
                    {hours}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Optional: Add a direct action button */}
        {business?.website && (
          <Button 
            className="w-full"
            onClick={() => window.open(business.website, '_blank')}
          >
            <Globe className="w-4 h-4 mr-2" />
            Visit Official Website
          </Button>
        )}

        {business?.reviews && business.reviews.length > 0 && (
          <div className="space-y-6">
            {/* Reviews Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                Reviews ({business.user_ratings_total})
              </h2>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{business.rating?.toFixed(1)}</span>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid gap-6">
              {business.reviews.map((review, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-4"
                >
                  {/* Review Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {review.profile_photo_url ? (
                        <Image
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{review.author_name}</p>
                        <p className="text-sm text-gray-500">{review.relative_time_description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{review.rating}</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 dark:text-gray-300">
                    {review.text}
                  </p>

                  {/* Review Actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
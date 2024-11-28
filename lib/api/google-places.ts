import { GOOGLE_MAPS_API_KEY } from '@/lib/utils';
import { Business } from '@/types/business';

export async function searchPlaces(query: string): Promise<Business[]> {
  try {
    const response = await fetch(
      `/api/places/search?query=${encodeURIComponent(query + ' Texas')}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching places:', error);
    throw error;
  }
}

export async function getPlaceDetails(placeId: string): Promise<Business> {
  try {
    const response = await fetch(`/api/places/details?placeId=${placeId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch place details');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
}
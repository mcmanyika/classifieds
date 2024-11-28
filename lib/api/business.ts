import { searchPlaces, getPlaceDetails } from './google-places';
import { Business } from '@/types/business';

export async function searchBusinesses(query: string): Promise<Business[]> {
  try {
    const places = await searchPlaces(query);
    return places;
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
}

export async function getBusinessDetails(placeId: string): Promise<Business> {
  try {
    const details = await getPlaceDetails(placeId);
    return details;
  } catch (error) {
    console.error('Error fetching business details:', error);
    throw error;
  }
}
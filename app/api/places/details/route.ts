import { NextResponse } from 'next/server';
import { GOOGLE_MAPS_API_KEY } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,rating,opening_hours&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Google Places API');
    }

    const data = await response.json();
    const place = data.result;

    const result = {
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || 'N/A',
      rating: place.rating || 0,
      openNow: place.opening_hours?.open_now || false,
      placeId: place.place_id
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
  }
}
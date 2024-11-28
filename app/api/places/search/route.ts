import { NextResponse } from 'next/server';
import { GOOGLE_MAPS_API_KEY } from '@/lib/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Google Places API');
    }

    const data = await response.json();
    
    const results = data.results.map((place: any) => ({
      name: place.name,
      address: place.formatted_address,
      phone: place.formatted_phone_number || 'N/A',
      rating: place.rating || 0,
      openNow: place.opening_hours?.open_now || false,
      placeId: place.place_id
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}
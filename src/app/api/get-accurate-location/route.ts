import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Google API key is not configured.' }, { status: 500 });
  }

  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // You can pass wifiAccessPoints and other data here for better accuracy
      // For this implementation, we rely on Google's default server-side detection
      body: JSON.stringify({ considerIp: true }),
    });

    const data: any = await response.json();

    if (data.error) {
      console.error('Geolocation API Error:', data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: data.error.code || 500 });
    }

    return NextResponse.json({
      location: data.location,
      accuracy: data.accuracy,
    });
  } catch (error: any) {
    console.error('Failed to call Geolocation API:', error);
    return NextResponse.json({ error: 'Failed to communicate with Google Geolocation service.' }, { status: 500 });
  }
}

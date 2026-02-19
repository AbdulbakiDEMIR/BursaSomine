import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'tr';

    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const PLACE_ID = process.env.GOOGLE_PLACE_ID; // Place ID Finder'dan aldığın kod

    if (!API_KEY || !PLACE_ID) {
        return NextResponse.json({ error: 'API Key or Place ID missing' }, { status: 500 });
    }

    // Google Places API URL'i (Sadece yorumları ve yazarları çeker)
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}&language=${lang}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== 'OK') {
            console.error('Google Places API Error:', data.status, data.error_message);
            return NextResponse.json({ error: data.status, message: data.error_message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: data.result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
import { fetchNearbyMosquesOverpass } from '../lib/apiUtils';

export interface Mosque {
  id: number;
  lat: number;
  lon: number;
  name: string;
  distance?: number;
}

export async function findNearbyMosques(lat: number, lng: number, radius: number = 5000): Promise<Mosque[]> {
  const query = `[out:json];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
  relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
);
out center;`;

  try {
    const data = await fetchNearbyMosquesOverpass(query);
    return data.elements.map((el: any) => ({
      id: el.id,
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      name: el.tags?.name || 'Masjid / Surau',
    })).sort((a: any, b: any) => {
      const distA = calculateDistance(lat, lng, a.lat, a.lon);
      const distB = calculateDistance(lat, lng, b.lat, b.lon);
      a.distance = distA;
      b.distance = distB;
      return distA - distB;
    });
  } catch (error) {
    console.error('Mosque search error:', error);
    return [];
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

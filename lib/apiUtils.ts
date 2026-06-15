export const isNative = typeof window !== 'undefined' && 
  (window.location.origin.startsWith('capacitor://') || 
   window.location.origin.startsWith('http://localhost') && !window.location.origin.includes(':3000') && !window.location.origin.includes(':3001') ||
   (window as any).Capacitor !== undefined);

export function getQuranUrl(path: string): string {
  if (isNative) {
    return `https://api.alquran.cloud/v1${path}`;
  }
  return `/api/proxy/quran${path}`;
}

export function getHadisUrl(path: string): string {
  if (isNative) {
    let normalizedPath = path;
    if ((normalizedPath.includes('list') || normalizedPath.includes('one')) && !normalizedPath.endsWith('/')) {
      normalizedPath += '/';
    }
    return `https://hadeethenc.com/api/v1${normalizedPath}`;
  }
  return `/api/proxy/hadis${path}`;
}

export function getSolatTimesUrl(zone: string): string {
  if (isNative) {
    return `https://api.waktusolat.app/v2/solat/${zone}`;
  }
  return `/api/proxy/solat/${zone}`;
}

export async function fetchZoneFromCoords(lat: number, lng: number): Promise<string | null> {
  if (isNative) {
    const urls = [
      `https://api.azanpro.com/zone/locate?lat=${lat}&lon=${lng}`,
      `https://mpt.i906.my/mpt/prayer/coordinate?lat=${lat}&lng=${lng}`,
      `https://mpt.i906.my/api/prayer/coordinate?lat=${lat}&lng=${lng}`,
      `https://mpt.i906.my/prayer/coordinate?lat=${lat}&lng=${lng}`
    ];

    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          let zone = null;
          if (data.zone) {
            zone = data.zone;
          } else if (data.data?.zone) {
            zone = data.data.zone;
          } else if (data.code) {
            zone = data.code;
          }

          if (zone && typeof zone === 'string') {
            return zone;
          }
        }
      } catch (error) {
        console.warn(`Direct zone API failed: ${url}`, error);
      }
    }
    return null;
  } else {
    try {
      const response = await fetch(`/api/proxy/zone?lat=${lat}&lng=${lng}`);
      if (response.ok) {
        const data = await response.json();
        return data?.zone || null;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }
}

export async function fetchNearbyMosquesOverpass(query: string): Promise<any> {
  if (isNative) {
    const endpoints = [
      'https://overpass-api.de/api/interpreter',
      'https://lz4.overpass-api.de/api/interpreter',
      'https://z.overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter'
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(url, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0'
          },
          body: `data=${encodeURIComponent(query)}`
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn(`Direct Overpass API failed: ${url}`, error);
      }
    }
    throw new Error("All Overpass endpoints failed or timed out");
  } else {
    const response = await fetch('/api/proxy/overpass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: query }),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch from Overpass proxy');
    }
    return await response.json();
  }
}

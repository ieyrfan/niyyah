import { SolatData, PrayerTime } from '../types';
import { format } from 'date-fns';
import { ms, enUS } from 'date-fns/locale';
import { getSolatTimesUrl, fetchZoneFromCoords } from '../lib/apiUtils';

export const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 
  'Perlis', 'Pulau Pinang', 'Perak', 'Sabah', 'Selangor', 'Sarawak', 
  'Terengganu', 'Wilayah Persekutuan'
];

export const ZONES: Record<string, string> = {
  // Johor
  'JHR01': 'Johor (Pulau Aur dan Pulau Pemanggil)',
  'JHR02': 'Johor (Johor Bahru, Kota Tinggi, Mersing)',
  'JHR03': 'Johor (Kluang, Pontian)',
  'JHR04': 'Johor (Batu Pahat, Muar, Segamat, Gemas Johor)',
  // Kedah
  'KDH01': 'Kedah (Kota Setar, Kubang Pasu, Pokok Sena (Pulau Pinang))',
  'KDH02': 'Kedah (Kuala Muda, Yan, Pendang)',
  'KDH03': 'Kedah (Padang Terap, Sik)',
  'KDH04': 'Kedah (Baling)',
  'KDH05': 'Kedah (Bandar Bahru, Kulim)',
  'KDH06': 'Kedah (Langkawi)',
  'KDH07': 'Kedah (Puncak Gunung Jerai)',
  // Kelantan
  'KTN01': 'Kelantan (Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku)',
  'KTN02': 'Kelantan (Gua Musang (Bertam Baru, Galas, Pulai), Jeli)',
  // Melaka
  'MLK01': 'Melaka (Seluruh Negeri Melaka)',
  // Negeri Sembilan
  'NSN01': 'Negeri Sembilan (Tampin, Jempol)',
  'NSN02': 'Negeri Sembilan (Jelebu, Kuala Pilah, Rembau)',
  'NSN03': 'Negeri Sembilan (Port Dickson, Seremban)',
  // Pahang
  'PHG01': 'Pahang (Pulau Tioman)',
  'PHG02': 'Pahang (Kuantan, Pekan, Rompin, Muadzam Shah)',
  'PHG03': 'Pahang (Maran, Chenor, Temerloh, Bera, Jerantut)',
  'PHG04': 'Pahang (Bentong, Raub, Lipis)',
  'PHG05': 'Pahang (Genting Sempah, Janda Baik, Bukit Tinggi)',
  'PHG06': 'Pahang (Cameron Highlands, Genting Higlands, Bukit Fraser)',
  // Perlis
  'PLS01': 'Perlis (Seluruh Negeri Perlis)',
  // Pulau Pinang
  'PNG01': 'Pulau Pinang (Seluruh Negeri Pulau Pinang)',
  // Perak
  'PRK01': 'Perak (Tapah, Slim River, Tanjung Malim)',
  'PRK02': 'Perak (Kuala Kangsar, Sg. Siput (Depan), Ipoh, Batu Gajah, Kampar)',
  'PRK03': 'Perak (Lenggong, Pengkalan Hulu, Grik)',
  'PRK04': 'Perak (Temengor, Belum)',
  'PRK05': 'Perak (Parit Buntar, Bagan Serai, Larut, Matang, Selama)',
  'PRK06': 'Perak (Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor)',
  'PRK07': 'Perak (Teluk Intan, Bagan Datuk, Kampung Gajah, Seri Iskandar)',
  // Sabah
  'SBH01': 'Sabah (Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanong, Tambisan, Bandar Sandakan)',
  'SBH02': 'Sabah (Bahagian Sandakan (Barat), Pinangah, Terusan, Beluran, Telupid, Ulu Sapi)',
  'SBH03': 'Sabah (Bahagian Tawau (Timur), Lahad Datu, Kunak, Silabukan, Tungku, Sahabat, Semporna)',
  'SBH04': 'Sabah (Bahagian Tawau (Barat), Bandar Tawau, Balung, Merotai, Kalabakan)',
  'SBH05': 'Sabah (Bahagian Kudat, Kudat, Kota Marudu, Pitas, Pulau Banggi)',
  'SBH06': 'Sabah (Gunung Kinabalu)',
  'SBH07': 'Sabah (Bahagian Pantai Barat, Kota Kinabalu, Penampang, Tuaran, Ranau, Kota Belud, Putatan, Papar)',
  'SBH08': 'Sabah (Bahagian Pedalaman (Atas), Pensiangan, Keningau, Tambunan, Nabawan)',
  'SBH09': 'Sabah (Bahagian Pedalaman (Bawah), Sipitang, Membakut, Beaufort, Kuala Penyu, Weston, Tenom, Long Pa Sia)',
  // Selangor
  'SGR01': 'Selangor (Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam)',
  'SGR02': 'Selangor (Sabak Bernam, Kuala Selangor)',
  'SGR03': 'Selangor (Klang, Kuala Langat)',
  // Sarawak
  'SWK01': 'Sarawak (Limbang, Lawas, Sundar, Trusan)',
  'SWK02': 'Sarawak (Miri, Niah, Bekenu, Sibuti, Marudi)',
  'SWK03': 'Sarawak (Pandan, Beluru, Suai, Niah, Sibuti, Marudi, Tatau, Bintulu)',
  'SWK04': 'Sarawak (Sibu, Mukah, Dalat, Oya, Igan, Kanowit, Kapit, Belaga)',
  'SWK05': 'Sarawak (Sarikei, Matu, Julau, Bintangor, Nyabor, Rajang, Daro)',
  'SWK06': 'Sarawak (Lubok Antu, Sri Aman, Roban, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok)',
  'SWK07': 'Sarawak (Serian, Simunjan, Samarahan, Sebuyau, Meludam)',
  'SWK08': 'Sarawak (Kuching, Bau, Lundu, Sematan)',
  'SWK09': 'Sarawak (Zon Khas (Kampung its Telok Melano))',
  // Terengganu
  'TRG01': 'Terengganu (Kuala Terengganu, Marang, Kuala Nerus)',
  'TRG02': 'Terengganu (Besut, Setiu)',
  'TRG03': 'Terengganu (Hulu Terengganu)',
  'TRG04': 'Terengganu (Dungun, Kemaman)',
  // Wilayah Persekutuan
  'WLY01': 'Wilayah Persekutuan (Kuala Lumpur, Putrajaya)',
  'WLY02': 'Wilayah Persekutuan (Labuan)',
};

export const ZONES_BY_STATE: Record<string, { code: string, name: string }[]> = {
  'Johor': [
    { code: 'JHR01', name: 'Pulau Aur dan Pulau Pemanggil' },
    { code: 'JHR02', name: 'Johor Bahru, Kota Tinggi, Mersing' },
    { code: 'JHR03', name: 'Kluang, Pontian' },
    { code: 'JHR04', name: 'Batu Pahat, Muar, Segamat, Gemas Johor' },
  ],
  'Kedah': [
    { code: 'KDH01', name: 'Kota Setar, Kubang Pasu, Pokok Sena (Pulau Pinang)' },
    { code: 'KDH02', name: 'Kuala Muda, Yan, Pendang' },
    { code: 'KDH03', name: 'Padang Terap, Sik' },
    { code: 'KDH04', name: 'Baling' },
    { code: 'KDH05', name: 'Bandar Bahru, Kulim' },
    { code: 'KDH06', name: 'Langkawi' },
    { code: 'KDH07', name: 'Puncak Gunung Jerai' },
  ],
  'Kelantan': [
    { code: 'KTN01', name: 'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku' },
    { code: 'KTN02', name: 'Gua Musang (Bertam Baru, Galas, Pulai), Jeli' },
  ],
  'Melaka': [
    { code: 'MLK01', name: 'Seluruh Negeri Melaka' },
  ],
  'Negeri Sembilan': [
    { code: 'NSN01', name: 'Tampin, Jempol' },
    { code: 'NSN02', name: 'Jelebu, Kuala Pilah, Rembau' },
    { code: 'NSN03', name: 'Port Dickson, Seremban' },
  ],
  'Pahang': [
    { code: 'PHG01', name: 'Pulau Tioman' },
    { code: 'PHG02', name: 'Kuantan, Pekan, Rompin, Muadzam Shah' },
    { code: 'PHG03', name: 'Maran, Chenor, Temerloh, Bera, Jerantut' },
    { code: 'PHG04', name: 'Bentong, Raub, Lipis' },
    { code: 'PHG05', name: 'Genting Sempah, Janda Baik, Bukit Tinggi' },
    { code: 'PHG06', name: 'Cameron Highlands, Genting Higlands, Bukit Fraser' },
  ],
  'Perlis': [
    { code: 'PLS01', name: 'Seluruh Negeri Perlis' },
  ],
  'Pulau Pinang': [
    { code: 'PNG01', name: 'Seluruh Negeri Pulau Pinang' },
  ],
  'Perak': [
    { code: 'PRK01', name: 'Tapah, Slim River, Tanjung Malim' },
    { code: 'PRK02', name: 'Kuala Kangsar, Sg. Siput (Depan), Ipoh, Batu Gajah, Kampar' },
    { code: 'PRK03', name: 'Lenggong, Pengkalan Hulu, Grik' },
    { code: 'PRK04', name: 'Temengor, Belum' },
    { code: 'PRK05', name: 'Parit Buntar, Bagan Serai, Larut, Matang, Selama' },
    { code: 'PRK06', name: 'Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor' },
    { code: 'PRK07', name: 'Teluk Intan, Bagan Datuk, Kampung Gajah, Seri Iskandar' },
  ],
  'Sabah': [
    { code: 'SBH01', name: 'Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanong, Tambisan, Bandar Sandakan' },
    { code: 'SBH02', name: 'Bahagian Sandakan (Barat), Pinangah, Terusan, Beluran, Telupid, Ulu Sapi' },
    { code: 'SBH03', name: 'Bahagian Tawau (Timur), Lahad Datu, Kunak, Silabukan, Tungku, Sahabat, Semporna' },
    { code: 'SBH04', name: 'Bahagian Tawau (Barat), Bandar Tawau, Balung, Merotai, Kalabakan' },
    { code: 'SBH05', name: 'Bahagian Kudat, Kudat, Kota Marudu, Pitas, Pulau Banggi' },
    { code: 'SBH06', name: 'Gunung Kinabalu' },
    { code: 'SBH07', name: 'Bahagian Pantai Barat, Kota Kinabalu, Penampang, Tuaran, Ranau, Kota Belud, Putatan, Papar' },
    { code: 'SBH08', name: 'Bahagian Pedalaman (Atas), Pensiangan, Keningau, Tambunan, Nabawan' },
    { code: 'SBH09', name: 'Bahagian Pedalaman (Bawah), Sipitang, Membakut, Beaufort, Kuala Penyu, Weston, Tenom, Long Pa Sia' },
  ],
  'Selangor': [
    { code: 'SGR01', name: 'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, S.Alam' },
    { code: 'SGR02', name: 'Sabak Bernam, Kuala Selangor' },
    { code: 'SGR03', name: 'Klang, Kuala Langat' },
  ],
  'Sarawak': [
    { code: 'SWK01', name: 'Limbang, Lawas, Sundar, Trusan' },
    { code: 'SWK02', name: 'Miri, Niah, Bekenu, Sibuti, Marudi' },
    { code: 'SWK03', name: 'Pandan, Beluru, Suai, Niah, Sibuti, Marudi, Tatau, Bintulu' },
    { code: 'SWK04', name: 'Sibu, Mukah, Dalat, Oya, Igan, Kanowit, Kapit, Belaga' },
    { code: 'SWK05', name: 'Sarikei, Matu, Julau, Bintangor, Nyabor, Rajang, Daro' },
    { code: 'SWK06', name: 'Lubok Antu, Sri Aman, Roban, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok' },
    { code: 'SWK07', name: 'Serian, Simunjan, Samarahan, Sebuyau, Meludam' },
    { code: 'SWK08', name: 'Kuching, Bau, Lundu, Sematan' },
    { code: 'SWK09', name: 'Zon Khas (Kampung its Telok Melano)' },
  ],
  'Terengganu': [
    { code: 'TRG01', name: 'Kuala Terengganu, Marang, Kuala Nerus' },
    { code: 'TRG02', name: 'Besut, Setiu' },
    { code: 'TRG03', name: 'Hulu Terengganu' },
    { code: 'TRG04', name: 'Dungun, Kemaman' },
  ],
  'Wilayah Persekutuan': [
    { code: 'WLY01', name: 'Kuala Lumpur, Putrajaya' },
    { code: 'WLY02', name: 'Labuan' },
  ],
};

export async function getZoneByCoords(lat: number, lng: number): Promise<string> {
  const ZONE_CENTERS: Record<string, { lat: number, lng: number }> = {
    'WLY01': { lat: 3.1390, lng: 101.6869 }, // KL
    'WLY02': { lat: 5.2831, lng: 115.2308 }, // Labuan
    'SGR01': { lat: 3.0738, lng: 101.5183 }, // Shah Alam
    'SGR02': { lat: 3.7686, lng: 100.9851 }, // Sabak Bernam
    'SGR03': { lat: 2.9443, lng: 101.4452 }, // Klang
    'JHR01': { lat: 2.4501, lng: 104.5167 }, // Pulau Aur
    'JHR02': { lat: 1.4854, lng: 103.7618 }, // Johor Bahru
    'JHR03': { lat: 2.0305, lng: 103.3182 }, // Kluang
    'JHR04': { lat: 1.8548, lng: 102.9325 }, // Batu Pahat
    'MLK01': { lat: 2.1896, lng: 102.2501 }, // Melaka
    'NSN01': { lat: 2.4722, lng: 102.2355 }, // Tampin
    'NSN02': { lat: 2.68, lng: 102.24 },     // Jelebu
    'NSN03': { lat: 2.7258, lng: 101.9424 }, // Seremban
    'PHG01': { lat: 2.8167, lng: 104.1667 }, // Tioman
    'PHG02': { lat: 3.8126, lng: 103.3256 }, // Kuantan
    'PHG03': { lat: 3.48, lng: 102.42 },     // Temerloh
    'PHG04': { lat: 3.35, lng: 101.9167 },   // Bentong
    'PHG05': { lat: 3.37, lng: 101.76 },     // Genting Sempah
    'PHG06': { lat: 4.4722, lng: 101.3814 }, // Cameron
    'PRK01': { lat: 3.92, lng: 101.35 },     // Tapah
    'PRK02': { lat: 4.5921, lng: 101.0901 }, // Ipoh
    'PRK03': { lat: 5.11, lng: 101.12 },     // Gerik
    'PRK05': { lat: 5.0747, lng: 100.4191 }, // Parit Buntar
    'PRK06': { lat: 4.22, lng: 100.65 },     // Lumut
    'PRK07': { lat: 4.02, lng: 101.02 },     // Teluk Intan
    'PNG01': { lat: 5.4141, lng: 100.3288 }, // Penang
    'KDH01': { lat: 6.1254, lng: 100.3614 }, // Alor Setar
    'KDH02': { lat: 5.64, lng: 100.48 },     // Sungai Petani
    'KDH04': { lat: 5.67, lng: 100.91 },     // Baling
    'KDH05': { lat: 5.22, lng: 100.56 },     // Kulim
    'KDH06': { lat: 6.35, lng: 99.8 },       // Langkawi
    'PLS01': { lat: 6.4449, lng: 100.2048 }, // Perlis
    'KTN01': { lat: 6.1254, lng: 102.2386 }, // KB
    'KTN02': { lat: 4.88, lng: 101.96 },     // Gua Musang
    'TRG01': { lat: 5.3302, lng: 103.1324 }, // TGG
    'TRG02': { lat: 5.76, lng: 102.55 },     // Besut
    'TRG03': { lat: 5.06, lng: 103.01 },     // Hulu Terengganu
    'TRG04': { lat: 4.75, lng: 103.41 },     // Kemaman
    'SBH01': { lat: 5.8394, lng: 118.1172 }, // Sandakan
    'SBH02': { lat: 5.25, lng: 117.15 },     // Beluran
    'SBH03': { lat: 5.0307, lng: 118.3251 }, // Lahad Datu
    'SBH04': { lat: 4.2442, lng: 117.8912 }, // Tawau
    'SBH05': { lat: 6.89, lng: 116.82 },     // Kudat
    'SBH06': { lat: 6.02, lng: 116.55 },     // Ranau
    'SBH07': { lat: 5.9804, lng: 116.0735 }, // KK
    'SBH08': { lat: 5.33, lng: 116.14 },     // Keningau
    'SBH09': { lat: 5.01, lng: 115.55 },     // Beaufort
    'SWK01': { lat: 4.75, lng: 115.0 },      // Limbang
    'SWK02': { lat: 4.3995, lng: 113.9914 }, // Miri
    'SWK03': { lat: 3.16, lng: 113.04 },     // Bintulu
    'SWK04': { lat: 2.2878, lng: 111.8305 }, // Sibu
    'SWK05': { lat: 2.12, lng: 111.51 },     // Sarikei
    'SWK06': { lat: 1.23, lng: 111.45 },     // Sri Aman
    'SWK07': { lat: 1.13, lng: 110.63 },     // Serian
    'SWK08': { lat: 1.5533, lng: 110.3592 }, // Kuching
    'SWK09': { lat: 2.02, lng: 109.65 },     // Telok Melano
  };

  const getFallbackByDistance = (la: number, ln: number) => {
    let nearestZone = 'WLY01';
    let minDistance = Infinity;

    const toRad = (v: number) => v * Math.PI / 180;
    const R = 6371; // km

    for (const [zone, center] of Object.entries(ZONE_CENTERS)) {
      const dLat = toRad(center.lat - la);
      const dLon = toRad(center.lng - ln);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(la)) * Math.cos(toRad(center.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = zone;
      }
    }
    return nearestZone;
  };

  try {
    const zone = await fetchZoneFromCoords(lat, lng);
    if (zone) {
      return zone;
    }
    return getFallbackByDistance(lat, lng);
  } catch (error) {
    console.error('Error getting zone by coords:', error);
    return getFallbackByDistance(lat, lng);
  }
}

export async function fetchFullSolatTimes(zone: string = 'WLY01', language: string = 'ms'): Promise<any[]> {
  try {
    const dateLocale = language === 'ms' ? ms : enUS;
    // Attempt to fetch monthly schedule for the current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    // Use helper to bypass CORS / support native
    const response = await fetch(getSolatTimesUrl(zone));
    if (!response.ok) throw new Error('Proxy API Error');
    const data = await response.json();
    
    if (!data.prayers) return [];

    const monthNum = String(data.month_number).padStart(2, '0');
    const yearNum = data.year;

    // Helper to format Unix timestamp (seconds) to HH:mm
    const formatTime = (timestamp: number) => {
      if (!timestamp) return '--:--';
      const date = new Date(timestamp * 1000);
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };

    return data.prayers.map((p: any) => {
      const dayNum = String(p.day).padStart(2, '0');
      const dateStr = `${yearNum}-${monthNum}-${dayNum}`;
      
      return {
        date: dateStr,
        dayName: format(new Date(dateStr), 'EEEE', { locale: dateLocale }),
        hijri: p.hijri,
        imsak: formatTime(p.imsak),
        fajr: formatTime(p.fajr),
        syuruk: formatTime(p.syuruk),
        dhuhr: formatTime(p.dhuhr),
        asr: formatTime(p.asr),
        maghrib: formatTime(p.maghrib),
        isya: formatTime(p.isha) // Note: API returned 'isha', mapping to 'isya' for local usage
      };
    });
  } catch (error) {
    console.error('Error fetching full solat times:', error);
    return [];
  }
}

export async function fetchSolatTimes(zone: string = 'WLY01', language: string = 'ms'): Promise<SolatData> {
  try {
    const dateLocale = language === 'ms' ? ms : enUS;
    // Use helper to bypass CORS / support native
    const response = await fetch(getSolatTimesUrl(zone));
    if (!response.ok) throw new Error('Proxy API Error');
    const data = await response.json();
    
    // api.waktusolat.app returns an array of dates. We find the one that matches today's date in local time
    const now = new Date();
    // Use local date string YYYY-MM-DD instead of UTC to avoid date mismatch
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    
    const monthNum = String(data.month_number).padStart(2, '0');
    const yearNum = data.year;

    // The API prayers list uses 'day' as a number. We need to find the one matching today's day
    const dayInt = now.getDate();
    const todayData = data.prayers.find((p: any) => p.day === dayInt) || data.prayers[0];
    
    // Helper to format Unix timestamp (seconds) to HH:mm
    const formatTime = (timestamp: number) => {
      if (!timestamp) return '--:--';
      const date = new Date(timestamp * 1000);
      const h = String(date.getHours()).padStart(2, '0');
      const m = String(date.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    };
    
    return {
      date: todayStr,
      hijri: todayData.hijri,
      day: format(now, 'EEEE', { locale: dateLocale }),
      zone: ZONES[zone] || zone,
      prayerTimes: {
        fajr: formatTime(todayData.fajr),
        syuruk: formatTime(todayData.syuruk),
        dhuhr: formatTime(todayData.dhuhr),
        asr: formatTime(todayData.asr),
        maghrib: formatTime(todayData.maghrib),
        isha: formatTime(todayData.isha) // Fix: API uses 'isha'
      }
    };
  } catch (error) {
    console.error('Error fetching solat times:', error);
    // Return fallback data if API fails
    return {
      date: new Date().toISOString().split('T')[0],
      hijri: '12 Ramadhan 1445',
      day: 'Khamis',
      zone: ZONES[zone] || zone,
      prayerTimes: {
        fajr: '05:50',
        syuruk: '07:10',
        dhuhr: '13:15',
        asr: '16:30',
        maghrib: '19:25',
        isha: '20:35'
      }
    };
  }
}

export function getNearestPrayer(prayerTimes: PrayerTime, baseDate?: Date) {
  const now = baseDate || new Date();
  const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const schedule = [
    { name: 'Subuh', id: 'fajr', time: prayerTimes.fajr },
    { name: 'Syuruk', id: 'syuruk', time: prayerTimes.syuruk },
    { name: 'Zohor', id: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asar', id: 'asr', time: prayerTimes.asr },
    { name: 'Maghrib', id: 'maghrib', time: prayerTimes.maghrib },
    { name: 'Isyak', id: 'isha', time: prayerTimes.isha },
  ];

  let nearest = null;
  let minDiff = Infinity;

  for (const prayer of schedule) {
    if (!prayer.time) continue;
    const [h, m] = prayer.time.split(':').map(Number);
    const prayerTotalSeconds = h * 3600 + m * 60;
    const diffSeconds = Math.abs(currentTotalSeconds - prayerTotalSeconds);

    if (diffSeconds < minDiff) {
      minDiff = diffSeconds;
      nearest = { 
        ...prayer, 
        diff: Math.floor((prayerTotalSeconds - currentTotalSeconds) / 60),
        diffSeconds: (prayerTotalSeconds - currentTotalSeconds) % 60,
        totalDiffSeconds: prayerTotalSeconds - currentTotalSeconds,
        isPast: prayerTotalSeconds < currentTotalSeconds
      };
    }
  }

  // Check against Fajr tomorrow
  if (schedule[0].time) {
    const [fh, fm] = schedule[0].time.split(':').map(Number);
    const fajrTotalSecondsTomorrow = (24 * 3600) + fh * 3600 + fm * 60;
    const diffSeconds = Math.abs(fajrTotalSecondsTomorrow - currentTotalSeconds);
    if (diffSeconds < minDiff) {
      nearest = { 
        ...schedule[0], 
        diff: Math.floor((fajrTotalSecondsTomorrow - currentTotalSeconds) / 60),
        diffSeconds: (fajrTotalSecondsTomorrow - currentTotalSeconds) % 60,
        totalDiffSeconds: fajrTotalSecondsTomorrow - currentTotalSeconds,
        isPast: false
      };
    }
  }

  return nearest;
}

export function getNextPrayer(prayerTimes: PrayerTime, baseDate?: Date) {
  const now = baseDate || new Date();
  const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const schedule = [
    { name: 'Subuh', id: 'fajr', time: prayerTimes.fajr },
    { name: 'Syuruk', id: 'syuruk', time: prayerTimes.syuruk },
    { name: 'Zohor', id: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asar', id: 'asr', time: prayerTimes.asr },
    { name: 'Maghrib', id: 'maghrib', time: prayerTimes.maghrib },
    { name: 'Isyak', id: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of schedule) {
    if (!prayer.time) continue;
    const [h, m] = prayer.time.split(':').map(Number);
    const prayerTotalSeconds = h * 3600 + m * 60;
    if (prayerTotalSeconds > currentTotalSeconds) {
      const diffSeconds = prayerTotalSeconds - currentTotalSeconds;
      return { 
        ...prayer, 
        diff: Math.floor(diffSeconds / 60),
        diffSeconds: diffSeconds % 60,
        totalDiffSeconds: diffSeconds
      };
    }
  }

  // If all prayers today passed, next is Fajr tomorrow
  if (schedule[0].time) {
    const [fh, fm] = schedule[0].time.split(':').map(Number);
    const fajrTotalSecondsTomorrow = (24 * 3600) + fh * 3600 + fm * 60;
    const diffSeconds = fajrTotalSecondsTomorrow - currentTotalSeconds;
    return { 
      ...schedule[0], 
      diff: Math.floor(diffSeconds / 60),
      diffSeconds: diffSeconds % 60,
      totalDiffSeconds: diffSeconds
    };
  }

  return null;
}

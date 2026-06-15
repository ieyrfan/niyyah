import { Surah, Ayah } from '../types';
import { getQuranUrl } from '../lib/apiUtils';

export async function fetchSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(getQuranUrl('/surah'));
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
}

export async function fetchSurahDetail(number: number, edition: string = 'ar.alafasy'): Promise<{ ayahs: Ayah[], surah: Surah }> {
  try {
    // Fetch Arabic text, BM translation, EN translation, Transliteration, and Audio in parallel
    const [arRes, msRes, enRes, audioRes, transRes] = await Promise.all([
      fetch(getQuranUrl(`/surah/${number}/quran-uthmani`)),
      fetch(getQuranUrl(`/surah/${number}/ms.basmeih`)),
      fetch(getQuranUrl(`/surah/${number}/en.sahih`)),
      fetch(getQuranUrl(`/surah/${number}/${edition}`)),
      fetch(getQuranUrl(`/surah/${number}/en.transliteration`))
    ]);
    
    const arData = await arRes.json();
    const msData = await msRes.json();
    const enData = await enRes.json();
    const audioData = await audioRes.json();
    const transData = await transRes.json();
    
    // Combine them
    const combinedAyahs = arData.data.ayahs.map((ayah: any, index: number) => ({
      ...ayah,
      translation: msData.data.ayahs[index].text,
      translationEn: enData.data.ayahs[index].text,
      transliteration: transData.data.ayahs[index].text,
      audio: audioData.data.ayahs[index].audio
    }));
    
    return {
      ayahs: combinedAyahs,
      surah: arData.data
    };
  } catch (error) {
    console.error(`Error fetching surah ${number}:`, error);
    throw error;
  }
}

export async function fetchAyahAudio(surah: number, ayah: number, edition: string = 'ar.alafasy'): Promise<string> {
  try {
    const response = await fetch(getQuranUrl(`/ayah/${surah}:${ayah}/${edition}`));
    const data = await response.json();
    return data.data.audio;
  } catch (error) {
    console.error(`Error fetching audio for ${surah}:${ayah}:`, error);
    throw error;
  }
}

export interface SearchedAyah extends Ayah {
  surahName: string;
  surahNumber: number;
}

export async function searchAyah(text: string): Promise<SearchedAyah[]> {
  try {
    // 1. Search for Arabic text
    const searchRes = await fetch(getQuranUrl(`/search/${encodeURIComponent(text)}/all/quran-simple`));
    const searchData = await searchRes.json();
    
    if (!searchData.data || searchData.data.count === 0) return [];
    
    // Limit to first 10 results for performance
    const matches = searchData.data.matches.slice(0, 10);
    
    // 2. For each match, fetch translation and transliteration
    const detailedAyahs = await Promise.all(matches.map(async (match: any) => {
      const [msRes, transRes, arRes] = await Promise.all([
        fetch(getQuranUrl(`/ayah/${match.number}/ms.basmeih`)),
        fetch(getQuranUrl(`/ayah/${match.number}/en.transliteration`)),
        fetch(getQuranUrl(`/ayah/${match.number}/quran-uthmani`))
      ]);
      
      const msData = await msRes.json();
      const transData = await transRes.json();
      const arData = await arRes.json();
      
      return {
        ...match,
        text: arData.data.text,
        translation: msData.data.text,
        transliteration: transData.data.text,
        surahName: match.surah.englishName,
        surahNumber: match.surah.number
      };
    }));
    
    return detailedAyahs;
  } catch (error) {
    console.error('Error searching ayah:', error);
    return [];
  }
}

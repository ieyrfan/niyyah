import { getHadisUrl } from '../lib/apiUtils';

export interface HadisListItem {
  id: string;
  title: string;
}

export interface HadisDetail {
  id: string;
  title: string;
  hadith: string;
  arabic?: string; // Original Arabic text
  translation: string;
  attribution: string;
  grade?: string; // Hadeeth grade (Sahih, Hassan, etc.)
  explanation: string;
  hints: string[];
}

export async function fetchHadisCategories(lang: string = 'ms') {
  try {
    const response = await fetch(getHadisUrl(`/categories/list?language=${lang}`));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hadis categories:', error);
    return [];
  }
}

export async function fetchHadisList(categoryId: string, lang: string = 'ms', page: number = 1, perPage: number = 20) {
  try {
    const response = await fetch(getHadisUrl(`/hadeeths/list?language=${lang}&category_id=${categoryId}&page=${page}&per_page=${perPage}`));
    const data = await response.json();
    return (data.data || (Array.isArray(data) ? data : [])) as HadisListItem[]; // Array of HadisListItem
  } catch (error) {
    console.error('Error fetching hadis list:', error);
    return [];
  }
}

export async function fetchHadisDetail(id: string, lang: string = 'ms'): Promise<HadisDetail | null> {
  try {
    const urls = [
      getHadisUrl(`/hadeeths/one?language=${lang}&id=${id}`),
      getHadisUrl(`/hadeeths/one?language=ar&id=${id}`)
    ];

    const [detailRes, arabicRes] = await Promise.all(
      urls.map(url => fetch(url).then(res => res.ok ? res.json() : null).catch(() => null))
    );

    if (!detailRes) return null;

    return {
      ...detailRes,
      hadith: detailRes.hadeeth || detailRes.hadith || '',
      translation: detailRes.hadeeth || detailRes.translation || '',
      arabic: arabicRes?.hadeeth || arabicRes?.hadith || null,
      explanation: detailRes.explanation || detailRes.description || '',
      hints: detailRes.hints || []
    };
  } catch (error) {
    console.error('Error fetching hadis detail:', error);
    return null;
  }
}

export async function fetchRandomHadis(lang: string = 'ms'): Promise<HadisDetail | null> {
  const FALLBACK_HADIS: HadisDetail[] = [
    {
      id: 'f1',
      title: 'Niat Pekerjaan (Actions are by Intentions)',
      hadith: 'Innamal a\'malu binniyat...',
      translation: lang === 'ms' ? 'Sesungguhnya setiap perbuatan itu bergantung pada niat.' : 'Actions are only by intentions.',
      attribution: 'HR. Bukhari & Muslim',
      explanation: 'Setiap amalan dinilai mengikut niat pelakunya.',
      hints: ['Ikhlas', 'Niat'],
      arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ'
    },
    {
      id: 'f2',
      title: 'Mencintai Saudara (Loving for your Brother)',
      hadith: 'La yu\'minu ahadukum...',
      translation: lang === 'ms' ? 'Tidak beriman salah seorang di antara kamu sehingga dia mencintai saudaranya sebagaimana dia mencintai dirinya sendiri.' : 'None of you will believe until you love for your brother what you love for yourself.',
      attribution: 'HR. Bukhari & Muslim',
      explanation: 'Pentingnya kasih sayang sesama Muslim.',
      hints: ['Ukhuwah', 'Kasih Sayang'],
      arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ'
    },
    {
      id: 'f3',
      title: 'Berkata Baik atau Diam',
      hadith: 'Man kana yu\'minu billahi...',
      translation: lang === 'ms' ? 'Sesiapa yang beriman kepada Allah dan hari akhirat, hendaklah dia berkata yang baik atau diam.' : 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
      attribution: 'HR. Bukhari & Muslim',
      explanation: 'Menjaga lisan adalah tanda iman.',
      hints: ['Lisan', 'Akhlak'],
      arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُطْ'
    }
  ];

  try {
    // Attempt categories 1 (Aqeedah) or 2 (Ethics)
    const categoryIds = ['1', '2', '3'];
    const randomCat = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    
    const list = await fetchHadisList(randomCat, lang);
    if (list && list.length > 0) {
      const random = list[Math.floor(Math.random() * Math.min(list.length, 10))];
      const detail = await fetchHadisDetail(random.id, lang);
      if (detail) return detail;
    }
    
    return FALLBACK_HADIS[Math.floor(Math.random() * FALLBACK_HADIS.length)];
  } catch (error) {
    console.error('Error fetching random hadis, using fallback:', error);
    return FALLBACK_HADIS[Math.floor(Math.random() * FALLBACK_HADIS.length)];
  }
}

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, BookOpen, Filter, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchSurahs, searchAyah, SearchedAyah } from '../services/quranService';
import { Surah } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { awardBadge } from '../services/badgeService';
import { useAuth } from '../lib/AuthContext';

export function QuranPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Arabic Search State
  const [arabicSearch, setArabicSearch] = useState('');
  const [isArabicSearching, setIsArabicSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchedAyah[]>([]);

  useEffect(() => {
    async function loadSurahs() {
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSurahs();
  }, []);

  const handleArabicSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabicSearch.trim()) return;
    
    setIsArabicSearching(true);
    try {
      const results = await searchAyah(arabicSearch);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsArabicSearching(false);
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.includes(searchTerm) ||
    s.number.toString() === searchTerm
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-12 pb-32 px-4"
    >
      {/* Clean Header */}
      <header className="text-center space-y-4 pt-6 lg:pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 transition-colors">
          <BookOpen size={14} />
          {t('quran.title')}
        </div>
        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 uppercase italic transition-colors">
          Kalamullah <span className="text-emerald-600">{t('quran.digital_title')}</span>
        </h2>
        <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest max-w-sm mx-auto">
          {t('quran.hadith_quote')}
        </p>
      </header>

      {/* Arabic Ayah Search Section - Refined */}
      <section className="space-y-6">
        <form onSubmit={handleArabicSearch} className="relative group max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder={t('quran.search')}
            value={arabicSearch}
            onChange={(e) => setArabicSearch(e.target.value)}
            dir="rtl"
            className="w-full pl-6 pr-16 py-5 lg:py-6 bg-white border-2 border-slate-50 rounded-[2rem] text-xl lg:text-2xl font-arabic shadow-sm outline-none focus:border-emerald-100 focus:ring-8 focus:ring-emerald-500/5 transition-all text-right text-slate-800 placeholder:text-slate-200"
          />
          <button 
            type="submit"
            disabled={isArabicSearching}
            className="absolute left-4 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-600 shadow-sm transition-all disabled:opacity-50"
          >
            {isArabicSearching ? <Loader2 className="animate-spin" size={14} /> : t('common.search')}
          </button>
        </form>

        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 gap-6 max-w-2xl mx-auto"
            >
              {searchResults.map((result, idx) => (
                <motion.div 
                  key={`${result.number}-${idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 lg:p-8 rounded-[2.5rem] border-2 border-slate-50 space-y-6 group hover:border-emerald-100 transition-colors shadow-sm"
                >
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black text-[10px]">
                        {result.numberInSurah}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.surahName}</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/quran/${result.surahNumber}`)}
                      className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:translate-x-1 transition-transform"
                    >
                      {t('quran.info_btn')} <ChevronRight size={14} />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="font-arabic text-3xl leading-relaxed text-slate-800 text-right" dir="rtl">{result.text}</p>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">{t('quran.translation_label')}</p>
                      <p className="text-base font-bold text-slate-800 italic leading-snug">"{result.translation}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <button 
                onClick={() => setSearchResults([])}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors mx-auto py-4"
              >
                {t('common.back')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="w-full h-px bg-slate-50 transition-colors"></div>

      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t('quran.list_title')}</h3>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t('quran.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-50 rounded-2xl focus:border-emerald-100 transition-all outline-none text-sm font-bold shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-32 bg-white border-2 border-slate-50 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurahs.map((surah) => (
              <motion.div
                key={surah.number}
                whileHover={{ y: -4 }}
                onClick={() => {
                  if (user) awardBadge(user.uid, 'quran_explorer');
                  navigate(`/quran/${surah.number}`);
                }}
                className="group bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border-2 border-slate-50 hover:border-emerald-100 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-slate-50/50 rounded-bl-3xl flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-white">{surah.number}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm uppercase tracking-tight">{surah.englishName}</h3>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">
                      <span>{surah.revelationType === 'Meccan' ? t('quran.revelation_meccan') : t('quran.revelation_medinan')}</span>
                      <span className="text-slate-100">•</span>
                      <span>{t('quran.verses').replace('{num}', surah.numberOfAyahs.toString())}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-arabic text-2xl text-slate-900 group-hover:text-emerald-800 transition-colors">{surah.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>
        )}

        {filteredSurahs.length === 0 && !loading && (
          <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('quran.empty')}</p>
          </div>
        )}
      </section>
    </motion.div>
  );
}

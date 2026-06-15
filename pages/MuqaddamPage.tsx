import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Play, Pause, ChevronRight, Info, Music, Sparkles, BookOpen } from 'lucide-react';
import { fetchSurahDetail } from '../services/quranService';
import { Surah, Ayah } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

const MUQADDAM_SURAHS = [
  { number: 1, name: 'Al-Fatihah', label: 'Pembukaan' },
  { number: 93, name: 'Ad-Dhuha', label: 'Waktu Dhuha' },
  { number: 94, name: 'Ash-Sharh', label: 'Kelapangan' },
  { number: 95, name: 'At-Tin', label: 'Buah Tin' },
  { number: 96, name: 'Al-Alaq', label: 'Segumpal Darah' },
  { number: 97, name: 'Al-Qadr', label: 'Kemuliaan' },
  { number: 98, name: 'Al-Bayyinah', label: 'Bukti yang Nyata' },
  { number: 99, name: 'Az-Zalzalah', label: 'Kegoncangan' },
  { number: 100, name: 'Al-Adiyat', label: 'Kuda Perang yang Berlari Kencang' },
  { number: 101, name: 'Al-Qari\'ah', label: 'Hari Kiamat' },
  { number: 102, name: 'At-Takathur', label: 'Bermegah-megah' },
  { number: 103, name: 'Al-Asr', label: 'Masa' },
  { number: 104, name: 'Al-Humazah', label: 'Pengumpat' },
  { number: 105, name: 'Al-Fil', label: 'Gajah' },
  { number: 106, name: 'Quraish', label: 'Suku Quraish' },
  { number: 107, name: 'Al-Ma\'un', label: 'Barang yang Berguna' },
  { number: 108, name: 'Al-Kauthar', label: 'Nikmat yang Banyak' },
  { number: 109, name: 'Al-Kafirun', label: 'Orang-orang Kafir' },
  { number: 110, name: 'An-Nasr', label: 'Pertolongan' },
  { number: 111, name: 'Al-Masad', label: 'Sabut' },
  { number: 112, name: 'Al-Ikhlas', label: 'Ikhlas' },
  { number: 113, name: 'Al-Falaq', label: 'Waktu Subuh' },
  { number: 114, name: 'An-Nas', label: 'Manusia' },
];


export function MuqaddamPage() {
  const { t } = useLanguage();
  const TAJWID_TIPS = [
    { rule: t('muqaddam.rule.ghunnah'), description: t('muqaddam.rule.ghunnah_desc'), color: 'text-pink-600' },
    { rule: t('muqaddam.rule.mad'), description: t('muqaddam.rule.mad_desc'), color: 'text-emerald-600' },
    { rule: t('muqaddam.rule.qalqalah'), description: t('muqaddam.rule.qalqalah_desc'), color: 'text-amber-600' },
  ];
  const [selectedSurah, setSelectedSurah] = useState<{ number: number, name: string } | null>(null);
  const [surahData, setSurahData] = useState<{ ayahs: Ayah[], surah: Surah } | null>(null);
  const [loading, setLoading] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedSurah) {
      loadSurah(selectedSurah.number);
    }
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [selectedSurah]);

  const loadSurah = async (num: number) => {
    setLoading(true);
    try {
      const data = await fetchSurahDetail(num);
      setSurahData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = (ayahNumber: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyah === ayahNumber) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
      }
    } else {
      if (audioRef.current) audioRef.current.pause();
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingAyah(ayahNumber);
      audioRef.current.onended = () => setPlayingAyah(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-32 px-4"
    >
      <header className="bg-emerald-900 text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
            <BookOpen size={14} />
            {t('muqaddam.tag')}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase">{t('muqaddam.title')}</h2>
          <p className="text-emerald-200/60 max-w-xl text-sm font-medium leading-relaxed uppercase tracking-wider">
            {t('muqaddam.desc')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      </header>

      {selectedSurah ? (
        <div className="space-y-8">
          <button 
            onClick={() => {
              setSelectedSurah(null);
              setSurahData(null);
              if (audioRef.current) audioRef.current.pause();
            }}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
          >
            {t('muqaddam.back')}
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
               <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('muqaddam.loading')}</p>
            </div>
          ) : surahData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-12">
                   <div className="text-center space-y-2">
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{surahData.surah.name}</h3>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{surahData.surah.englishNameTranslation}</p>
                   </div>

                   <div className="space-y-12">
                      {surahData.ayahs.map((ayah) => (
                        <div key={ayah.number} className="space-y-6">
                           <div className="flex justify-between items-start gap-4">
                              <button 
                                onClick={() => toggleAudio(ayah.number, ayah.audio)}
                                className={cn(
                                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm",
                                  playingAyah === ayah.number ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                )}
                              >
                                {playingAyah === ayah.number && !audioRef.current?.paused ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                              </button>
                              <p className="font-arabic text-3xl md:text-5xl leading-relaxed text-right text-slate-900" dir="rtl">
                                {ayah.text}
                                <span className="inline-flex items-center justify-center w-10 h-10 ml-4 rounded-full border border-emerald-100 text-[10px] items-center font-sans font-bold text-emerald-600 align-middle">
                                  {ayah.numberInSurah}
                                </span>
                              </p>
                           </div>
                            <div className="md:pl-16 space-y-1">
                               <p className="text-emerald-600 italic font-medium text-sm leading-relaxed">
                                 {ayah.transliteration}
                               </p>
                               <p className="text-sm font-medium text-slate-500 italic leading-loose text-left">
                                 "{ayah.translation}"
                               </p>
                            </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              <aside className="space-y-6">
                 <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                       <Sparkles size={18} className="text-emerald-400" />
                       <h4 className="text-xs font-black uppercase tracking-widest">{t('muqaddam.tajwid_title')}</h4>
                    </div>
                    <div className="space-y-6">
                       {TAJWID_TIPS.map((tip, i) => (
                         <div key={i} className="space-y-2">
                            <p className={cn("text-[10px] font-black uppercase tracking-widest", tip.color)}>{tip.rule}</p>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed">{tip.description}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800">
                       <Music size={18} />
                       <h4 className="text-xs font-black uppercase tracking-widest">{t('muqaddam.qari_title')}</h4>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Mishary Rashid Alafasy</p>
                    <p className="text-xs text-emerald-700/60 leading-relaxed font-medium">
                      Bacaan yang perlahan dan jelas, sesuai untuk tujuan pembelajaran hafazan.
                    </p>
                 </div>
              </aside>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MUQADDAM_SURAHS.map((surah) => (
            <motion.div
              key={surah.number}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedSurah(surah)}
              className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-emerald-200 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all text-xs">
                  {surah.number}
                </div>
                <Book className="text-slate-100 group-hover:text-emerald-100 transition-colors" size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-1">{surah.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{surah.label}</p>
              
              <div className="mt-6 flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                {t('muqaddam.start_read')} <ChevronRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

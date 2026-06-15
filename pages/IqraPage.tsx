import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, CheckCircle, ChevronRight, 
  GraduationCap, ChevronLeft, 
  RotateCcw, Sparkles 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

const IQRA_LEVELS = [
  { id: 1, title: 'Iqra 1', description_ms: 'Pengenalan Huruf Hijaiyah tunggal berbaris Fathah.', description_en: 'Introduction to single Hijaiyah letters with Fathah.', lessons: 10 },
  { id: 2, title: 'Iqra 2', description_ms: 'Mengenal huruf bersambung dan bunyi panjang.', description_en: 'Learning joint letters and long vowels.', lessons: 12 },
  { id: 3, title: 'Iqra 3', description_ms: 'Mengenal baris Kasrah dan Dhammah.', description_en: 'Learning Kasrah and Dhammah vowels.', lessons: 15 },
  { id: 4, title: 'Iqra 4', description_ms: 'Mengenal baris Tanwin dan Sukun.', description_en: 'Learning Tanwin and Sukun vowels.', lessons: 18 },
  { id: 5, title: 'Iqra 5', description_ms: 'Mengenal hukum Tajwid asas & baris Syaddah.', description_en: 'Learning basic Tajweed rules & Syaddah.', lessons: 20 },
  { id: 6, title: 'Iqra 6', description_ms: 'Latihan membaca ayat panjang & hukum Waqaf.', description_en: 'Practice reading long verses & Waqaf rules.', lessons: 25 },
];

const IQRA_CONTENT: Record<number, any[]> = {
  1: [
    { page: 1, title_ms: 'Huruf Tunggal Berbaris Atas (1)', title_en: 'Single Letters with Fathah (1)', letters: [
      { char: 'اَ', sounds: 'a', transliteration: 'A', tip_ms: 'Sila buka mulut luas-luas', tip_en: 'Open mouth very wide' },
      { char: 'بَ', sounds: 'ba', transliteration: 'Ba', tip_ms: 'Kedua bibir dirapatkan', tip_en: 'Close both lips' },
      { char: 'تَ', sounds: 'ta', transliteration: 'Ta', tip_ms: 'Hujung lidah ke gusi atas', tip_en: 'Tip of tongue to upper gums' }
    ]},
    { page: 2, title_ms: 'Huruf Tunggal Berbaris Atas (2)', title_en: 'Single Letters with Fathah (2)', letters: [
      { char: 'ثَ', sounds: 'tha', transliteration: 'Tha', tip_ms: 'Hujung lidah sentuh hujung gigi', tip_en: 'Tip of tongue touches tip of teeth' },
      { char: 'جَ', sounds: 'ja', transliteration: 'Ja', tip_ms: 'Tengah lidah ke langit-langit', tip_en: 'Middle of tongue to palate' },
      { char: 'حَ', sounds: 'ha', transliteration: 'Ha', tip_ms: 'Suara bersih dari kerongkong', tip_en: 'Clear sound from throat' }
    ]},
    { page: 3, title_ms: 'Huruf Tunggal Berbaris Atas (3)', title_en: 'Single Letters with Fathah (3)', letters: [
      { char: 'خَ', sounds: 'kha', transliteration: 'Kha', tip_ms: 'Pangkal lidah bergetar', tip_en: 'Back of tongue vibrates' },
      { char: 'دَ', sounds: 'da', transliteration: 'Da', tip_ms: 'Hujung lidah rapat ke gigi', tip_en: 'Tip of tongue close to teeth' },
      { char: 'ذَ', sounds: 'dha', transliteration: 'Dha', tip_ms: 'Lidah sentuh sedikit hujung gigi', tip_en: 'Tongue touches tip of teeth slightly' }
    ]},
    { page: 4, title_ms: 'Huruf Tunggal Berbaris Atas (4)', title_en: 'Single Letters with Fathah (4)', letters: [
      { char: 'رَ', sounds: 'ra', transliteration: 'Ra', tip_ms: 'Hujung lidah digetarkan', tip_en: 'Tip of tongue trilled' },
      { char: 'زَ', sounds: 'za', transliteration: 'Za', tip_ms: 'Gigi dirapatkan (desiran)', tip_en: 'Teeth closed (hissing)' },
      { char: 'سَ', sounds: 'sa', transliteration: 'Sa', tip_ms: 'Suara tajam (siulan)', tip_en: 'Sharp sound (whistling)' },
      { char: 'شَ', sounds: 'sha', transliteration: 'Sha', tip_ms: 'Hembusan udara dari tengah lidah', tip_en: 'Air breath from middle of tongue' }
    ]}
  ],
  2: [
    { page: 1, title_ms: 'Pengenalan Huruf Bersambung', title_en: 'Introduction to Joint Letters', letters: [
      { char: 'بَـتَـا', sounds: 'ba-taaa', transliteration: 'Ba-Taa', tip_ms: 'Hujung alif adalah bunyi panjang', tip_en: 'End of alif is long sound' },
      { char: 'نَـبَـا', sounds: 'na-baaa', transliteration: 'Na-Baa', tip_ms: 'Alif selepas Fathah = 2 Harakat', tip_en: 'Alif after Fathah = 2 Counts' }
    ]},
    { page: 2, title_ms: 'Mad Asli (Alif)', title_en: 'Mad Asli (Alif)', letters: [
      { char: 'جَا', sounds: 'jaaa', transliteration: 'Jaa', tip_ms: 'Panjangkan 2 harakat', tip_en: 'Extend 2 counts' },
      { char: 'حَا', sounds: 'haaa', transliteration: 'Haa', tip_ms: 'Bunyi Ha panjang', tip_en: 'Long Ha sound' }
    ]}
  ],
  3: [
    { page: 1, title_ms: 'Baris Kasrah (Bawah)', title_en: 'Kasrah (Bottom)', letters: [
      { char: 'اِ', sounds: 'i', transliteration: 'I', tip_ms: 'Mulut ditarik (senyum)', tip_en: 'Mouth pulled (smile)' },
      { char: 'بِ', sounds: 'bi', transliteration: 'Bi', tip_ms: 'Bunyi pendek & bersih', tip_en: 'Short & clean sound' },
      { char: 'تِ', sounds: 'ti', transliteration: 'Ti', tip_ms: 'Tarik sedikit bibir', tip_en: 'Pull lips slightly' }
    ]}
  ],
  4: [
    { page: 1, title_ms: 'Tanwin Fathah (An)', title_en: 'Tanwin Fathah (An)', letters: [
      { char: 'اً', sounds: 'an', transliteration: 'An', tip_ms: 'Bunyi n di hujung (atas)', tip_en: 'Sound n at end (top)' }
    ]}
  ],
  5: [
    { page: 1, title_ms: 'Tanda Mati (Sukun)', title_en: 'Sukun (Silent Mark)', letters: [
      { char: 'اَبْ', sounds: 'ab', transliteration: 'Ab', tip_ms: 'Matikan bunyi huruf Ba', tip_en: 'Silence the Ba sound' }
    ]}
  ],
  6: [
    { page: 1, title_ms: 'Tanda Sabdu (Syaddah)', title_en: 'Syaddah (Emphasis)', letters: [
      { char: 'اَنَّ', sounds: 'anna', transliteration: 'Anna', tip_ms: 'Tekan & tahan (Ghunnah)', tip_en: 'Press & hold (Ghunnah)' }
    ]}
  ]
};

export function IqraPage() {
  const { t, language } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [readingMode, setReadingMode] = useState(false);
  const [activeLetter, setActiveLetter] = useState<number | null>(null);

  const startLevel = (id: number) => {
    setSelectedLevel(id);
    setCurrentPage(0);
    setReadingMode(true);
  };

  const levelProgress = IQRA_CONTENT[selectedLevel || 0] || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-40 px-4"
    >
      <header className="mb-12">
        <h2 className="text-4xl font-black text-emerald-950 uppercase italic tracking-tighter">Iqra' Learning</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Panduan membaca Al-Quran langkah demi langkah.</p>
      </header>

      <AnimatePresence mode="wait">
        {!readingMode ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {IQRA_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => startLevel(level.id)}
                className="group relative bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden text-left"
              >
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <GraduationCap size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic">{level.title}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {language === 'ms' ? level.description_ms : level.description_en}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 w-0 group-hover:w-full transition-all duration-1000" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{level.lessons} Lessons</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[5rem]" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="reading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setReadingMode(false)}
                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
              >
                <ChevronLeft size={16} /> Kembali ke Menu
              </button>
              <div className="text-center">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Tahap {selectedLevel}</span>
                <h3 className="text-xl font-black text-slate-800 uppercase italic">
                  {levelProgress[currentPage]?.title_ms || 'Latihan'}
                </h3>
              </div>
              <div className="w-20" />
            </div>

            {levelProgress.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentPage + 1) / levelProgress.length) * 100}%` }}
                          className="h-full bg-emerald-600"
                        />
                      </div>

                      <div className="flex flex-wrap justify-center gap-12 md:gap-20 py-12">
                         {levelProgress[currentPage].letters.map((item: any, idx: number) => (
                           <motion.div
                             key={idx}
                             whileHover={{ scale: 1.1 }}
                             className={cn(
                               "relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center rounded-[2.5rem] transition-all bg-slate-50 text-slate-800 border-2 border-slate-100",
                               activeLetter === idx && "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10"
                             )}
                             onClick={() => {
                               setActiveLetter(idx);
                               setTimeout(() => setActiveLetter(null), 1000);
                             }}
                           >
                             <span className="font-arabic text-6xl md:text-8xl">{item.char}</span>
                           </motion.div>
                         ))}
                      </div>
                   </div>

                   {/* Navigation */}
                   <div className="mt-8 flex items-center justify-center gap-4">
                      <button 
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(c => c - 1)}
                        className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all disabled:opacity-30 shadow-sm"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        disabled={currentPage === levelProgress.length - 1}
                        onClick={() => setCurrentPage(c => c + 1)}
                        className="flex-1 max-w-sm h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-30"
                      >
                        Seterusnya <ChevronRight size={18} />
                      </button>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
                      <div className="relative z-10 space-y-6">
                         <div className="flex items-center gap-2">
                           <Sparkles size={18} className="text-emerald-400" />
                           <h4 className="text-xs font-black uppercase tracking-widest">Tip Pembacaan</h4>
                         </div>
                         <div className="space-y-8">
                            {levelProgress[currentPage].letters.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-4">
                                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-arabic text-xl">{item.char}</div>
                                 <div className="flex-1 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-emerald-400">Teknik</p>
                                    <p className="text-xs font-medium text-slate-300">{language === 'ms' ? item.tip_ms : item.tip_en}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 text-center">
                      <button 
                        onClick={() => setReadingMode(false)}
                        className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100"
                      >
                        Selesai Sesi
                      </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[4rem] text-center space-y-8 border border-emerald-100 shadow-2xl relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                       <RotateCcw size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Kandungan Belum Tersedia</h3>
                    <p className="text-slate-400 text-sm max-w-md mx-auto uppercase tracking-widest font-bold">Kandungan bagi tahap ini sedang dikemaskinikan.</p>
                    <button 
                      onClick={() => setReadingMode(false)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/10 hover:bg-emerald-700 transition-all"
                    >
                      Pilih Tahap Lain
                    </button>
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

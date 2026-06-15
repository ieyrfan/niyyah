import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fingerprint, RotateCcw, Volume2, Info, ChevronRight, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

const ZIKIR_DAILY = [
  { arabic: 'سُبْحَانَ اللهِ', transliteration: 'Subhanallah', meaning: 'Maha Suci Allah', count: 33 },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: 'Segala Puji Bagi Allah', count: 33 },
  { arabic: 'اللهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: 'Allah Maha Besar', count: 33 },
  { arabic: 'لَا إِلَهَ إِلَّا اللهُ', transliteration: 'La ilaha illallah', meaning: 'Tiada Tuhan Melainkan Allah', count: 100 },
  { arabic: 'أَسْتَغْفِرُ اللهَ', transliteration: 'Astaghfirullah', meaning: 'Aku Memohon Keampunan Allah', count: 100 },
];

export function ZikirPage() {
  const { t } = useLanguage();
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'tasbih' | 'daily'>('tasbih');
  const [vibration, setVibration] = useState(true);

  const zikirDaily = [
    { arabic: 'سُبْحَانَ اللهِ', transliteration: 'Subhanallah', meaning: t('zikir.meaning.subhanallah'), count: 33 },
    { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', meaning: t('zikir.meaning.alhamdulillah'), count: 33 },
    { arabic: 'اللهُ أَكْبَرُ', transliteration: 'Allahu Akbar', meaning: t('zikir.meaning.allahuakbar'), count: 33 },
    { arabic: 'لَا إِلَهَ إِلَّا اللهُ', transliteration: 'La ilaha illallah', meaning: t('zikir.meaning.lailahaillallah'), count: 100 },
    { arabic: 'أَسْتَغْفِرُ اللهَ', transliteration: 'Astaghfirullah', meaning: t('zikir.meaning.astaghfirullah'), count: 100 },
  ];

  const [limit, setLimit] = useState<number | null>(null);

  const increment = () => {
    setCount(c => {
      const next = c + 1;
      if (limit && next >= limit) {
        if (vibration && window.navigator.vibrate) {
          window.navigator.vibrate([50, 30, 50]);
        }
        alert(`${t('zikir.tab.tasbih')} ${t('common.success')}! (${limit}x)`);
        return 0; // Auto reset
      }
      return next;
    });
    if (vibration && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const reset = () => {
    if (confirm(t('zikir.reset_confirm'))) {
      setCount(0);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-32 px-4"
    >
      <header className="text-center space-y-2 py-8">
        <h2 className="text-4xl font-bold text-emerald-950 tracking-tight">{t('zikir.title')}</h2>
        <p className="text-sm text-slate-500 font-medium">{t('zikir.subtitle')}</p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-2xl border border-slate-100 flex gap-1 shadow-sm">
          <button 
            onClick={() => setActiveTab('tasbih')}
            className={cn(
              "px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'tasbih' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {t('zikir.tab.tasbih')}
          </button>
          <button 
            onClick={() => setActiveTab('daily')}
            className={cn(
              "px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              activeTab === 'daily' ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            {t('zikir.tab.wird')}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tasbih' ? (
          <motion.div 
            key="tasbih"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="relative">
               {/* Outer ring */}
               <div className="w-80 h-80 rounded-full border-[1.5rem] border-slate-100 flex items-center justify-center relative overflow-hidden shadow-2xl shadow-emerald-900/5">
                  <div className="absolute inset-0 bg-emerald-50/30 opacity-50"></div>
                  <div className="text-center z-10">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                       {limit ? `Sasaran: ${limit}` : 'Jumlah Zikir'}
                     </span>
                     <span className="text-9xl font-bold text-emerald-950 block tabular-nums leading-none">{count}</span>
                  </div>
               </div>

               {/* Rester button */}
               <button 
                 onClick={reset}
                 className="absolute -top-4 -right-4 w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:rotate-180 transition-all duration-500 shadow-md"
               >
                 <RotateCcw size={20} />
               </button>
            </div>

            {/* Main Click Button */}
            <button 
              onClick={increment}
              className="w-full max-w-sm h-40 bg-emerald-600 active:bg-emerald-700 text-white rounded-[2.5rem] shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-6 group transition-all active:scale-95"
            >
              <Fingerprint size={48} className="group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-bold tracking-wide">{t('zikir.btn.click')}</span>
            </button>

            <div className="flex gap-4">
               <button 
                 onClick={() => setVibration(!vibration)}
                 className={cn(
                   "p-4 rounded-2xl border transition-all flex items-center gap-2",
                   vibration ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-100 text-slate-300"
                 )}
               >
                 <Volume2 size={18} />
                 <span className="text-[10px] font-black uppercase">{t('zikir.vibration').replace('{status}', vibration ? t('common.on') : t('common.off'))}</span>
               </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="daily"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex gap-4 mb-4">
               <button className="flex-1 p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4 group hover:bg-emerald-100 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><Sun size={20} /></div>
                  <div className="text-left">
                     <h4 className="text-base font-bold text-emerald-950">{t('zikir.mathurat')}</h4>
                     <p className="text-xs font-bold text-emerald-600 opacity-60">{t('zikir.pagi')}</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-emerald-300 group-hover:translate-x-1 transition-transform" />
               </button>
               <button className="flex-1 p-6 bg-slate-100 rounded-[2rem] border border-slate-200 flex items-center gap-4 group hover:bg-slate-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-800 shadow-sm"><Moon size={20} /></div>
                  <div className="text-left">
                     <h4 className="text-sm font-black text-slate-900 uppercase">{t('zikir.mathurat')}</h4>
                     <p className="text-[10px] font-bold text-slate-400 opacity-60">{t('zikir.petang')}</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-slate-300 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            {zikirDaily.map((zikir, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-4">
                     <h3 className="text-5xl font-arabic text-emerald-950 text-right md:text-left" dir="rtl">{zikir.arabic}</h3>
                     <div className="space-y-1">
                       <p className="text-emerald-700 font-bold text-lg">{zikir.transliteration}</p>
                       <p className="text-sm font-medium text-slate-500">{zikir.meaning}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 tracking-widest capitalize">{t('common.suggested')}</p>
                         <p className="text-xl font-black text-emerald-600">{zikir.count}x</p>
                      </div>
                      <button 
                        onClick={() => {
                          setCount(0);
                          setLimit(zikir.count);
                          setActiveTab('tasbih');
                        }}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
                      >
                        <ChevronRight size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Moon, CheckCircle, Info, Heart, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '../lib/LanguageContext';

export function RamadanPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(1);
  const [records, setRecords] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const deedsList = [
    { id: 'fasting', label: t('ramadan.deed.fasting'), icon: Moon },
    { id: 'tarawih', label: t('ramadan.deed.tarawih'), icon: Star },
    { id: 'tadarus', label: t('ramadan.deed.tadarus'), icon: CheckCircle },
    { id: 'sedekah', label: t('ramadan.deed.sedekah'), icon: Heart },
    { id: 'witir', label: t('ramadan.deed.witir'), icon: Star },
    { id: 'iktikaf', label: t('ramadan.deed.iktikaf'), icon: Moon },
  ];

  useEffect(() => {
    async function loadRamadanRecords() {
      if (!user) return;
      setLoading(true);
      try {
        const ref = doc(db, 'users', user.uid, 'tracker_ramadan', `day_${selectedDay}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRecords(snap.data());
        } else {
          const initial = { day: selectedDay, deeds: {} };
          await setDoc(ref, initial);
          setRecords(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRamadanRecords();
  }, [user, selectedDay]);

  const toggleDeed = async (deedId: string) => {
    if (!user) return;
    const currentDeeds = records.deeds || {};
    const newValue = !currentDeeds[deedId];
    const updatedRecords = {
      ...records,
      deeds: { ...currentDeeds, [deedId]: newValue }
    };
    setRecords(updatedRecords);
    
    try {
      const ref = doc(db, 'users', user.uid, 'tracker_ramadan', `day_${selectedDay}`);
      await updateDoc(ref, { [`deeds.${deedId}`]: newValue });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-20 px-4"
    >
      <header className="bg-emerald-950 text-white p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
            <Moon size={14} className="text-emerald-400" />
            {t('ramadan.subtitle')}
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight uppercase italic underline decoration-emerald-500/40">{t('ramadan.title')}</h2>
          <p className="text-emerald-200/60 max-w-xl text-sm font-medium leading-relaxed uppercase tracking-wider">
            {t('ramadan.desc')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-50"></div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Day Selector */}
        <div className="w-full lg:w-48 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">{t('ramadan.select_day')}</h3>
          <div className="grid grid-cols-5 lg:grid-cols-2 gap-2">
            {[...Array(30)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i + 1)}
                className={cn(
                  "py-3 rounded-xl text-xs font-black transition-all border",
                  selectedDay === i + 1
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20"
                    : "bg-white text-slate-400 border-slate-100 hover:border-emerald-200"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-8">
          <div className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('ramadan.day_count').replace('{num}', selectedDay.toString())}</span>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('ramadan.checklist')}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('ramadan.progress')}</p>
                <p className="text-xl font-black text-emerald-600">
                  {records.deeds ? Object.values(records.deeds).filter(Boolean).length : 0}/{deedsList.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deedsList.map((deed) => (
                <button
                  key={deed.id}
                  onClick={() => toggleDeed(deed.id)}
                  className={cn(
                    "flex items-center justify-between p-6 rounded-3xl border transition-all group",
                    records.deeds?.[deed.id]
                      ? "bg-emerald-50 border-emerald-200 shadow-inner"
                      : "bg-white border-slate-100 hover:border-emerald-100"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      records.deeds?.[deed.id] ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500"
                    )}>
                      <deed.icon size={20} />
                    </div>
                    <span className={cn(
                      "text-sm font-black uppercase tracking-widest",
                      records.deeds?.[deed.id] ? "text-emerald-900" : "text-slate-400"
                    )}>
                      {deed.label}
                    </span>
                  </div>
                  {records.deeds?.[deed.id] && (
                    <CheckCircle size={20} className="text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-8 rounded-[3rem] border border-emerald-100 space-y-6">
                <div className="flex items-center gap-2">
                   <Moon size={18} className="text-emerald-600" />
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{t('ramadan.niat.title')}</h4>
                </div>
                <p className="font-arabic text-3xl text-right leading-relaxed" dir="rtl">{t('ramadan.niat.arabic')}</p>
                <div className="space-y-2">
                   <p className="text-emerald-600 italic font-medium text-[11px] leading-relaxed">{t('ramadan.niat.transliteration')}</p>
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"{t('ramadan.niat.meaning')}"</p>
                </div>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-emerald-100 space-y-6">
                <div className="flex items-center gap-2">
                   <Heart size={18} className="text-emerald-600" />
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">{t('ramadan.break.title')}</h4>
                </div>
                <p className="font-arabic text-3xl text-right leading-relaxed" dir="rtl">{t('ramadan.break.arabic')}</p>
                <div className="space-y-2">
                   <p className="text-emerald-600 italic font-medium text-[11px] leading-relaxed">{t('ramadan.break.transliteration')}</p>
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"{t('ramadan.break.meaning')}"</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                   <Info size={16} className="text-emerald-400" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">{t('ramadan.quote.title')}</span>
                </div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-6 text-emerald-50">
                  {t('ramadan.quote.text')}
                </blockquote>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">— {t('ramadan.quote.author')}</p>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rotate-45 translate-x-1/2 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

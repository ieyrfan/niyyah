import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

import { fetchSolatTimes } from '../services/solatService';
import { checkTrackerBadges } from '../services/badgeService';

export function TrackerPage() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [records, setRecords] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [todayPrayerTimes, setTodayPrayerTimes] = useState<any>(null);

  const PRAYERS = [
    { id: 'subuh', label: t('prayer.fajr'), timeKey: 'fajr' },
    { id: 'zohor', label: t('prayer.dhuhr'), timeKey: 'dhuhr' },
    { id: 'asar', label: t('prayer.asr'), timeKey: 'asr' },
    { id: 'maghrib', label: t('prayer.maghrib'), timeKey: 'maghrib' },
    { id: 'isyak', label: t('prayer.isha'), timeKey: 'isha' }
  ];

  useEffect(() => {
    async function getTimes() {
      const zone = profile?.zon_jakim || 'WLY01';
      const times = await fetchSolatTimes(zone);
      setTodayPrayerTimes(times.prayerTimes);
    }
    getTimes();
  }, [profile?.zon_jakim]);

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  const isPrayerTimePassed = (prayerId: string) => {
    if (!isToday) return true; // Can track any past date
    if (!todayPrayerTimes) return false;

    const prayer = PRAYERS.find(p => p.id === prayerId);
    if (!prayer) return false;

    const timeStr = todayPrayerTimes[prayer.timeKey];
    if (!timeStr) return false;

    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const prayerTime = new Date();
    prayerTime.setHours(h, m, 0, 0);

    return now >= prayerTime;
  };

  useEffect(() => {
    async function loadTracker() {
      if (!user) {
        // Guest mode fallback to local storage
        const localData = localStorage.getItem(`tracker_${selectedDate}`);
        if (localData) {
          setRecords(JSON.parse(localData));
        } else {
          const initial = { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false, tarikh: selectedDate };
          setRecords(initial);
        }
        setLoading(false);
        return;
      }
      setLoading(true);
      const ref = doc(db, 'users', user.uid, 'tracker_solat', selectedDate);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRecords(snap.data());
      } else {
        const initial = { subuh: false, zohor: false, asar: false, maghrib: false, isyak: false, tarikh: selectedDate };
        await setDoc(ref, initial);
        setRecords(initial);
      }
      setLoading(false);
    }
    loadTracker();
  }, [user, selectedDate]);

  const toggle = async (id: string) => {
    if (loading) return;
    const newValue = !records[id];
    const updatedRecords = { ...records, [id]: newValue };
    
    // Optimistic update
    setRecords(updatedRecords);
    
    if (!user) {
      localStorage.setItem(`tracker_${selectedDate}`, JSON.stringify(updatedRecords));
      return;
    }

    try {
      const ref = doc(db, 'users', user.uid, 'tracker_solat', selectedDate);
      await setDoc(ref, { [id]: newValue }, { merge: true });

      // Check for badges
      const newTotal = Object.values(updatedRecords).filter(v => v === true).length;
      checkTrackerBadges(user.uid, newTotal);
    } catch (err) {
      console.error("Tracker update failed:", err);
      // Rollback on error
      setRecords(prev => ({ ...prev, [id]: !newValue }));
    }
  };

  const completedCount = Object.values(records).filter(v => v === true).length;
  const progress = (completedCount / 5) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-10 pt-4 lg:pt-0"
    >
      <header className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
        <div className="text-center lg:text-left">
          <h2 className="text-xl lg:text-2xl font-black tracking-tighter text-emerald-950 uppercase italic">{t('tracker.title').split(' ')[0]} <span className="text-emerald-600">{t('tracker.title').split(' ')[1]}</span></h2>
          <p className="text-[7.5px] text-slate-300 font-black uppercase tracking-[0.4em] mt-1.5">{t('tracker.subtitle')} • 2024</p>
        </div>
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          <button 
            onClick={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
            className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-black text-[8px] uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex-shrink-0"
          >
            Hari Ini
          </button>
          <div className="bg-white px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg border-2 border-slate-50 flex items-center gap-2.5 shadow-xl shadow-slate-200/10 flex-1 lg:w-auto overflow-hidden group focus-within:border-emerald-200 transition-all">
             <Calendar size={14} className="text-emerald-600" />
             <input 
               type="date"
               value={selectedDate}
               onChange={(e) => setSelectedDate(e.target.value)}
               max={format(new Date(), 'yyyy-MM-dd')}
               className="bg-transparent font-black text-[8px] lg:text-[9px] text-slate-800 outline-none focus:ring-0 uppercase tracking-widest cursor-pointer w-full"
             />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
        <div className="xl:col-span-2 space-y-4">
          {PRAYERS.map((p) => {
            const isPassed = isPrayerTimePassed(p.id);
            return (
              <button
                key={p.id}
                onClick={() => isPassed && toggle(p.id)}
                disabled={!isPassed}
                className={cn(
                  "w-full flex items-center justify-between p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border-2 transition-all duration-500 relative overflow-hidden group",
                  records[p.id] 
                    ? "bg-emerald-50/30 border-emerald-500 shadow-3xl shadow-emerald-500/5 text-emerald-950" 
                    : !isPassed 
                      ? "bg-slate-50/50 border-slate-100 text-slate-300 cursor-not-allowed grayscale"
                      : "bg-white border-slate-50 text-slate-400 hover:border-emerald-100 hover:shadow-xl hover:shadow-slate-200/50"
                )}
              >
                <div className="flex items-center gap-5 lg:gap-8 relative z-10">
                  <div className={cn(
                     "w-12 h-12 lg:w-16 lg:h-16 rounded-[1rem] lg:rounded-[1.5rem] flex items-center justify-center transition-all shadow-sm",
                     records[p.id] ? "bg-emerald-600 text-white rotate-6" : 
                     !isPassed ? "bg-slate-100 text-slate-200" :
                     "bg-slate-50 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                  )}>
                     <CheckCircle2 size={24} />
                  </div>
                  <div className="text-left">
                    <span className="text-lg lg:text-2xl font-black uppercase tracking-tight">{p.label}</span>
                    <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">
                      {records[p.id] ? t('tracker.done') : !isPassed ? 'Belum Waktu' : t('tracker.pending')}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl border-4 flex items-center justify-center transition-all duration-500",
                  records[p.id] ? "bg-emerald-600 border-emerald-500 text-white scale-110 rotate-12" : "border-slate-50 group-hover:border-emerald-100"
                )}>
                   {records[p.id] ? <CheckCircle2 size={20} /> : <Circle size={20} className="text-slate-100" />}
                </div>
              </button>
            );
          })}
        </div>

        <aside className="space-y-6">
           <div className="bg-slate-900 text-white p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] space-y-6 lg:space-y-8 shadow-xl shadow-slate-900/20">
              <div className="flex items-center gap-3">
                 <TrendingUp size={20} className="text-emerald-400" />
                 <h3 className="font-bold text-[11px] lg:text-sm uppercase tracking-widest">{t('tracker.target')}</h3>
              </div>
              
              <div className="space-y-2">
                 <div className="flex justify-between items-baseline">
                    <span className="text-5xl lg:text-6xl font-light tracking-tighter">{progress.toFixed(0)}<span className="text-lg lg:text-xl opacity-40">%</span></span>
                    <span className="text-[10px] lg:text-xs font-bold text-emerald-400 uppercase tracking-widest">{completedCount}/5 {t('settings.notifications').split(' ')[1] || 'Solat'}</span>
                 </div>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-emerald-500"
                    />
                 </div>
              </div>

              <p className="text-[11px] text-slate-400 italic leading-relaxed">
                {t('tracker.quote')}
              </p>
           </div>

           <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
              <h4 className="font-bold text-emerald-950 uppercase text-[10px] tracking-widest mb-4">{t('tracker.reward_title')}</h4>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">{t('tracker.reward_desc')}</p>
           </div>
        </aside>
      </div>
    </motion.div>
  );
}

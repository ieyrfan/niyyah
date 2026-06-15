import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Download, ChevronLeft, ChevronRight, Navigation, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { fetchFullSolatTimes, ZONES_BY_STATE, getZoneByCoords } from '../services/solatService';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ms, enUS } from 'date-fns/locale';
import { useLanguage } from '../lib/LanguageContext';

export function JadualPage() {
  const { profile } = useAuth();
  const { t, language } = useLanguage();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedZone, setSelectedZone] = useState(profile?.zon_jakim || 'WLY01');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const zone = await getZoneByCoords(latitude, longitude);
          setSelectedZone(zone);
          setIsLocating(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLocating(false);
          alert(t('jadual.detect_error'));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      const data = await fetchFullSolatTimes(selectedZone);
      setSchedule(data);
      setLoading(false);
    }
    loadSchedule();
  }, [selectedZone]);

  const today = format(new Date(), 'yyyy-MM-dd');
  
  const filteredSchedule = schedule.filter(day => {
    // day.date is YYYY-MM-DD
    if (!day.date) return false;
    const dateParts = day.date.split('-');
    if (dateParts.length < 2) return false;
    const month = parseInt(dateParts[1], 10);
    return month === selectedMonth;
  });

  const months = language === 'ms' ? [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ] : [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateLocale = language === 'ms' ? ms : enUS;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-4 lg:space-y-6 pb-20 px-4"
    >
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden transition-colors">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
            <Calendar size={12} />
            NIYYAH • {t('jadual.subtitle')}
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-emerald-950 uppercase">{t('jadual.title')}</h2>
            <div className="flex flex-wrap items-center gap-4 text-slate-500">
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl group-focus-within:ring-2 ring-emerald-500/20 transition-colors">
                <MapPin size={16} className="text-emerald-600" />
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-800 outline-none focus:ring-0 cursor-pointer max-w-[150px] md:max-w-md truncate"
                >
                  {Object.entries(ZONES_BY_STATE).map(([state, zones]) => (
                    <optgroup key={state} label={state}>
                      {zones.map((zone) => (
                        <option key={zone.code} value={zone.code} className="bg-white">
                          {zone.code} - {zone.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <button 
                onClick={detectLocation}
                disabled={isLocating}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all disabled:opacity-50 border border-emerald-100"
              >
                {isLocating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                {isLocating ? t('jadual.locating') : t('jadual.location_btn')}
              </button>
              
              <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl transition-colors">
              <Calendar size={16} className="text-emerald-600" />
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent font-bold text-xs text-slate-800 outline-none focus:ring-0 cursor-pointer"
              >
                {months.map((name, i) => (
                  <option key={i} value={i + 1} className="bg-white">{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
          <Download size={18} /> {t('jadual.print')}
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('jadual.date_day')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.imsak')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.subuh')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.syuruk')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.zohor')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.asar')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.maghrib')}</th>
                <th className="px-6 py-4 text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('jadual.isyak')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    ))}
                  </tr>
                ))
              ) : (
                filteredSchedule.map((day, idx) => (
                  <tr 
                    key={idx} 
                    className={cn(
                      "hover:bg-slate-50 transition-colors group",
                      day.date === today ? "bg-emerald-50/50" : ""
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-800">{format(new Date(day.date), 'dd MMM yyyy', { locale: dateLocale })}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{day.dayName} • {day.hijri}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{day.imsak}</td>
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">{day.fajr}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{day.syuruk}</td>
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">{day.dhuhr}</td>
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">{day.asr}</td>
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">{day.maghrib}</td>
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">{day.isya}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
        {t('jadual.footer')}
      </p>
    </motion.div>
  );
}

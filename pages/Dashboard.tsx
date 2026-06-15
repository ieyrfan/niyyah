import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Calendar as CalendarIcon, ChevronRight, Book, Sparkles, Droplets, Loader2, Info, Award, Search, X, Heart } from 'lucide-react';
import { fetchSolatTimes, ZONES, getNearestPrayer, getZoneByCoords } from '../services/solatService';
import { fetchRandomHadis, HadisDetail } from '../services/hadisService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../lib/AuthContext';
import { SolatData } from '../types';
import { format } from 'date-fns';
import { ms, enUS } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { useTheme } from '../lib/ThemeContext';
import { STATIC_DOA } from '../data/doaContent';

import { findNearbyMosques, Mosque } from '../services/mosqueService';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [solatData, setSolatData] = useState<SolatData | null>(null);
  const [hadith, setHadith] = useState<HadisDetail | null>(null);
  const [dailyDoa, setDailyDoa] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState(profile?.zon_jakim || 'WLY01');
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [relevantPrayer, setRelevantPrayer] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zikrCount, setZikrCount] = useState(0);
  const [activeZikr, setActiveZikr] = useState("SubhanAllah");
  const [nearbyMosques, setNearbyMosques] = useState<Mosque[]>([]);
  const [mosqueLoading, setMosqueLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  const zikrs = [
    "SubhanAllah",
    "Alhamdulillah",
    "Allahu Akbar",
    "La ilaha illallah",
    "Astaghfirullah"
  ];

  const filteredZones = Object.entries(ZONES)
    .filter(([code, name]) => 
      name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      code.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const detectLocation = async (force = false) => {
    if (!("geolocation" in navigator)) {
      setShowSearch(true);
      return;
    }
    
    // If not forced and we already have a zone from profile, don't detect
    if (!force && profile?.zon_jakim) {
      setSelectedZone(profile.zon_jakim);
      return;
    }

    setIsLocating(true);
    setLocationStatus("Mencari zon anda...");
    
    // Use a timeout to not keep the user waiting forever
    const geoTimeout = setTimeout(() => {
      if (isLocating) {
        setIsLocating(false);
        setLocationStatus("Lokasi lambat dikesan. Sila pilih manual.");
      }
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(geoTimeout);
        try {
          const { latitude, longitude } = position.coords;
          const zone = await getZoneByCoords(latitude, longitude);
          if (zone) {
            setSelectedZone(zone);
            const zoneFullName = ZONES[zone] || zone;
            const zoneName = zoneFullName.split('(')[1]?.replace(')', '') || zoneFullName;
            setLocationStatus(`Zon dikesan: ${zoneName}`);
            setTimeout(() => setLocationStatus(null), 5000);
          } else {
            setShowSearch(true);
            setLocationStatus("Sila pilih zon secara manual");
          }
        } catch (err) {
          setLocationStatus("Gagal mengesan lokasi");
          setShowSearch(true);
          console.error("Location detection failed:", err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setIsLocating(false);
        if (force || !profile?.zon_jakim) {
          setShowSearch(true);
          setLocationStatus(error.code === 1 ? "Akses lokasi ditolak" : "Gagal mengesan lokasi");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const clockTimer = setInterval(() => {
      const tz = profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
      setCurrentTime(now);
      if (solatData) {
        setRelevantPrayer(getNearestPrayer(solatData.prayerTimes, now));
      }
    }, 1000);
    return () => clearInterval(clockTimer);
  }, [solatData, profile?.timezone]);

  useEffect(() => {
    detectLocation(false);
  }, [profile?.zon_jakim]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchSolatTimes(selectedZone, language);
        setSolatData(data);
        const tz = profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));
        setRelevantPrayer(getNearestPrayer(data.prayerTimes, now));
        
        if (profile?.notification_settings) {
          notificationService.schedulePrayerReminders(data.prayerTimes, profile.notification_settings);
          notificationService.scheduleSunnahReminders(profile.notification_settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    async function loadHadith() {
      try {
        const h = await fetchRandomHadis();
        setHadith(h);
      } catch (err) {
        console.error(err);
      }
    }
    loadHadith();

    // Select a semi-random doa based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const doaIndex = dayOfYear % STATIC_DOA.length;
    setDailyDoa(STATIC_DOA[doaIndex]);

    async function loadMosques() {
      if (!("geolocation" in navigator)) return;
      setMosqueLoading(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const mosques = await findNearbyMosques(pos.coords.latitude, pos.coords.longitude);
        setNearbyMosques(mosques.slice(0, 5));
        setMosqueLoading(false);
      }, () => setMosqueLoading(false));
    }
    loadMosques();
  }, [selectedZone, language]);

  const isFriday = currentTime.getDay() === 5;
  const isMale = profile?.jantina !== 'perempuan'; // Default to male if not set

  const prayerIcons: Record<string, string> = {
    fajr: t('prayer.fajr'),
    syuruk: t('prayer.syuruk'),
    dhuhr: isFriday && isMale ? (language === 'ms' ? 'Solat Jumaat' : 'Friday Prayer') : t('prayer.dhuhr'),
    asr: t('prayer.asr'),
    maghrib: t('prayer.maghrib'),
    isha: t('prayer.isha')
  };

  const dateLocale = language === 'ms' ? ms : enUS;

  return (
    <div className="max-w-[1024px] mx-auto pb-10">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-50 -mx-4 px-4 bg-slate-50/70 backdrop-blur-2xl border-b border-slate-200/40 py-4 transition-all duration-300">
        <section className="flex items-center justify-between gap-4 max-w-[1024px] mx-auto">
          <div className="space-y-0.5">
            <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-emerald-950 flex items-center gap-2">
              Niyyah <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            </h2>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              {profile?.nama_paparan 
                ? t('dash.greeting').replace('{name}', profile.nama_paparan)
                : t('dash.greeting_default')}
            </p>
          </div>

          <div className="flex-1 max-w-[400px] hidden md:block">
            <div 
              onClick={() => setShowSearch(true)}
              className="group relative flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 rounded-full transition-all cursor-pointer shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-emerald-500/10"
            >
              <div className="absolute inset-0 bg-emerald-50/0 group-hover:bg-emerald-50/50 rounded-full transition-colors" />
              <div className="relative z-10 w-8 h-8 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 transition-all group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500">
                <Search size={14} className="stroke-[3px]" />
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-xs font-bold text-slate-500 tracking-wide group-hover:text-emerald-950 transition-colors truncate">
                  {solatData ? (ZONES[solatData.zone] || solatData.zone) : 'Cari Zon / Lokasi...'}
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg shadow-sm uppercase tracking-tighter">
                  ⌘ K
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-xl font-bold text-emerald-950 font-mono tracking-tight leading-none">
                  {format(currentTime, 'HH:mm')}
                </span>
                <span className="text-xs text-emerald-600 font-bold tracking-wide mt-1">
                  {solatData ? solatData.hijri : '...'}
                </span>
             </div>
             <button 
              onClick={() => navigate('/tetapan')}
              className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center text-white shadow-lg shadow-emerald-950/20 hover:scale-105 transition-transform"
             >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-800">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-emerald-300 text-xs">
                      {profile?.nama_paparan?.[0] || user?.email?.[0] || 'U'}
                    </div>
                  )}
                </div>
             </button>
          </div>
        </section>

        {/* Mobile Location Tab */}
        <div className="md:hidden mt-4 px-1">
          <button 
            onClick={() => setShowSearch(true)}
            className="w-full relative group active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4 px-5 py-3.5 bg-white border border-slate-200 rounded-[22px] shadow-[0_4px_15px_-3px_rgba(0,0,0,0.08)]">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <MapPin size={18} className="stroke-[2.5px]" />
              </div>
              <div className="flex-1 flex flex-col items-start gap-1">
                <span className="text-xs font-bold text-emerald-950 tracking-wide truncate max-w-[200px]">
                  {solatData ? (ZONES[solatData.zone] || solatData.zone) : 'Kuala Lumpur'}
                </span>
                <span className="text-[10px] font-medium text-slate-500">Ketik untuk tukar zon solat</span>
              </div>
              <Search size={18} className="text-slate-300 stroke-[2.5px]" />
            </div>
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 lg:space-y-6 mt-6 px-4"
      >
        {/* Search Modal */}
        {showSearch && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                <Search className="text-slate-400" size={20} />
                <input 
                  autoFocus
                  placeholder="Cari Zon JAKIM (e.g. WLY01, Kuala Lumpur...)"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold uppercase tracking-widest h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => {
                    setIsLocating(true);
                    detectLocation(true);
                    setShowSearch(false);
                  }}
                  className="p-2 hover:bg-emerald-50 rounded-xl text-emerald-600 transition-all flex items-center gap-2 group"
                >
                  <MapPin size={16} className={cn(isLocating && "animate-bounce")} />
                  <span className="text-[10px] font-black uppercase hidden sm:inline">Auto</span>
                </button>
                <button onClick={() => setShowSearch(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
                {filteredZones.length > 0 ? (
                  filteredZones.map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setSelectedZone(code);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group",
                        selectedZone === code && "bg-emerald-50"
                      )}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-widest">{name}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">{code}</span>
                      </div>
                      {selectedZone === code && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Tiada zon ditemui</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Info Banner & Manual Trigger */}
        {(locationStatus || (selectedZone === 'WLY01' && !profile?.zon_jakim)) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="flex flex-col gap-2"
          >
            {locationStatus && (
              <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20">
                <MapPin size={16} className="animate-bounce" />
                <span className="text-xs font-bold tracking-wide">{locationStatus}</span>
              </div>
            )}
            
            {(!profile?.zon_jakim) && (
              <button 
                onClick={() => setShowSearch(true)}
                className="bg-white border border-emerald-100 text-emerald-600 px-6 py-3 rounded-2xl flex items-center justify-between group hover:bg-emerald-50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <Search size={14} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-emerald-950 tracking-wide">Pilih Lokasi Manual</p>
                    <p className="text-[10px] font-medium text-slate-500">Klik untuk ketepatan waktu solat anda</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>
        )}

        {/* Learning Journey Scroll */}

         <section className="mt-8 mb-4">
            <div className="flex items-center justify-between px-2 mb-4">
               <h3 className="text-xs font-bold text-slate-500 tracking-wide uppercase">Hab Pengetahuan</h3>
               <button onClick={() => navigate('/quran')} className="text-xs font-bold text-emerald-600 hover:underline transition-all">Lihat Semua</button>
            </div>
           <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6">
              {[
                { title: 'Iqra\' Digital', icon: <Book size={18} />, path: '/iqra', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                { title: 'Sirah Nabi', icon: <Sparkles size={18} />, path: '/sirah', color: 'bg-amber-50 text-amber-600 border-amber-100' },
                { title: 'Muqaddam', icon: <Book size={18} />, path: '/muqaddam', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { title: 'Zakat Hub', icon: <Droplets size={18} />, path: '/zakat', color: 'bg-rose-50 text-rose-600 border-rose-100' },
                { title: 'Kelas Live', icon: <Info size={18} />, path: '/kelas', color: 'bg-blue-50 text-blue-600 border-blue-100' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(m.path)}
                  className={cn(
                    "flex-shrink-0 w-36 h-40 rounded-[2rem] p-6 border-2 flex flex-col justify-between cursor-pointer transition-all shadow-xl shadow-transparent hover:shadow-slate-200/50",
                    m.color
                  )}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    {m.icon}
                  </div>
                  <span className="text-sm font-bold text-center tracking-tight leading-tight px-2">{m.title}</span>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Nearby Mosques */}
        {(nearbyMosques.length > 0 || mosqueLoading) && (
          <section className="mb-8 overflow-hidden">
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center gap-2">
                 <MapPin size={16} className="text-emerald-600" />
                 <h3 className="text-xs font-bold text-slate-500 tracking-wide uppercase">Masjid Berhampiran</h3>
              </div>
              {nearbyMosques.length > 0 && (
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-bold text-emerald-600 tracking-wide">Radius 5KM</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 relative">
              {mosqueLoading && nearbyMosques.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 h-32 bg-slate-100 rounded-3xl animate-pulse" />
                ))
              ) : (
                nearbyMosques.map((mosque) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={mosque.id}
                    className="flex-shrink-0 w-64 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50/50 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-emerald-100 transition-colors"></div>
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <MapPin size={14} />
                      </div>
                      <span className="text-[9px] font-black text-emerald-600/40 font-mono tracking-tighter">{(mosque.distance || 0).toFixed(1)} KM</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-normal line-clamp-1 mb-4 group-hover:text-emerald-700 transition-colors relative z-10 text-center">
                      {mosque.name}
                    </h4>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10 active:scale-95"
                    >
                      Buka Peta <ChevronRight size={14} />
                    </a>
                  </motion.div>
                ))
              )}
            </div>
          </section>
        )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Next Prayer Card */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-4 lg:gap-6">
          <div className="bg-emerald-950 text-white rounded-[2rem] p-8 flex flex-col justify-between h-[300px] lg:h-[340px] shadow-3xl shadow-emerald-950/20 transition-all hover:scale-[1.01] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/20 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-emerald-600/30 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                {relevantPrayer?.isPast ? t('dash.prayer_current') : t('dash.prayer_next')}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-xs font-bold uppercase tracking-widest">LIVE</span>
              </div>
            </div>
            
            <div className="mt-6 relative z-10 text-center lg:text-left">
              <h2 className="text-5xl lg:text-7xl font-bold tracking-tight">
                {relevantPrayer?.id ? t(`prayer.${relevantPrayer.id}`) : '...'}
              </h2>
              <p className="text-emerald-400 text-sm mt-3 font-bold tracking-wide leading-relaxed">
                {relevantPrayer ? (
                  relevantPrayer.isPast 
                    ? t('dash.prayer_running').replace('{time}', Math.abs(relevantPrayer.diff).toString())
                    : relevantPrayer.totalDiffSeconds > 3600 
                      ? t('dash.prayer_remaining').replace('{time}', `${Math.floor(relevantPrayer.totalDiffSeconds / 3600)}j ${Math.floor((relevantPrayer.totalDiffSeconds % 3600) / 60)}m`) 
                      : t('dash.prayer_remaining').replace('{time}', `${Math.floor(relevantPrayer.totalDiffSeconds / 60)}m`)
                ) : t('dash.prayer_waiting')}
              </p>
            </div>

            <div className="flex items-baseline justify-center lg:justify-start gap-3 mt-4 relative z-10">
              <span className="text-5xl lg:text-6xl font-mono font-bold tracking-tight">{relevantPrayer?.time || '--:--'}</span>
              <span className="text-sm opacity-40 uppercase font-bold tracking-widest">
                {relevantPrayer?.time && parseInt(relevantPrayer.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
              </span>
            </div>

            <button 
              onClick={() => navigate('/jadual')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl mt-6 text-sm tracking-wide shadow-xl shadow-emerald-500/20 transition-all active:scale-95 relative z-10"
            >
              {t('dash.widget_btn')}
            </button>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 flex-1 flex flex-col shadow-2xl shadow-slate-200/10 group transition-colors">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center lg:text-left">{t('dash.jadual_today')}</h3>
            <div className="space-y-3">
              {solatData && Object.entries(solatData.prayerTimes).map(([key, time]) => (
                <div key={key} className={cn(
                  "flex justify-between items-center text-sm px-5 py-3.5 transition-all rounded-2xl group",
                  relevantPrayer?.id === key 
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-[1.02]" 
                    : "hover:bg-slate-50 text-slate-500"
                )}>
                  <span className={cn("font-bold tracking-wide", relevantPrayer?.id === key ? "text-white" : "text-slate-900")}>
                    {prayerIcons[key]}
                  </span>
                  <span className={cn("font-mono font-bold", relevantPrayer?.id === key ? "text-white" : "text-slate-500")}>
                    {time}
                  </span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/jadual')}
              className="mt-10 w-full flex items-center justify-center gap-3 py-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl text-xs font-bold text-slate-500 hover:text-emerald-600 tracking-wide transition-all"
            >
              {t('dash.jadual_full')} <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* Center Section: Quran Verse & Hadith/Stories */}
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          <div className="bg-white rounded-[3rem] border border-slate-100 p-8 lg:p-12 flex-1 flex flex-col shadow-2xl shadow-slate-200/10 transition-all hover:bg-slate-50/10">
            <div className="flex justify-between items-center mb-10 lg:mb-12">
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{t('dash.ayat_title')}</span>
              <span className="text-xs font-bold text-emerald-800 tracking-wide px-5 py-2 bg-emerald-100 rounded-full border border-emerald-200">Al-Baqarah: 153</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center px-4 lg:px-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 lg:w-[400px] h-80 lg:h-[400px] bg-emerald-50/50 blur-[100px] rounded-full -z-10 animate-pulse"></div>
              <p className="text-4xl lg:text-7xl font-arabic text-emerald-950 leading-[1.7] mb-8 lg:mb-10 selection:bg-emerald-200" dir="rtl">
                يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ ٱسْتَعِينُواْ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّٰبِرِينَ
              </p>
              <div className="text-slate-800 text-lg lg:text-2xl leading-relaxed max-w-2xl font-serif text-center font-medium">
                <span className="text-emerald-600 font-bold mr-2 text-2xl">"</span>
                {t('dash.ayat_verse')}
                <span className="text-emerald-600 font-bold ml-2 text-2xl">"</span>
              </div>
            </div>

            <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-6">
              <button className="flex-1 bg-slate-50 hover:bg-emerald-50 py-5 rounded-2xl text-sm font-bold text-slate-500 hover:text-emerald-600 transition-all border border-transparent">
                {t('dash.tafsir_btn')}
              </button>
              <button className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all hover:bg-emerald-700 shadow-xl shadow-emerald-600/10 active:scale-95">
                {t('dash.audio_btn')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div 
              onClick={() => navigate('/hadis')}
              className="bg-[#fefce8] rounded-[2.5rem] p-8 lg:p-10 border border-amber-100 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 shadow-sm">
                    <Book size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">{t('dash.hadis_title')}</span>
                </div>
                <p className="text-lg lg:text-2xl text-amber-950 font-medium leading-relaxed italic font-serif">
                  {hadith ? `"${hadith.translation}"` : t('dash.hadis_loading')}
                </p>
              </div>
              {hadith && (
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700/60">— {hadith.attribution}</span>
                  <span className="text-xs font-medium text-amber-500/20 italic">{hadith.id}</span>
                </div>
              )}
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onClick={() => dailyDoa && navigate('/doa')}
                  className="bg-emerald-600 rounded-[2rem] p-6 text-white flex flex-col justify-between group cursor-pointer hover:shadow-3xl transition-all active:scale-[0.98] border-2 border-emerald-500 shadow-xl shadow-emerald-600/20 md:col-span-2"
                >
                   <div className="flex justify-between items-start">
                     <div>
                       <p className="text-[7px] font-black uppercase tracking-[0.4em] opacity-60 mb-2">Doa Pilihan Hari Ini</p>
                       <h3 className="text-base font-black uppercase italic leading-none">
                         {dailyDoa ? (language === 'ms' ? dailyDoa.title : (dailyDoa.title_en || dailyDoa.title)) : '...'}
                       </h3>
                     </div>
                     <Sparkles size={16} className="text-emerald-300" />
                   </div>
                   <p className="text-sm font-arabic leading-relaxed mt-4 opacity-90 line-clamp-2" dir="rtl">
                     {dailyDoa?.arabic}
                   </p>
                </div>

                <div 
                  onClick={() => navigate('/komuniti')}
                  className="bg-white rounded-[2rem] p-5 border border-slate-100 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                >
                   <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Sparkles size={16} />
                   </div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-900 uppercase italic leading-none">Komuniti</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Kongsi & Baca</p>
                   </div>
                </div>

                <div 
                  onClick={() => navigate('/asmaul-husna')}
                  className="bg-white rounded-[2rem] p-5 border border-slate-100 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                >
                   <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-3 group-hover:bg-rose-600 group-hover:text-white transition-all">
                      <Heart size={16} />
                   </div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-900 uppercase italic leading-none">Asmaul Husna</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">99 Nama Allah</p>
                   </div>
                </div>

                <div 
                  onClick={() => navigate('/kiblat')}
                  className="bg-white rounded-[2rem] p-5 border border-slate-100 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                >
                   <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-600 group-hover:text-white transition-all">
                      <MapPin size={16} />
                   </div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-900 uppercase italic leading-none">Arah Kiblat</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Guna Kompas</p>
                   </div>
                </div>

                <div 
                  onClick={() => navigate('/zikir')}
                  className="bg-white rounded-[2rem] p-5 border border-slate-100 flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                >
                   <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Droplets size={16} />
                   </div>
                   <div>
                      <h3 className="text-[11px] font-black text-slate-900 uppercase italic leading-none">E-Zikir</h3>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Zikir Pagi Petang</p>
                   </div>
                </div>

                <div 
                  className="bg-emerald-950 rounded-[2.5rem] p-8 text-white flex flex-col justify-between hover:shadow-2xl transition-all active:scale-[0.98] border border-emerald-900 col-span-2 relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center text-emerald-400">
                           <Info size={20} />
                         </div>
                         <h3 className="text-sm font-bold tracking-wide uppercase">Tasbih Digital</h3>
                      </div>
                      <span className="text-xs font-mono text-emerald-500 font-bold tracking-tight">{activeZikr}</span>
                   </div>
                   
                   <div className="flex items-center gap-6 relative z-10">
                      <div className="flex-1 bg-white/5 rounded-3xl p-8 flex items-center justify-center border border-white/5">
                         <span className="text-6xl font-bold font-mono tracking-tight text-emerald-400">{zikrCount}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setZikrCount(prev => prev + 1);
                        }}
                        className="w-24 h-24 bg-emerald-600 hover:bg-emerald-500 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-600/30 active:scale-90 transition-all cursor-pointer group"
                      >
                        <Sparkles size={40} className="text-white group-hover:scale-110 transition-transform" />
                      </button>
                   </div>
                   
                   <div className="mt-8 flex gap-8 relative z-10">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setZikrCount(0);
                        }}
                        className="text-sm font-bold text-emerald-700 hover:text-white transition-colors"
                      >
                        Set Semul
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextIdx = (zikrs.indexOf(activeZikr) + 1) % zikrs.length;
                          setActiveZikr(zikrs[nextIdx]);
                        }}
                        className="text-sm font-bold text-emerald-700 hover:text-white transition-colors ml-auto"
                      >
                        Tukar Zikir
                      </button>
                   </div>
                </div>

                <div 
                  onClick={() => navigate('/tetapan')}
                  className="bg-slate-50 rounded-[2rem] p-6 text-slate-900 border border-slate-200 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all active:scale-[0.98] col-span-2"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                        <Award size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold leading-tight">Ganjaran & Lencana</h3>
                        <p className="text-[10px] font-medium text-slate-500 tracking-wide mt-1">
                          Lihat Pencapaian
                        </p>
                      </div>
                   </div>
                   <div className="p-2 bg-white text-slate-300 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                     <ChevronRight size={16} />
                   </div>
                </div>
              </div>
          </div>
        </section>
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-200 flex flex-col items-center gap-6 pb-12">
        <button 
          onClick={() => navigate('/about')}
          className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          Mengenai Developer & Legal
        </button>
        <p className="text-[10px] font-medium text-slate-400 tracking-wide">© 2026 Muhammad Irfan Rizal — NIYYAH Ummah Enlightened</p>
      </footer>
    </motion.div>
  </div>
);
}

function ScrollText({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M10 9H8"/></svg>
  );
}

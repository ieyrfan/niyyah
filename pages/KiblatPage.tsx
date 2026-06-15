import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function KiblatPage() {
  const { t } = useLanguage();
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState(292.5); // Default for KL
  const [hasPermission, setHasPermission] = useState(false);
  const [manualZone, setManualZone] = useState('');
  const [loading, setLoading] = useState(false);

  const MECCA_LAT = 21.4225;
  const MECCA_LNG = 39.8262;

  const MALAYSIA_ZONES = [
    { name: 'Kuala Lumpur / Selangor', angle: 292 },
    { name: 'Johor Bahru', angle: 291 },
    { name: 'Penang', angle: 293 },
    { name: 'Kota Kinabalu', angle: 295 },
    { name: 'Kuching', angle: 294 },
    { name: 'Kelantan / Terengganu', angle: 291 },
    { name: 'Kedah / Perlis', angle: 294 }
  ];

  const calculateQibla = (lat: number, lng: number) => {
    const latRad = lat * Math.PI / 180;
    const mLatRad = MECCA_LAT * Math.PI / 180;
    const dLng = (MECCA_LNG - lng) * Math.PI / 180;

    const y = Math.sin(dLng);
    const x = Math.cos(latRad) * Math.tan(mLatRad) - Math.sin(latRad) * Math.cos(dLng);
    const qAngle = Math.atan2(y, x) * 180 / Math.PI;
    setQiblaAngle((qAngle + 360) % 360);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((pos) => {
        calculateQibla(pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
      }, (err) => {
        console.error("GPS Error:", err);
        setLoading(false);
      }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    }
  };

  useEffect(() => {
    if (!manualZone) {
      detectLocation();
    }

    if (manualZone) {
      const zone = MALAYSIA_ZONES.find(z => z.name === manualZone);
      if (zone) setQiblaAngle(zone.angle);
    }

    const handleOrientation = (e: any) => {
      let currentHeading = 0;
      if (e.webkitCompassHeading) {
        currentHeading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        currentHeading = 360 - e.alpha;
      }
      setHeading(currentHeading);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    if ((window as any).DeviceOrientationEvent && typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
        setHasPermission(false);
    } else {
        setHasPermission(true);
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [manualZone]);

  const requestPermission = async () => {
    if (typeof (window as any).DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await (window as any).DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') setHasPermission(true);
    }
  };

  const isAligned = Math.abs(heading - qiblaAngle) < 3 || Math.abs(heading - qiblaAngle) > 357;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-4 text-center pb-10"
    >
      <header>
        <h2 className={cn(
          "text-xl font-black tracking-tight uppercase italic underline underline-offset-4 decoration-2 transition-colors",
          isAligned ? "text-emerald-500 decoration-emerald-500" : "text-emerald-950 decoration-emerald-200"
        )}>
          {t('qibla.title')}
        </h2>
        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1.5">{t('qibla.subtitle')}</p>
        
        {isAligned && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-3 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/30 inline-block mx-auto"
          >
            Tepat Ke Arah Kiblat
          </motion.div>
        )}
           <select 
             value={manualZone}
             onChange={(e) => setManualZone(e.target.value)}
             className="w-full max-w-[240px] p-2.5 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-sm transition-all"
           >
             <option value="">Guna GPS (Automatik)</option>
             {MALAYSIA_ZONES.map(z => (
               <option key={z.name} value={z.name}>{z.name}</option>
             ))}
           </select>

           {!manualZone && (
             <button 
               onClick={detectLocation}
               disabled={loading}
               className="flex items-center gap-1.5 text-emerald-600 font-black text-[8.5px] uppercase tracking-widest hover:underline disabled:opacity-30"
             >
               {loading ? 'Mengesan...' : 'Cari Lokasi Semula'}
             </button>
           )}
      </header>

      <div className="relative w-56 h-56 mx-auto">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-[0.6rem] border-slate-100 rounded-full shadow-inner"></div>
        
        {/* Compass Dial */}
        <motion.div 
          animate={{ rotate: -heading }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Compass Marks */}
          {[0, 90, 180, 270].map(deg => (
            <div key={deg} className="absolute inset-0 flex flex-col items-center" style={{ rotate: `${deg}deg` }}>
               <span className="text-[10px] font-black text-slate-300 mt-2">
                 {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
               </span>
            </div>
          ))}

          {/* Qibla Indicator */}
          <div 
            className="absolute inset-0 flex flex-col items-center transition-all"
            style={{ rotate: `${qiblaAngle}deg` }}
          >
             <div className={cn(
               "w-2 h-32 rounded-full mt-4 flex items-start justify-center pt-2 transition-colors",
               isAligned ? "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]" : "bg-emerald-600"
             )}>
                <Navigation size={12} fill="white" className="text-white" />
             </div>
             <div className={cn(
               "mt-2 text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest transition-colors",
               isAligned ? "bg-emerald-400" : "bg-emerald-600"
             )}>
               {t('nav.kiblat')}
             </div>
          </div>
        </motion.div>

        {/* Static Center Point */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className={cn(
             "w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border transition-all",
             isAligned ? "text-emerald-500 border-emerald-400 scale-110" : "text-emerald-600 border-slate-100"
           )}>
              <Compass size={32} />
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-bold text-slate-700">{t('qibla.direction')}: <span className="text-emerald-600">{qiblaAngle.toFixed(1)}°</span></p>
        {!hasPermission && (
          <button 
            onClick={requestPermission}
            className="px-8 py-4 bg-emerald-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-lg"
          >
            {t('qibla.activate_btn')}
          </button>
        )}
        <p className="text-[10px] text-slate-400 max-w-xs mx-auto italic">
          {t('qibla.notice')}
        </p>
      </div>
    </motion.div>
  );
}

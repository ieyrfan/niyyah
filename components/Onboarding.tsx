import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Bell, Check, ArrowRight, X } from 'lucide-react';
import { ZONES } from '../services/solatService';
import { useAuth } from '../lib/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const { user, profile } = useAuth();
  const [zone, setZone] = useState(profile?.zon_jakim || 'WLY01');
  const [notifs, setNotifs] = useState({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    offset: 5 // minutes before
  });

  const handleFinish = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        zon_jakim: zone,
        notification_settings: notifs,
        onboarding_completed: true
      });
    }
    onComplete();
  };

  const steps = [
    {
      id: 1,
      title: 'Selamat Datang ke NIYYAH',
      desc: 'Platform Islamik holistik untuk perjalanan rohani anda yang lebih tersusun.',
      icon: <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mb-6">✨</div>
    },
    {
      id: 2,
      title: 'Zon Waktu Solat',
      desc: 'Pilih lokasi anda untuk mendapatkan waktu solat JAKIM yang tepat.',
      icon: <MapPin size={48} className="text-emerald-600 mb-6" />
    },
    {
      id: 3,
      title: 'Peringatan Azan',
      desc: 'Tetapkan peringatan agar anda tidak terlepas waktu solat berjemaah.',
      icon: <Bell size={48} className="text-emerald-600 mb-6" />
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={onComplete}
          className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center"
            >
              {steps[step-1].icon}
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{steps[step-1].title}</h2>
              <p className="text-slate-500 mt-2 text-sm max-w-xs">{steps[step-1].desc}</p>

              {/* Custom step content */}
              {step === 2 && (
                <div className="w-full mt-8 space-y-2">
                  <select 
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {Object.entries(ZONES).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                </div>
              )}

              {step === 3 && (
                <div className="w-full mt-8 grid grid-cols-2 gap-3">
                  {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setNotifs(prev => ({ ...prev, [p as any]: !((prev as any)[p]) }))}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                        (notifs as any)[p] 
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                          : "border-slate-100 text-slate-400"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-widest">{p}</span>
                      {(notifs as any)[p] && <Check size={14} />}
                    </button>
                  ))}
                  <div className="col-span-2 mt-4 p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2">Peringatan (Minit Sebelum)</p>
                    <input 
                      type="range" min="0" max="15" step="5"
                      value={notifs.offset}
                      onChange={(e) => setNotifs(prev => ({...prev, offset: parseInt(e.target.value)}))}
                      className="w-full accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] text-emerald-700 font-bold mt-1">
                      <span>On Time</span>
                      <span>5m</span>
                      <span>10m</span>
                      <span>15m</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((s) => (
                <div key={s.id} className={cn("h-1.5 rounded-full transition-all", step === s.id ? "w-8 bg-emerald-600" : "w-1.5 bg-slate-200")} />
              ))}
            </div>
            
            <button 
              onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
            >
              {step === 3 ? 'Selesai' : 'Seterusnya'} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

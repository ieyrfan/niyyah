import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, MapPin, Save, Shield, User, Globe, Info, Award, Book } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ZONES_BY_STATE } from '../services/solatService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { notificationService } from '../services/notificationService';
import { useLanguage } from '../lib/LanguageContext';
import { BadgeGallery } from '../components/BadgeGallery';
import { awardBadge } from '../services/badgeService';

const QARIS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murattal' },
  { id: 'ar.abdulsamad', name: 'AbdulBaset AbdulSamad', style: 'Murattal' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdur-Rahman as-Sudais', style: 'Murattal' },
  { id: 'ar.saoodshuraym', name: 'Saud Al-Shuraim', style: 'Murattal' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', style: 'Murattal' },
  { id: 'ar.husarymujawwad', name: 'Mahmoud Khalil Al-Husary', style: 'Mujawwad' },
];

const TIMEZONES = [
  'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Singapore', 'Asia/Jakarta', 
  'Asia/Dubai', 'Asia/Riyadh', 'Asia/London', 'America/New_York', 'America/Los_Angeles',
  'Australia/Sydney', 'Europe/Paris', 'Asia/Tokyo'
];

export function SettingsPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profil');
  
  const [formData, setFormData] = useState({
    nama_paparan: profile?.nama_paparan || '',
    zon_jakim: profile?.zon_jakim || 'WLY01',
    preferred_qari: profile?.preferred_qari || 'ar.alafasy',
    timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kuala_Lumpur',
    notification_settings: profile?.notification_settings || {
      fajr: true,
      dhuhr: true,
      asr: true,
      maghrib: true,
      isha: true,
      sunnah_reminders: true,
      offset: 5
    }
  });

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        updated_at: new Date().toISOString()
      });
      
      // Request permission if not granted
      if (Notification.permission !== 'granted') {
        await notificationService.requestPermission();
      }

      // Check for profile hero badge
      if (formData.nama_paparan && formData.zon_jakim) {
        await awardBadge(user.uid, 'profile_hero');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id: 'profil', label: t('settings.profile'), icon: User },
    { id: 'quran', label: 'Al-Quran', icon: Book },
    { id: 'notifikasi', label: t('settings.notifications'), icon: Bell },
    { id: 'badges', label: 'Lencana', icon: Award },
    { id: 'bahasa', label: t('settings.language'), icon: Globe },
    { id: 'support', label: 'Infaq / Support', icon: Shield },
    { id: 'about', label: 'About & Legal', icon: Info },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20 px-4"
    >
      <header>
        <h2 className="text-4xl font-bold tracking-tight text-emerald-950 underline decoration-emerald-200 decoration-4 uppercase">{t('settings.title')}</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">{t('settings.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="space-y-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'about') {
                  navigate('/about');
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === item.id ? "bg-white shadow-sm border border-slate-100 text-emerald-700" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="lg:col-span-2 space-y-6">
          {activeTab === 'profil' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-sm tracking-tight">{user?.email}</h3>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">{t('settings.status_active')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('settings.display_name')}</label>
                  <input 
                    type="text" 
                    value={formData.nama_paparan}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama_paparan: e.target.value }))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                 <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('settings.location')}</label>
                  <select 
                    value={formData.zon_jakim}
                    onChange={(e) => setFormData(prev => ({ ...prev, zon_jakim: e.target.value }))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {Object.entries(ZONES_BY_STATE).map(([state, zones]) => (
                      <optgroup key={state} label={state}>
                        {zones.map((zone) => (
                          <option key={zone.code} value={zone.code}>
                            {zone.code} - {zone.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Timezone</label>
                  <select 
                    value={formData.timezone}
                    onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quran' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
              <header className="border-b border-slate-50 pb-6">
                <h3 className="text-lg font-bold text-emerald-950 uppercase tracking-tight">Pilihan Qari</h3>
                <p className="text-xs text-slate-400 font-medium">Pilih Qari kegemaran anda untuk bacaan audio Al-Quran.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QARIS.map((qari) => (
                  <button
                    key={qari.id}
                    onClick={() => setFormData(prev => ({ ...prev, preferred_qari: qari.id }))}
                    className={cn(
                      "flex flex-col text-left p-6 rounded-[2rem] border-2 transition-all hover:shadow-md",
                      formData.preferred_qari === qari.id 
                        ? "border-emerald-600 bg-emerald-50/50" 
                        : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-black uppercase tracking-widest mb-1",
                      formData.preferred_qari === qari.id ? "text-emerald-700" : "text-slate-400"
                    )}>
                      {qari.style}
                    </span>
                    <span className="text-lg font-bold text-slate-900">{qari.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bahasa' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('settings.language')}</h3>
              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => setLanguage('ms')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                     language === 'ms' ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-50 bg-slate-50 text-slate-400"
                  )}
                 >
                   Bahasa Melayu
                 </button>
                 <button 
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest",
                     language === 'en' ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-slate-50 bg-slate-50 text-slate-400"
                  )}
                 >
                   English
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'notifikasi' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8">
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Peringatan Waktu Solat</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        notification_settings: { 
                          ...prev.notification_settings, 
                          [p]: !((prev.notification_settings as any)[p]) 
                        } 
                      }))}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                        (formData.notification_settings as any)[p] 
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                          : "border-slate-50 bg-slate-50 text-slate-300"
                      )}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t(`prayer.${p}`)}</span>
                      {(formData.notification_settings as any)[p] && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Lain-lain Peringatan</h3>
                <button
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    notification_settings: { 
                      ...prev.notification_settings, 
                      sunnah_reminders: !prev.notification_settings.sunnah_reminders 
                    } 
                  }))}
                  className={cn(
                    "w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all",
                    formData.notification_settings.sunnah_reminders 
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold" 
                      : "border-slate-50 bg-slate-50 text-slate-400"
                  )}
                >
                  <div className="text-left">
                    <span className="text-sm font-bold block">Peringatan Sunnah Harian</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">Puasa, Zikir, & Adab-adab</span>
                  </div>
                  {formData.notification_settings.sunnah_reminders && <div className="w-3 h-3 rounded-full bg-emerald-600" />}
                </button>
              </div>

              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('settings.reminder_before')}</span>
                    <span className="text-sm font-black text-emerald-700">{formData.notification_settings.offset} {t('settings.minutes')}</span>
                  </div>
                  <input 
                    type="range" min="0" max="15" step="5"
                    value={formData.notification_settings.offset}
                    onChange={(e) => setFormData(prev => ({
                      ...prev, 
                      notification_settings: { ...prev.notification_settings, offset: parseInt(e.target.value) }
                    }))}
                    className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="bg-emerald-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Koleksi Lencana</h3>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest opacity-80">Pencapaian Ruhani & Ibadah Anda</p>
                  
                  <div className="mt-8 flex gap-8">
                    <div>
                      <span className="block text-4xl font-black italic">{(profile?.badges || []).length}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Lencana Dimiliki</span>
                    </div>
                    <div>
                      <span className="block text-4xl font-black italic">{(profile?.badges || []).length * 100}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Niyyah Points</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                  <Award size={200} strokeWidth={1} />
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <BadgeGallery earnedBadgeIds={profile?.badges || []} />
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-8 text-center py-12">
               <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={40} />
               </div>
               <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic">{t('settings.support_title')}</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    {t('settings.support_desc')}
                  </p>
               </div>
               <a 
                href="https://sedekah.je/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-amber-500/20 active:scale-95"
               >
                 {t('settings.support_btn')}
               </a>
            </div>
          )}

          {activeTab !== 'support' && activeTab !== 'about' && (
            <div className="flex justify-end gap-4 items-center">
              {saved && <span className="text-emerald-600 font-bold text-xs animate-pulse">{t('settings.success')}</span>}
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
              >
                <Save size={16} />
                {loading ? t('settings.saving') : t('settings.save_btn')}
              </button>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
}

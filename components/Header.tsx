import React, { useState } from 'react';
import { Search, Bell, User, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 lg:left-[180px] right-0 h-14 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-40 px-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-3">
        {/* Mobile search is different */}
        <div className="hidden lg:block">
           <h1 className="text-xl font-bold text-emerald-600 tracking-tight transition-colors">Niyyah</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
         <button 
           onClick={() => setShowSearch(true)}
           className="p-2.5 bg-slate-50 text-slate-500 hover:text-emerald-600 rounded-xl transition-all"
         >
           <Search size={18} />
         </button>
         <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-rose-500 rounded-xl transition-all relative">
           <Bell size={18} />
           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
         </button>
         <button 
           onClick={() => navigate('/tetapan')}
           className="w-10 h-10 bg-emerald-600 rounded-xl overflow-hidden shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center text-white"
         >
           {profile?.avatar_url ? (
             <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
           ) : (
             <User size={16} />
           )}
         </button>
      </div>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[100] p-6 md:p-20 flex flex-col items-center"
          >
            <button 
              onClick={() => setShowSearch(false)}
              className="absolute top-10 right-10 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
            >
              <X size={32} />
            </button>
            
            <div className="w-full max-w-2xl space-y-12">
               <div className="space-y-4 text-center">
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">Cari di Niyyah</h2>
                  <p className="text-white/40 text-xs font-black uppercase tracking-widest">Apa yang anda ingin cari hari ini?</p>
               </div>

               <div className="relative">
                  <input 
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Contoh: Cara Solat, Surah Al-Kahfi, Zakat..."
                    className="w-full py-8 md:py-12 bg-white/5 border-2 border-white/10 rounded-[3rem] px-12 md:px-20 text-2xl md:text-4xl font-black text-white outline-none focus:border-emerald-500/50 transition-all"
                  />
                  <Search size={40} className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-white/20" />
               </div>

               {searchQuery && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-emerald-500/10 cursor-pointer transition-all">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Modul Mualaf</p>
                       <p className="text-lg font-bold text-white uppercase italic tracking-tight">Panduan Solat Lengkap</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-emerald-500/10 cursor-pointer transition-all">
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Al-Quran</p>
                       <p className="text-lg font-bold text-white uppercase italic tracking-tight">Surah Al-Kahfi</p>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

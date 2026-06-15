import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  Video, 
  Star, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  Plus, 
  Users,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { classService, OnlineClass, OnlineClassCategory, OnlineClassLevel } from '../services/classService';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';

export function KelasHome() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'semua' | 'percuma' | 'berbayar'>('semua');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadClasses();
    loadFavorites();
  }, []);

  async function loadClasses() {
    setLoading(true);
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    if (!user) return;
    try {
      const favs = await classService.getFavorites();
      setFavorites(favs.map((f: any) => f.class_id));
    } catch (err) {
      console.error(err);
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent, classId: string) => {
    e.stopPropagation();
    if (!user) return;
    try {
      const isFav = await classService.toggleFavorite(classId);
      if (isFav) {
        setFavorites([...favorites, classId]);
      } else {
        setFavorites(favorites.filter(id => id !== classId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cls.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cls.kategori === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || cls.tahap === selectedLevel;
    const matchesPrice = priceFilter === 'semua' || 
                         (priceFilter === 'percuma' && cls.harga === 0) || 
                         (priceFilter === 'berbayar' && cls.harga > 0);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto space-y-10 pb-20"
    >
      {/* Hero Header */}
      <header className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30">
            <Sparkles size={14} className="text-indigo-400" />
            {t('kelas.tag')}
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight uppercase italic decoration-indigo-500 decoration-4 underline-offset-8">
            Hab <span className="text-indigo-400 font-serif lowercase italic">Ilmu</span> Niyyah
          </h2>
          <p className="text-indigo-100/60 max-w-xl text-lg font-medium leading-relaxed">
            {t('kelas.desc')}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <button 
               onClick={() => navigate('/kelas/dashboard')}
               className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 shadow-xl shadow-white/5 transition-all"
             >
               {t('kelas.my_classes')}
             </button>
             <button 
               onClick={() => navigate('/kelas/baru')}
               className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
             >
               <Plus size={16} />
               {t('kelas.create_new')}
             </button>
          </div>
        </div>
        <div className="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
           <BookOpen className="w-full h-full scale-150 rotate-12" />
        </div>
      </header>

      {/* Filters Bar */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder={t('kelas.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
             {/* Category Filter */}
             <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-slate-50 px-6 py-4 pr-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none border-none hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <option value="all">{t('kelas.all_categories')}</option>
                  {Object.values(OnlineClassCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
             </div>

             {/* Level Filter */}
             <div className="relative">
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="appearance-none bg-slate-50 px-6 py-4 pr-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none border-none hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <option value="all">{t('kelas.all_levels')}</option>
                  {Object.values(OnlineClassLevel).map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
             </div>

             {/* Price Sort */}
             <div className="flex bg-slate-50 p-1.5 rounded-[1.5rem]">
                {(['semua', 'percuma', 'berbayar'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      priceFilter === p ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-indigo-400"
                    )}
                  >
                    {t(`kelas.filter_${p}`)}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Grid View */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-[400px] bg-slate-100 rounded-[3rem] animate-pulse"></div>
           ))}
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredClasses.map((cls, idx) => (
             <motion.div
               key={cls.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               whileHover={{ y: -8, scale: 1.01 }}
               onClick={() => navigate(`/kelas/${cls.id}`)}
               className="group bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-indigo-100 transition-all cursor-pointer overflow-hidden flex flex-col relative"
             >
                {/* Image Placeholder/Thumbnail */}
                <div className="h-48 w-full bg-slate-50 relative overflow-hidden">
                   {cls.gambar_url ? (
                     <img src={cls.gambar_url} alt={cls.nama_kelas} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white text-indigo-200">
                        <BookOpen size={64} className="opacity-20 translate-y-4 -rotate-12" />
                     </div>
                   )}
                   <div className="absolute top-6 left-6 flex gap-2">
                      <div className="px-4 py-2 bg-indigo-600/90 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                        {cls.kategori}
                      </div>
                      <div className="px-4 py-2 bg-white/90 backdrop-blur-md text-slate-800 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border border-slate-100">
                        {cls.tahap}
                      </div>
                   </div>
                   <button 
                     onClick={(e) => handleToggleFavorite(e, cls.id!)}
                     className={cn(
                       "absolute top-6 right-6 w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                       favorites.includes(cls.id!) ? "bg-rose-500 text-white" : "bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500"
                     )}
                   >
                     <Bookmark size={18} fill={favorites.includes(cls.id!) ? "currentColor" : "none"} />
                   </button>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col">
                   <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {cls.nama_kelas}
                      </h3>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                           {cls.instructor_name[0]}
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cls.instructor_name}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold">{cls.hari}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold">{cls.masa_mula}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold">{cls.kapasiti ? `${cls.kapasiti} ${t('kelas.students')}` : t('kelas.unlimited')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        {cls.link_meeting.includes('zoom') ? <Video size={14} className="text-indigo-400" /> : <Video size={14} className="text-indigo-400" />}
                        <span className="text-[10px] font-bold uppercase truncate">{new URL(cls.link_meeting).hostname.replace('www.', '')}</span>
                      </div>
                   </div>

                   <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg text-amber-600">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-black">4.9</span>
                        <span className="text-[9px] font-bold text-amber-400">(28)</span>
                      </div>
                      <div className="text-lg font-black text-indigo-600">
                        {cls.harga === 0 ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] tracking-widest uppercase">{t('kelas.free_label')}</span>
                        ) : (
                          `RM${cls.harga}`
                        )}
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="p-20 text-center space-y-6 bg-white rounded-[4rem] border-2 border-slate-50">
           <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Search size={48} className="text-slate-200" />
           </div>
           <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">{t('kelas.empty_title')}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{t('kelas.empty_desc')}</p>
           </div>
           <button 
             onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedLevel('all'); setPriceFilter('semua'); }}
             className="px-8 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
           >
             {t('kelas.reset_btn')}
           </button>
        </div>
      )}
    </motion.div>
  );
}

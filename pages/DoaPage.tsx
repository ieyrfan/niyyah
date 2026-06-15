import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, Bookmark, Share2, Plus, X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { useLanguage } from '../lib/LanguageContext';
import { STATIC_DOA } from '../data/doaContent';

export function DoaPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [userDoas, setUserDoas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'Semua', label: t('doa.all') },
    { id: 'Harian', label: t('doa.category.daily') },
    { id: 'Solat', label: t('doa.category.prayer') },
    { id: 'Perlindungan', label: t('doa.category.protection') || 'Perlindungan' },
    { id: 'Kesihatan', label: t('doa.category.health') || 'Kesihatan' },
    { id: 'Ilmu & Rezeki', label: t('doa.category.knowledge') || 'Ilmu & Rezeki' },
    { id: 'Para Nabi', label: t('doa.category.prophets') },
  ];
  
  // Form State
  const [newDoa, setNewDoa] = useState({
    title: '',
    arabic: '',
    transliteration: '',
    translation: '',
    category: 'Harian'
  });

  useEffect(() => {
    if (user) {
      fetchUserDoas();
    }
  }, [user]);

  const fetchUserDoas = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'users', user.uid, 'koleksi_doa'));
      const querySnapshot = await getDocs(q);
      const doas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserDoas(doas);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'users', user.uid, 'koleksi_doa'), {
        title: newDoa.title,
        arabic: newDoa.arabic,
        transliteration: newDoa.transliteration,
        translation: newDoa.translation,
        category: newDoa.category,
        created_at: new Date().toISOString()
      });
      setShowAddModal(false);
      setNewDoa({ title: '', arabic: '', transliteration: '', translation: '', category: 'Harian' });
      fetchUserDoas();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const allDoas = [...STATIC_DOA.map(d => ({
    ...d,
    displayTitle: language === 'ms' ? d.title : (d.title_en || d.title),
    displayTranslation: language === 'ms' ? d.translation : (d.translation_en || d.translation)
  })), ...userDoas.map(d => ({
    ...d,
    displayTitle: d.title || 'Doa Tanpa Tajuk',
    arabic: d.arabic || d.doa_arab,
    transliteration: d.transliteration || d.cara_sebutan || '',
    displayTranslation: d.translation || d.doa_maksud,
    category: d.category || d.kategori || 'Custom'
  }))];

  const filtered = allDoas.filter(doa => 
    (selectedCat === 'Semua' || doa.category === selectedCat) &&
    (doa.displayTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20 px-4"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-emerald-950 uppercase">{t('doa.title')}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">{t('doa.subtitle')}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
             <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder={t('common.search')} 
               className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-emerald-900/5 transition-all placeholder:text-slate-300"
             />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus size={18} /> {t('doa.add_btn')}
          </button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
              selectedCat === cat.id 
                ? "bg-emerald-600 text-white shadow-lg border-emerald-600" 
                : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800"
            )}
          >
            {cat.label}
          </button>
        ))}
        {userDoas.length > 0 && (
          <button 
            onClick={() => setSelectedCat('Custom')}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
              selectedCat === 'Custom' 
                ? "bg-emerald-600 text-white shadow-lg border-emerald-600" 
                : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800"
            )}
          >
            {t('doa.my_saved')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.length > 0 ? (
          filtered.map((doa, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 group relative overflow-hidden transition-colors"
            >
              <div className="flex justify-between items-start relative z-10">
                 <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                   {categories.find(c => c.id === doa.category)?.label || doa.category}
                 </span>
                 <div className="flex gap-2">
                   <button className="p-3 bg-slate-50 text-slate-300 rounded-2xl hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent"><Bookmark size={18} /></button>
                   <button className="p-3 bg-slate-50 text-slate-300 rounded-2xl hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent"><Share2 size={18} /></button>
                 </div>
              </div>

              <div className="text-center space-y-8 relative z-10">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{doa.displayTitle}</h3>
                <p className="font-arabic text-4xl md:text-5xl leading-relaxed text-slate-900 md:px-12" dir="rtl">{doa.arabic}</p>
                <div className="w-12 h-1 bg-emerald-100 mx-auto rounded-full"></div>
                <p className="text-emerald-600 italic font-medium text-sm">{doa.transliteration}</p>
                <p className="text-base text-slate-500 italic leading-loose max-w-2xl mx-auto font-medium">"{doa.displayTranslation}"</p>
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] rotate-45 translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"></div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center text-slate-200 dark:text-slate-700">
                <Heart size={40} />
             </div>
             <p className="text-slate-400 dark:text-slate-600 font-bold uppercase text-xs tracking-widest">{t('common.error')}</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t('doa.add_btn')}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddDoa} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('doa.form_title')}</label>
                  <input 
                    required
                    value={newDoa.title}
                    onChange={e => setNewDoa({...newDoa, title: e.target.value})}
                    placeholder={t('doa.form_title_placeholder')}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm text-slate-800 transition-all placeholder:text-slate-300"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Arabic Text</label>
                  <textarea 
                    required
                    value={newDoa.arabic}
                    onChange={e => setNewDoa({...newDoa, arabic: e.target.value})}
                    placeholder={t('doa.form_arabic_placeholder')}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-arabic text-2xl text-right text-slate-900 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Transliteration</label>
                  <textarea 
                    value={newDoa.transliteration}
                    onChange={e => setNewDoa({...newDoa, transliteration: e.target.value})}
                    placeholder={t('doa.form_trans_placeholder')}
                    rows={2}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm italic text-slate-800 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('mualaf.maksud.label')}</label>
                  <textarea 
                    required
                    value={newDoa.translation}
                    onChange={e => setNewDoa({...newDoa, translation: e.target.value})}
                    placeholder={t('doa.form_meaning_placeholder')}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium text-sm text-slate-800 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('komuniti.form_category')}</label>
                  <select 
                    value={newDoa.category}
                    onChange={e => setNewDoa({...newDoa, category: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-sm text-slate-800 transition-all"
                  >
                    {categories.filter(c => c.id !== 'Semua').map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                  </select>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : t('doa.save_btn')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Bookmark, Share2, Search, Info, Loader2, Sparkles, ChevronRight, LayoutGrid, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchHadisCategories, fetchHadisList, fetchHadisDetail, HadisListItem, HadisDetail } from '../services/hadisService';

import { useLanguage } from '../lib/LanguageContext';

export function HadisPage() {
  const { t, language } = useLanguage();
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hadisList, setHadisList] = useState<HadisListItem[]>([]);
  const [selectedHadisId, setSelectedHadisId] = useState<string | null>(null);
  const [hadisDetail, setHadisDetail] = useState<HadisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [search, setSearch] = useState('');
  const [readMoreExpl, setReadMoreExpl] = useState(false);

  useEffect(() => {
    async function init() {
      const cats = await fetchHadisCategories();
      // Filter for major categories that feel like "Books"
      const majorCats = cats.filter((c: any) => 
        ['Aqidah', 'Fikah', 'Akhlak', 'Hadis', 'Penyucian Jiwa'].some(tag => c.title.includes(tag))
      ).slice(0, 8);
      setCategories(majorCats.length > 0 ? majorCats : cats.slice(0, 8));
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      async function loadList() {
        setLoadingList(true);
        const list = await fetchHadisList(selectedCategory);
        setHadisList(list);
        setLoadingList(false);
      }
      loadList();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedHadisId) {
      async function loadDetail() {
        setLoadingDetail(true);
        const detail = await fetchHadisDetail(selectedHadisId);
        setHadisDetail(detail);
        setLoadingDetail(false);
      }
      loadDetail();
    }
  }, [selectedHadisId]);

  const filteredList = useMemo(() => 
    hadisList.filter(h => 
      h.title.toLowerCase().includes(search.toLowerCase())
    ), [hadisList, search]);

  const currentHadisIndex = useMemo(() => 
    filteredList.findIndex(h => h.id === selectedHadisId),
    [filteredList, selectedHadisId]
  );

  const goToNext = () => {
    if (currentHadisIndex < filteredList.length - 1) {
      setSelectedHadisId(filteredList[currentHadisIndex + 1].id);
    }
  };

  const goToPrev = () => {
    if (currentHadisIndex > 0) {
      setSelectedHadisId(filteredList[currentHadisIndex - 1].id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">{t('hadis.loading')}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-32 px-4"
    >
      {/* Refined Header */}
      <header className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-emerald-100 shadow-sm">
          <Book size={16} />
          {t('hadis.title')}
        </div>
        <div className="space-y-4">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 uppercase italic">
              {language === 'ms' ? 'Pustaka' : 'Hadith'} <span className="text-emerald-600">{language === 'ms' ? 'Hadis' : 'Library'}</span>
            </h2>
          <p className="text-slate-400 text-xs lg:text-sm font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
            {t('hadis.subtitle')}
          </p>
        </div>
      </header>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.01 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="group bg-white p-12 rounded-[3.5rem] border-2 border-slate-50 hover:border-emerald-200 transition-all text-left space-y-10 shadow-sm hover:shadow-3xl hover:shadow-emerald-900/5 relative overflow-hidden flex flex-col items-start"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100/40 transition-colors"></div>
              
              <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[2rem] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm group-hover:rotate-6">
                <Book size={32} />
              </div>

              <div className="space-y-4 relative z-10 flex-1">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-tight">{cat.title}</h3>
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-1">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                     <div className="w-2 h-2 rounded-full bg-emerald-100"></div>
                   </div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{t('hadis.collection_badge')}</p>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{t('hadis.explore_desc').replace('{cat}', cat.title.toLowerCase())}</p>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest pt-4 group-hover:gap-4 transition-all">
                <span>{t('hadis.view_all').replace('{book}', '')}</span>
                <ChevronRight size={16} />
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                setSelectedCategory('');
                setSelectedHadisId(null);
              }}
              className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-emerald-100 hover:text-emerald-600 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
              {t('common.back')}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {categories.find(c => c.id === selectedCategory)?.title}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* List Column */}
            <div className="flex-1 w-full space-y-6">
              <div className="relative group">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('hadis.search')} 
                  className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-50 rounded-[2.5rem] text-sm font-bold shadow-sm outline-none focus:border-emerald-100 focus:ring-8 focus:ring-emerald-500/5 transition-all"
                />
              </div>

              <div className="space-y-4">
                {loadingList ? (
                  <div className="py-20 text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto opacity-20" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('common.loading')}</p>
                  </div>
                ) : filteredList.length > 0 ? (
                  filteredList.map(hadis => (
                    <motion.div
                      key={hadis.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 8 }}
                      onClick={() => setSelectedHadisId(hadis.id)}
                      className={cn(
                        "p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] border-2 transition-all cursor-pointer bg-white flex items-center justify-between group",
                        selectedHadisId === hadis.id 
                          ? "border-emerald-500 bg-emerald-50/10 shadow-xl shadow-emerald-500/5 text-emerald-950" 
                          : "border-slate-50 hover:border-emerald-50 hover:bg-slate-50/30"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-12 h-12 lg:w-16 lg:h-16 rounded-[1.25rem] flex items-center justify-center font-black text-[10px] lg:text-xs transition-all shadow-sm",
                          selectedHadisId === hadis.id ? "bg-emerald-600 text-white rotate-6" : "bg-white text-slate-300 border border-slate-50"
                        )}>
                          #{hadis.id.slice(-3)}
                        </div>
                        <div>
                          <h3 className={cn(
                            "text-sm lg:text-lg font-black tracking-tight leading-snug line-clamp-2",
                            selectedHadisId === hadis.id ? "text-emerald-950" : "text-slate-700"
                          )}>
                            {hadis.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{t('hadis.status_sahih')}</span>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{t('hadis.transmission')}: {hadis.id.slice(0, 4)}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={24} className={cn("transition-transform text-slate-100", selectedHadisId === hadis.id && "translate-x-2 text-emerald-500")} />
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-6">
                    <Book size={64} className="mx-auto text-slate-100" />
                    <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{t('common.error')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Study Mode Overlay / Detail Column */}
            <AnimatePresence>
              {selectedHadisId && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="fixed inset-0 lg:relative lg:inset-auto z-[100] lg:z-0 lg:w-[500px] flex flex-col bg-white lg:bg-transparent"
                >
                  <div className="lg:sticky lg:top-8 h-full flex flex-col">
                    <div className="p-6 border-b border-slate-50 lg:hidden flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                      <button onClick={() => setSelectedHadisId(null)} className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-slate-500">
                        <ChevronLeft size={20} /> {t('common.back')}
                      </button>
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">Al-Jami' As-Sahih</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto lg:overflow-visible no-scrollbar p-6 lg:p-0">
                      {loadingDetail ? (
                        <div className="bg-white p-20 rounded-[3rem] lg:rounded-[4rem] border border-slate-50 flex flex-col items-center justify-center gap-10 h-[500px] lg:h-[700px] shadow-sm">
                          <div className="relative">
                            <div className="w-24 h-24 bg-emerald-50 rounded-full animate-ping opacity-20"></div>
                            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">{t('common.loading')}</p>
                        </div>
                      ) : hadisDetail ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-8 lg:p-12 rounded-[3rem] lg:rounded-[4rem] border-2 border-slate-50 shadow-3xl shadow-slate-900/5 space-y-10 relative overflow-hidden"
                        >
                          {/* Book Corner Graphic */}
                          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none rotate-12">
                             <Book size={160} />
                          </div>

                          <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">{t('hadis.translation_label')}</span>
                                </div>
                                <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{hadisDetail.attribution}</h4>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Bookmark size={18} /></button>
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Share2 size={18} /></button>
                              </div>
                            </div>

                            <div className="bg-[#fcfcfc] p-8 lg:p-10 rounded-[2.5rem] border border-slate-50 relative group">
                              <div className="absolute -top-3 -right-3 bg-white px-4 py-1.5 rounded-full border border-slate-100 text-[8px] font-black text-emerald-300 uppercase tracking-widest shadow-sm">Arabic</div>
                              <p className="font-arabic text-3xl lg:text-4xl leading-[2.2] text-slate-900 text-right selection:bg-emerald-100" dir="rtl">
                                {hadisDetail.arabic}
                              </p>
                            </div>

                            <div className="space-y-12">
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-6 h-px bg-emerald-100"></div>
                                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('hadis.meaning_title')}</h5>
                                </div>
                                <p className="text-lg lg:text-xl font-bold text-slate-800 leading-relaxed font-serif italic selection:bg-emerald-50">
                                  "{hadisDetail.translation}"
                                </p>
                              </div>

                              {hadisDetail.explanation && (
                                <div className="space-y-4 pt-10 border-t border-slate-50">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Sparkles size={18} className="text-emerald-500" />
                                      <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t('hadis.explanation_title')}</h5>
                                    </div>
                                    <button 
                                      onClick={() => setReadMoreExpl(!readMoreExpl)}
                                      className="text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                                    >
                                      {readMoreExpl ? 'Ringkaskan' : 'Baca Penuh'}
                                    </button>
                                  </div>
                                  <div className="bg-emerald-50/50 p-6 rounded-3xl text-[11px] font-semibold text-emerald-900 leading-relaxed transition-all">
                                    {readMoreExpl 
                                      ? hadisDetail.explanation.replace(/<[^>]*>?/gm, '')
                                      : hadisDetail.explanation.replace(/<[^>]*>?/gm, '').split('.').slice(0, 1).join('.') + '...'}
                                  </div>
                                </div>
                              )}

                              {hadisDetail.hints && hadisDetail.hints.length > 0 && (
                                <div className="space-y-4 pt-10 border-t border-slate-50">
                                  <div className="flex items-center gap-3">
                                    <Info size={18} className="text-emerald-600" />
                                    <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t('hadis.hints_title')}</h5>
                                  </div>
                                  <div className="space-y-3">
                                    {hadisDetail.hints.map((hint, i) => (
                                      <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 items-start hover:bg-white hover:border-emerald-100 transition-all">
                                        <span className="font-black text-emerald-200 text-xl leading-none">0{i+1}</span>
                                        <p className="text-[11px] text-slate-600 font-bold leading-relaxed">{hint}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-10 flex items-center justify-between border-t border-slate-50">
                              <button onClick={goToPrev} disabled={currentHadisIndex <= 0} className="group p-4 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-900 hover:text-white transition-all disabled:opacity-20 active:scale-95 shadow-sm">
                                <ChevronLeft size={24} />
                              </button>
                              <div className="bg-slate-50 px-6 py-2 rounded-full border border-slate-100 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
                                {currentHadisIndex + 1} / {filteredList.length}
                              </div>
                              <button onClick={goToNext} disabled={currentHadisIndex >= filteredList.length - 1} className="group p-4 bg-emerald-600 text-white rounded-3xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-20 active:scale-95">
                                <ChevronRight size={24} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}

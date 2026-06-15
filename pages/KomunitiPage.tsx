import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, PlusCircle, UserCircle, History, Sparkles, Filter, Trash2, LogIn } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { storiesService, Story } from '../services/storiesService';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function KomunitiPage() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'my-stories'>('explore');
  const [newStory, setNewStory] = useState({ tajuk: '', kandungan: '', kategori: 'inspirasi' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStories();
    if (user) loadMyStories();
  }, [user, activeTab]);

  async function loadStories() {
    setLoading(true);
    try {
      const data = await storiesService.getApprovedStories();
      setStories(data);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyStories() {
    if (!user) return;
    try {
      const data = await storiesService.getUserStories(user.uid);
      setMyStories(data);
    } catch (err) {
      console.error('Failed to load my stories:', err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      await storiesService.submitStory({
        ...newStory,
        userId: user.uid,
        author_name: profile?.nama_paparan || t('komuniti.anon')
      });
      setShowForm(false);
      setNewStory({ tajuk: '', kandungan: '', kategori: 'inspirasi' });
      alert('Alhamdulillah! Kisah anda telah dihantar untuk semakan.');
      loadMyStories();
    } catch (err) {
      console.error(err);
      alert('Gagal menghantar kisah. Sila cuba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Adakah anda pasti mahu memadam kisah ini?')) return;
    try {
      await storiesService.deleteStory(id);
      loadMyStories();
    } catch (err) {
      console.error(err);
    }
  };

  const displayStories = activeTab === 'explore' ? stories : myStories;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-32 px-4"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-6 border-b border-emerald-50">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
              <Sparkles size={20} />
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-emerald-950 uppercase">{t('komuniti.title')}</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">{t('komuniti.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <button 
              onClick={() => setShowForm(!showForm)}
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest",
                showForm 
                  ? "bg-rose-50 text-rose-600 border border-rose-100" 
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200"
              )}
            >
              {showForm ? t('komuniti.cancel_btn') : t('komuniti.share_btn')}
            </button>
          ) : (
            <button 
              onClick={() => alert('Sila log masuk untuk berkongsi kisah anda.')}
              className="flex items-center gap-2 bg-slate-100 text-slate-400 px-8 py-4 rounded-2xl font-bold text-xs cursor-not-allowed uppercase tracking-widest"
            >
              <LogIn size={18} /> {t('komuniti.share_btn')}
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('explore')}
          className={cn(
            "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'explore' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-400 hover:bg-white/50"
          )}
        >
          {t('common.view_all')}
        </button>
        {user && (
          <button 
            onClick={() => setActiveTab('my-stories')}
            className={cn(
              "px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === 'my-stories' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-400 hover:bg-white/50"
            )}
          >
            <History size={14} /> My Stories
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('komuniti.form_title')}</label>
                     <input 
                       required
                       disabled={submitting}
                       value={newStory.tajuk}
                       onChange={e => setNewStory(prev => ({...prev, tajuk: e.target.value}))}
                       placeholder={t('komuniti.form_title_placeholder')}
                       className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('komuniti.form_category')}</label>
                     <select 
                       disabled={submitting}
                       value={newStory.kategori}
                       onChange={e => setNewStory(prev => ({...prev, kategori: e.target.value}))}
                       className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                     >
                       <option value="inspirasi">Inspirasi</option>
                       <option value="tips">Tips Ibadah</option>
                       <option value="soal_jawab">Soal Jawab</option>
                     </select>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t('komuniti.form_content')}</label>
                   <textarea 
                     required
                     disabled={submitting}
                     value={newStory.kandungan}
                     onChange={e => setNewStory(prev => ({...prev, kandungan: e.target.value}))}
                     rows={6}
                     placeholder={t('komuniti.form_content_placeholder')}
                     className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                   />
                 </div>
                 <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 uppercase text-xs tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t('settings.saving') : t('komuniti.form_submit')}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayStories.length > 0 ? (
          displayStories.map((story) => (
            <motion.div 
              layout
              key={story.id} 
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                      {story.kategori}
                    </span>
                    {activeTab === 'my-stories' && (
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                        story.status === 'approved' ? "bg-green-50 text-green-700 border-green-100" :
                        story.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-rose-50 text-rose-700 border-rose-100"
                      )}>
                        {story.status}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
                    {story.created_at ? format(new Date(story.created_at), 'dd MMM yyyy') : 'No Date'}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors uppercase">
                    {story.tajuk}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-6 font-medium whitespace-pre-wrap">
                    {story.kandungan}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-white shadow-sm ring-4 ring-slate-50/50">
                    <UserCircle size={24} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900">{story.author_name}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Kontributor</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {activeTab === 'my-stories' && story.status === 'pending' && (
                    <button 
                      onClick={() => handleDelete(story.id!)}
                      className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 text-slate-300 hover:text-rose-500 transition-colors">
                      <Heart size={16} /> 
                      <span className="text-[10px] font-bold">{story.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-600 transition-colors">
                      <MessageSquare size={16} /> 
                      <span className="text-[10px] font-bold">{story.comments_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-4 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mx-auto">
              <Filter size={32} />
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">
              {loading ? t('komuniti.loading') : 'Tiada kisah untuk dipaparkan'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

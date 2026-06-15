import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Video, 
  Star, 
  Plus, 
  ChevronRight, 
  Layout, 
  Settings,
  Heart,
  Loader2,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classService, OnlineClass, ClassEnrollment } from '../services/classService';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export function KelasDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ajar' | 'join' | 'simpan'>('ajar');
  const [loading, setLoading] = useState(true);
  
  const [taughtClasses, setTaughtClasses] = useState<OnlineClass[]>([]);
  const [joinedClasses, setJoinedClasses] = useState<OnlineClass[]>([]);
  const [savedClasses, setSavedClasses] = useState<OnlineClass[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      const [taught, joinedRecords, savedRecords] = await Promise.all([
        classService.getClassesByInstructor(user!.uid),
        classService.getEnrolledClasses(),
        classService.getFavorites()
      ]);

      setTaughtClasses(taught);
      
      // Fetch details for joined and saved classes
      const joinedDetails = await Promise.all(
        joinedRecords.map(rec => classService.getClassById(rec.class_id))
      );
      setJoinedClasses(joinedDetails.filter(c => c !== null) as OnlineClass[]);

      const savedDetails = await Promise.all(
        savedRecords.map(rec => classService.getClassById(rec.class_id))
      );
      setSavedClasses(savedDetails.filter(c => c !== null) as OnlineClass[]);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'ajar', label: 'Kelas Saya Ajar', icon: BookOpen },
    { id: 'join', label: 'Kelas Saya Join', icon: User },
    { id: 'simpan', label: 'Kelas Disimpan', icon: Heart }
  ] as const;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Menyelaras Kelas...</p>
        </div>
      );
    }

    const list = activeTab === 'ajar' ? taughtClasses : activeTab === 'join' ? joinedClasses : savedClasses;

    if (list.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-20 rounded-[3.5rem] border-2 border-slate-50 text-center space-y-6"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
             <Layout className="text-slate-200" size={40} />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">Tiada Rekod</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Mulakan pengembaraan ilmu anda sekarang.</p>
          </div>
          {activeTab === 'ajar' ? (
             <button 
               onClick={() => navigate('/kelas/baru')}
               className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2 mx-auto"
             >
               <Plus size={16} />
               Buat Kelas Pertama
             </button>
          ) : (
             <button 
               onClick={() => navigate('/kelas')}
               className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all mx-auto"
             >
               Teroka Hub Ilmu
             </button>
          )}
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {list.map((cls, idx) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-indigo-100 transition-all relative overflow-hidden group"
          >
             <div className="flex justify-between items-start mb-6">
                <div className="space-y-4">
                  <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100 inline-block">
                    {cls.kategori}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cls.nama_kelas}</h3>
                </div>
                {activeTab === 'ajar' ? (
                  <button 
                    onClick={() => navigate(`/kelas/edit/${cls.id}`)}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Settings size={18} />
                  </button>
                ) : (
                   <button 
                    onClick={() => navigate(`/kelas/${cls.id}`)}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                )}
             </div>

             <div className="space-y-4">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                     <Calendar size={14} className="text-slate-300" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cls.hari}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Video size={14} className="text-slate-300" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atas Talian</span>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Star size={14} className="text-amber-400 fill-amber-400" />
                   <span className="text-[10px] font-bold text-slate-600">4.9 (28 Ulasan)</span>
                </div>
             </div>

             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-50/50 rounded-full group-hover:scale-150 transition-transform blur-2xl"></div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-12 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Dashboard <span className="text-indigo-600">Terbuka</span></h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Pengurusan pengajian digital anda.</p>
        </div>
        <div className="flex gap-4">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border",
                 activeTab === tab.id 
                   ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20" 
                   : "bg-white text-slate-400 border-slate-100 hover:border-indigo-100"
               )}
             >
               <tab.icon size={16} />
               <span className="hidden md:inline">{tab.label}</span>
             </button>
           ))}
        </div>
      </header>

      <section className="space-y-10">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </section>
    </motion.div>
  );
}

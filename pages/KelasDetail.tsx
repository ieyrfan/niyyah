import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Star, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Users,
  Info,
  ExternalLink,
  MessageSquare,
  Send,
  Loader2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { classService, OnlineClass, ClassReview } from '../services/classService';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';

export function KelasDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [cls, setCls] = useState<OnlineClass | null>(null);
  const [reviews, setReviews] = useState<ClassReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  
  const [newReview, setNewReview] = useState({ rating: 5, komen: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, user]);

  async function loadData() {
    if (!id) return;
    setLoading(true);
    try {
      const [classData, classReviews, enrolled, favorite] = await Promise.all([
        classService.getClassById(id),
        classService.getClassReviews(id),
        classService.isEnrolled(id),
        classService.isFavorite(id)
      ]);
      
      setCls(classData);
      setReviews(classReviews);
      setIsEnrolled(enrolled);
      setIsFavorite(favorite);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleEnroll = async () => {
    if (!user || !cls || isEnrolled) return;
    setEnrolling(true);
    try {
      await classService.enrollInClass(cls.id!, cls.nama_kelas);
      setIsEnrolled(true);
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!id || !user) return;
    try {
      const fav = await classService.toggleFavorite(id);
      setIsFavorite(fav);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newReview.komen.trim()) return;
    
    setSubmittingReview(true);
    try {
      await classService.addReview(id, {
        rating: newReview.rating,
        komen: newReview.komen,
        user_name: profile?.nama_paparan || 'Hamba Allah'
      } as any);
      
      // Reload reviews
      const updatedReviews = await classService.getClassReviews(id);
      setReviews(updatedReviews);
      setNewReview({ rating: 5, komen: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
     return (
       <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Membuka Kitab...</p>
       </div>
     );
  }

  if (!cls) {
     return (
       <div className="text-center p-20 space-y-6">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Kelas Tidak Dijumpai</h2>
          <button onClick={() => navigate('/kelas')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Kembali Ke Hub</button>
       </div>
     );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-12 pb-32"
    >
      {/* Top Navigation */}
      <nav className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 px-6 py-3 bg-white text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>
        <div className="flex gap-4">
           <button 
             onClick={handleToggleFavorite}
             className={cn(
               "p-4 rounded-2xl border transition-all shadow-sm",
               isFavorite ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-white border-slate-100 text-slate-400 hover:text-rose-500"
             )}
           >
             <Bookmark size={20} fill={isFavorite ? "currentColor" : "none"} />
           </button>
           <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
             <Share2 size={20} />
           </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
         {/* Main Content */}
         <div className="xl:col-span-2 space-y-12">
            <header className="space-y-6">
               <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{cls.kategori}</span>
                  <span className="px-4 py-1.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest">{cls.tahap}</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight uppercase italic">{cls.nama_kelas}</h1>
               <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-base shadow-inner">
                       {cls.instructor_name[0]}
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instruktur</p>
                        <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">{cls.instructor_name}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 rounded-xl text-amber-600">
                     <Star size={14} fill="currentColor" />
                     <span className="text-[11px] font-black tracking-widest">4.9</span>
                     <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest ml-1">{reviews.length} Ulasan</span>
                  </div>
               </div>
            </header>

            {cls.gambar_url && (
              <div className="w-full aspect-video rounded-[3.5rem] overflow-hidden shadow-2xl border-2 border-white">
                 <img src={cls.gambar_url} alt={cls.nama_kelas} className="w-full h-full object-cover" />
              </div>
            )}

            <section className="space-y-8">
               <div className="flex items-center gap-3 px-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                 <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Penerangan Kelas</h3>
               </div>
               <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed whitespace-pre-wrap">
                 {cls.penerangan}
               </p>
            </section>

            {/* Schedule Section */}
            <section className="bg-slate-50 p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 space-y-10">
               <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-500" size={24} />
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Jadual Pengajian</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarikh Mula</p>
                     <div className="flex items-center gap-4 text-xl font-black text-slate-800 italic">
                        {new Date(cls.tarikh_mula).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari & Masa</p>
                     <div className="flex flex-col gap-2">
                        <div className="text-xl font-black text-indigo-600 italic uppercase tracking-widest">{cls.hari}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                           <Clock size={16} className="text-slate-300" />
                           {cls.masa_mula} — {cls.masa_tamat}
                        </div>
                     </div>
                  </div>
               </div>
               {cls.tarikh_tamat && (
                  <div className="pt-6 border-t border-slate-200">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Anggaran Tamat</p>
                     <p className="text-xs font-bold text-slate-800">{new Date(cls.tarikh_tamat).toLocaleDateString()}</p>
                  </div>
               )}
            </section>

            {/* Reviews Section */}
            <section className="space-y-10 pt-10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={24} className="text-indigo-400" />
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ulasan Peserta <span className="text-slate-300 ml-1">({reviews.length})</span></h4>
                  </div>
                  {!isEnrolled && cls.created_by !== user?.uid && (
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Lock size={12} />
                       Sertai kelas untuk memberi ulasan
                    </div>
                  )}
               </div>

               {isEnrolled && (
                  <form onSubmit={handleSubmitReview} className="bg-white p-10 rounded-[3rem] border-2 border-indigo-50/50 shadow-xl shadow-indigo-900/5 space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map(star => (
                             <button
                               key={star}
                               type="button"
                               onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                               className={cn(
                                 "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                 star <= newReview.rating ? "bg-amber-100 text-amber-600 shadow-inner" : "bg-slate-50 text-slate-300"
                               )}
                             >
                               <Star size={18} fill={star <= newReview.rating ? "currentColor" : "none"} />
                             </button>
                           ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto">Pilih Rating</span>
                     </div>
                     <textarea 
                       required
                       rows={3}
                       placeholder="Bagaimana pengalaman anda dalam kelas ini?"
                       value={newReview.komen}
                       onChange={(e) => setNewReview(prev => ({ ...prev, komen: e.target.value }))}
                       className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[2rem] outline-none text-sm font-bold text-slate-700 transition-all resize-none shadow-sm shadow-inner"
                     />
                     <button 
                       type="submit"
                       disabled={submittingReview}
                       className="w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {submittingReview ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                       Kirim Ulasan
                     </button>
                  </form>
               )}

               <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((rev, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={rev.id} 
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4"
                      >
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-300 shadow-inner">
                                  {rev.user_name[0]}
                               </div>
                               <div className="space-y-0.5">
                                  <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{rev.user_name}</h5>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">Sertai pada {rev.created_at?.toDate?.().toLocaleDateString() || 'Baru-baru ini'}</p>
                               </div>
                            </div>
                            <div className="flex gap-1 text-amber-400">
                               {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                         </div>
                         <p className="text-xs font-bold text-slate-600 leading-loose italic pl-4 border-l-4 border-indigo-50">"{rev.komen}"</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-12 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 text-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tiada ulasan lagi buat masa ini.</p>
                    </div>
                  )}
               </div>
            </section>
         </div>

         {/* Sidebar Actions */}
         <div className="space-y-8 sticky top-8">
            <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-3xl shadow-slate-200/50 space-y-8">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Harga Kemasukan</p>
                  <div className="flex items-baseline gap-2 px-2">
                     <span className="text-4xl font-black text-slate-950 uppercase tracking-tighter italic">
                       {cls.harga === 0 ? 'Percuma' : `RM${cls.harga}`}
                     </span>
                     {cls.harga > 0 && <span className="text-xs font-bold text-slate-400 uppercase">/ seorang</span>}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                     <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                        <Users size={18} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kapasiti</p>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">{cls.kapasiti ? `${cls.kapasiti} Murid Maksimum` : 'Tiada Had (Sesuai untuk ramai)'}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                     <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                        <Video size={18} />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Platform</p>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">{new URL(cls.link_meeting).hostname.replace('www.', '')}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4 pt-4">
                  {!isEnrolled && cls.created_by !== user?.uid ? (
                    <button 
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {enrolling ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                      Sertai Kelas Sekarang
                    </button>
                  ) : isEnrolled ? (
                    <a 
                      href={cls.link_meeting}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-2xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3"
                    >
                      <Video size={20} />
                      Buka Link Meeting
                      <ExternalLink size={14} className="opacity-50" />
                    </a>
                  ) : cls.created_by === user?.uid ? (
                    <button 
                      onClick={() => navigate(`/kelas/edit/${cls.id}`)}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 shadow-2xl shadow-slate-900/40 transition-all flex items-center justify-center gap-3"
                    >
                      Kemasukan Kelas (Instruktur)
                    </button>
                  ) : null}

                  {isEnrolled && (
                    <div className="p-5 bg-emerald-50 rounded-[1.5rem] border border-emerald-100 flex gap-3 items-center">
                       <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                       <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest leading-relaxed">Tahniah! Anda telah mendaftar kelas ini. Sila sertai pada waktu yang ditetapkan.</p>
                    </div>
                  )}
               </div>
            </section>

            <section className="bg-indigo-600 p-10 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-600/20">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3 text-indigo-200">
                    <Info size={18} />
                    <h5 className="text-[10px] font-black uppercase tracking-widest">Panduan Peserta</h5>
                  </div>
                  <ul className="space-y-4">
                     <li className="flex gap-3 text-xs font-bold leading-relaxed text-indigo-100">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                        Pastikan mikrofon berfungsi sebelum sertai.
                     </li>
                     <li className="flex gap-3 text-xs font-bold leading-relaxed text-indigo-100">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                        Berpakaian sopan dan menutup aurat dalam kelas.
                     </li>
                     <li className="flex gap-3 text-xs font-bold leading-relaxed text-indigo-100">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                        Mempunyai koneksi internet yang stabil.
                     </li>
                  </ul>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </section>
         </div>
      </div>
    </motion.div>
  );
}

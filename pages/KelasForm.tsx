import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Save, 
  Trash2, 
  Video, 
  DollarSign, 
  Calendar, 
  Clock, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { classService, OnlineClassCategory, OnlineClassLevel, OnlineClass } from '../services/classService';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';

export function KelasForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<Omit<OnlineClass, 'id' | 'created_by' | 'created_at'>>({
    nama_kelas: '',
    kategori: OnlineClassCategory.AGAMA,
    penerangan: '',
    tahap: OnlineClassLevel.SEMUA,
    harga: 0,
    link_meeting: '',
    gambar_url: '',
    kapasiti: undefined,
    umur_minimal: undefined,
    hari: '', // e.g. "Isnin, Rabu"
    tarikh_mula: '',
    tarikh_tamat: '',
    masa_mula: '',
    masa_tamat: '',
    instructor_name: profile?.nama_paparan || ''
  });

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];

  useEffect(() => {
    if (id) {
      loadClass();
    }
  }, [id]);

  useEffect(() => {
    if (profile?.nama_paparan && !formData.instructor_name) {
      setFormData(prev => ({ ...prev, instructor_name: profile.nama_paparan }));
    }
  }, [profile]);

  async function loadClass() {
    if (!id) return;
    setFetching(true);
    try {
      const data = await classService.getClassById(id);
      if (data) {
        setFormData({
          nama_kelas: data.nama_kelas,
          kategori: data.kategori,
          penerangan: data.penerangan,
          tahap: data.tahap,
          harga: data.harga,
          link_meeting: data.link_meeting,
          gambar_url: data.gambar_url || '',
          kapasiti: data.kapasiti,
          umur_minimal: data.umur_minimal,
          hari: data.hari,
          tarikh_mula: data.tarikh_mula,
          tarikh_tamat: data.tarikh_tamat || '',
          masa_mula: data.masa_mula,
          masa_tamat: data.masa_tamat,
          instructor_name: data.instructor_name
        });
        setSelectedDays(data.hari.split(',').map(d => d.trim()));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }

  const toggleDay = (day: string) => {
    const newDays = selectedDays.includes(day) 
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    setSelectedDays(newDays);
    setFormData(prev => ({ ...prev, hari: newDays.join(', ') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      if (id) {
        await classService.updateClass(id, formData);
        setMessage({ type: 'success', text: 'Kelas berjaya dikemaskini!' });
      } else {
        await classService.createClass(formData);
        setMessage({ type: 'success', text: 'Kelas berjaya didaftarkan!' });
        setTimeout(() => navigate('/kelas'), 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memproses kelas. Sila cuba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Adakah anda pasti mahu memadam kelas ini?')) return;
    try {
      await classService.deleteClass(id);
      navigate('/kelas');
    } catch (err) {
      console.error(err);
    }
  };

  if (fetching) {
     return (
       <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Memuat Maklumat...</p>
       </div>
     );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 px-6 py-3 bg-white text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>
        <div className="text-right">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
             {id ? 'Kemaskini' : 'Daftar'} <span className="text-indigo-600">Kelas</span>
           </h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cipta ekosistem ilmu digital anda sendiri.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-12">
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-[2rem] flex items-center gap-4 border",
                message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"
              )}
            >
              {message.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <span className="text-xs font-black uppercase tracking-widest leading-relaxed">{message.text}</span>
            </motion.div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nama Kelas</label>
              <input 
                required
                type="text" 
                placeholder="cth: Kelas Mengaji Tajwid Asas"
                value={formData.nama_kelas}
                onChange={(e) => setFormData(prev => ({ ...prev, nama_kelas: e.target.value }))}
                className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Kategori</label>
              <select 
                value={formData.kategori}
                onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value as OnlineClassCategory }))}
                className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all appearance-none cursor-pointer"
              >
                {Object.values(OnlineClassCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Penerangan Kelas</label>
            <textarea 
              required
              rows={4}
              placeholder="Jelaskan apa yang akan diajar dalam kelas ini..."
              value={formData.penerangan}
              onChange={(e) => setFormData(prev => ({ ...prev, penerangan: e.target.value }))}
              className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[2rem] outline-none text-sm font-bold text-slate-700 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 ml-4">
                 <Video size={14} className="text-indigo-400" />
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Meeting (Zoom/Meet)</label>
              </div>
              <input 
                required
                type="url" 
                placeholder="https://zoom.us/j/..."
                value={formData.link_meeting}
                onChange={(e) => setFormData(prev => ({ ...prev, link_meeting: e.target.value }))}
                className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 ml-4">
                 <DollarSign size={14} className="text-emerald-400" />
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Harga (RM) <span className="text-[8px] opacity-60">Isi 0 jika percuma</span></label>
              </div>
              <input 
                required
                type="number" 
                value={formData.harga}
                onChange={(e) => setFormData(prev => ({ ...prev, harga: Number(e.target.value) }))}
                className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="space-y-6">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Jadual Hari</label>
             <div className="flex flex-wrap gap-2 px-2">
                {days.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={cn(
                      "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                      selectedDays.includes(day) ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}
                  >
                    {day}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
               <div className="flex items-center gap-3 ml-4">
                  <Calendar size={14} className="text-indigo-400" />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarikh Mula</label>
               </div>
               <input 
                 required
                 type="date" 
                 value={formData.tarikh_mula}
                 onChange={(e) => setFormData(prev => ({ ...prev, tarikh_mula: e.target.value }))}
                 className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
               />
             </div>
             <div className="space-y-4">
               <div className="flex items-center gap-3 ml-4">
                  <Clock size={14} className="text-indigo-400" />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Masa (Dari - Hingga)</label>
               </div>
               <div className="flex gap-4">
                  <input 
                    required
                    type="time" 
                    value={formData.masa_mula}
                    onChange={(e) => setFormData(prev => ({ ...prev, masa_mula: e.target.value }))}
                    className="flex-1 px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
                  />
                  <input 
                    required
                    type="time" 
                    value={formData.masa_tamat}
                    onChange={(e) => setFormData(prev => ({ ...prev, masa_tamat: e.target.value }))}
                    className="flex-1 px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
                  />
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
               <div className="flex items-center gap-3 ml-4">
                  <ImageIcon size={14} className="text-indigo-400" />
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL Gambar Poster (Optional)</label>
               </div>
               <input 
                 type="url" 
                 placeholder="https://..."
                 value={formData.gambar_url}
                 onChange={(e) => setFormData(prev => ({ ...prev, gambar_url: e.target.value }))}
                 className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all"
               />
             </div>
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tahap Kelas</label>
                <select 
                  value={formData.tahap}
                  onChange={(e) => setFormData(prev => ({ ...prev, tahap: e.target.value as OnlineClassLevel }))}
                  className="w-full px-8 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.5rem] outline-none text-sm font-bold text-slate-700 transition-all appearance-none cursor-pointer"
                >
                  {Object.values(OnlineClassLevel).map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
             </div>
          </div>
        </section>

        <footer className="flex flex-col md:flex-row gap-6">
           {id && (
             <button 
               type="button"
               onClick={handleDelete}
               className="px-10 py-5 bg-rose-50 text-rose-600 rounded-[2rem] font-black text-[12px] uppercase tracking-widest border border-rose-100 hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
             >
               <Trash2 size={20} />
               Padam Kelas
             </button>
           )}
           <button 
             type="submit"
             disabled={loading}
             className="flex-1 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
             {id ? 'Simpan Perubahan' : 'Daftarkan Kelas Sekarang'}
           </button>
        </footer>
      </form>
    </motion.div>
  );
}

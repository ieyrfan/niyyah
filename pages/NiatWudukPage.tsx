import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Droplets, 
  CheckCircle2, 
  Info,
  ArrowRight,
  Maximize2,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';
import { cn } from '../lib/utils';

interface Step {
  id: number;
  title: string;
  arabic?: string;
  transliteration?: string;
  translation?: string;
  instruction: string;
  note?: string;
  image: string;
}

export function NiatWudukPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      id: 1,
      title: "Niat Wuduk",
      arabic: "نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى",
      transliteration: "Nawaitul wudhuu-a lirof’il hadatsil ashgori fardhon lillaahi ta’aala",
      translation: "Sahaja aku berniat wuduk untuk menghilangkan hadas kecil, fardu kerana Allah Taala.",
      instruction: "Membaca niat di dalam hati semasa air mula menyentuh sebahagian muka.",
      note: "Niat adalah rukun pertama dalam wuduk.",
      image: "https://images.unsplash.com/photo-1584559582128-b8be739912e1?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 2,
      title: "Membasuh Muka",
      instruction: "Membasuh muka dari tempat tumbuh rambut di dahi hingga ke dagu, dan dari telinga kanan ke telinga kiri.",
      note: "Pastikan air merata ke seluruh permukaan muka.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 3,
      title: "Basuh Tangan Hingga Siku",
      instruction: "Membasuh kedua-dua belah tangan bermula dari hujung jari hingga ke siku.",
      note: "Dahulukan tangan kanan, kemudian tangan kiri.",
      image: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 4,
      title: "Menyapu Sebahagian Kepala",
      instruction: "Menyapu sebahagian daripada kulit kepala atau rambut dengan air.",
      note: "Sekurang-kurangnya tiga helai rambut.",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 5,
      title: "Basuh Kaki Hingga Buku Lali",
      instruction: "Membasuh kedua-dua belah kaki hingga ke buku lali, termasuk celah-celah jari kaki.",
      note: "Dahulukan kaki kanan, kemudian kaki kiri.",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6b66b721?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 6,
      title: "Tertib",
      instruction: "Melakukan rukun-rukun wuduk mengikut susunan yang betul.",
      note: "Penting: Jika tersalah susunan, wuduk tidak sah.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 px-4 lg:px-0">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 group text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm transition-all group-hover:bg-emerald-50">
            <ChevronLeft size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Kembali</span>
        </button>

        <div className="text-center">
          <h1 className="text-sm font-black text-emerald-950 uppercase tracking-tighter italic">Celik Ummah</h1>
          <p className="text-[8px] text-emerald-600 font-black uppercase tracking-widest leading-none">Modul 03: Wuduk Lengkap</p>
        </div>

        <button className="p-2 lg:p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
          <PlayCircle size={20} />
        </button>
      </div>

      {/* Main Module Card */}
      <motion.div 
        layout
        className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-emerald-900/5 overflow-hidden transition-colors"
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-50 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="absolute top-0 left-0 h-full bg-emerald-600"
          />
        </div>

        <div className="p-8 lg:p-12 space-y-10">
          {/* Step Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                <CheckCircle2 size={12} />
                Langkah {step.id} daripada {steps.length}
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-emerald-950 tracking-tight uppercase italic">{step.title}</h2>
            </div>
            <button className="flex items-center gap-2 group text-slate-400 hover:text-emerald-600 transition-colors">
              <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tonton Video</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  {step.arabic && (
                    <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 text-center space-y-6">
                      <p className="font-arabic text-4xl lg:text-5xl leading-relaxed text-emerald-950 transition-colors" dir="rtl">
                        {step.arabic}
                      </p>
                      <div className="space-y-2">
                        <p className="text-slate-500 italic text-sm font-medium">
                          "{step.transliteration}"
                        </p>
                        <p className="text-emerald-700 font-bold text-base">
                          "{step.translation}"
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                        <Droplets size={24} className="text-emerald-600" />
                      </div>
                      <div className="space-y-2 pt-1">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arahan</h4>
                        <p className="text-lg font-bold text-slate-800 leading-snug">
                          "{step.instruction}"
                        </p>
                      </div>
                    </div>

                    {step.note && (
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
                          <Info size={24} className="text-emerald-600" />
                        </div>
                        <div className="space-y-1 pt-1">
                          <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Tip Penting</h4>
                          <p className="text-sm text-slate-500 font-medium">
                            {step.note}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-4 pt-4">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={16} /> Kembali
                </button>
                <button 
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 group"
                >
                  {currentStep === steps.length - 1 ? 'Selesai' : 'Langkah Seterusnya'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Visual Aid */}
            <div className="order-1 lg:order-2 space-y-4">
              <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] relative overflow-hidden group border border-slate-100">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Visual Aid Placeholder</span>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-colors">
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Sticky */}
        <div className="lg:hidden p-6 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-4">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="py-4 bg-white text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 transition-all disabled:opacity-30 shadow-sm"
          >
            Kembali
          </button>
          <button 
            onClick={nextStep}
            className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Selesai' : 'Seterusnya'}
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Recommended Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-colors">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
             <BookOpen size={20} />
           </div>
           <div>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seterusnya</h4>
             <p className="text-sm font-black text-emerald-950 uppercase italic leading-tight">Adab Tidur & Bangun</p>
           </div>
        </div>
        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 transition-colors">
           <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
             <PlayCircle size={20} />
           </div>
           <div>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktiviti</h4>
             <p className="text-sm font-black text-emerald-950 uppercase italic leading-tight">Kuiz Wuduk & Solat</p>
           </div>
        </div>
      </div>
    </div>
  );
}

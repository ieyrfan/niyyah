import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Fingerprint, ShieldCheck, 
  Droplets, Waves, Moon, Heart, Star, Users,
  Play, BookOpen, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { MUALAF_MODULES, MualafModuleContent, MualafStep } from '../data/mualafContent';
import { cn } from '../lib/utils';

const iconMap: Record<string, any> = {
  Fingerprint, ShieldCheck, Droplets, Waves, Moon, Heart, Star, Users
};

export function MualafModule() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const module = MUALAF_MODULES.find(m => m.id === id);

  if (!module) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Modul tidak dijumpai</h2>
      <Link to="/mualaf" className="text-emerald-600 font-bold uppercase tracking-widest text-xs mt-4 inline-block">Kembali ke Hab Mualaf</Link>
    </div>
  );

  const Icon = iconMap[module.icon] || BookOpen;
  const subModule = activeSubModule ? module.subModules?.find(s => s.id === activeSubModule) : null;
  const steps = subModule ? subModule.steps : (module.steps || []);
  const hasSteps = steps.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-32 px-4"
    >
      {/* Header */}
      <header className="mb-8">
        <button 
          onClick={() => navigate('/mualaf')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 hover:text-emerald-600 transition-colors"
        >
          <ChevronLeft size={16} /> Kembali
        </button>
        
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-600/20">
            <Icon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-emerald-950 uppercase italic tracking-tighter">
              {module.title}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                {module.description}
              </p>
              {module.videoUrl && (
                <a 
                  href={module.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                >
                  <Play size={10} fill="currentColor" /> Tonton Video
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sub Modules Selector */}
      {module.subModules && !activeSubModule && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {module.subModules.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSubModule(sub.id);
                setCurrentStep(0);
              }}
              className="p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] hover:border-emerald-200 transition-all text-left flex items-center justify-between group shadow-sm"
            >
              <span className="font-black text-slate-800 uppercase tracking-tight">{sub.title}</span>
              <div className="w-10 h-10 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl flex items-center justify-center transition-all">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Content Section */}
      <AnimatePresence mode="wait">
        {((activeSubModule || !module.subModules) && hasSteps) ? (
          <motion.div 
            key={activeSubModule || 'base'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {activeSubModule && (
               <button 
                onClick={() => setActiveSubModule(null)}
                className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full"
              >
                <ChevronLeft size={14} /> Pilih {module.title} Lain
              </button>
            )}

            {/* Step Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                    Langkah {steps[currentStep].step} daripada {steps.length}
                  </p>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mt-1">{steps[currentStep].name}</h3>
                </div>
                <div className="hidden sm:flex gap-2">
                   {steps.map((_, idx) => (
                     <div 
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        idx === currentStep ? "w-6 bg-emerald-600" : "bg-slate-200"
                      )}
                     />
                   ))}
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-8">
                <div className="space-y-4 max-w-2xl w-full">
                  <div className="w-full aspect-video bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 relative border border-dashed border-slate-200">
                    <Play size={40} className="opacity-20" />
                    <p className="absolute bottom-4 text-[8px] font-black uppercase tracking-widest opacity-40">Visual Aid Placeholder</p>
                  </div>
                  
                  <p className="text-slate-500 font-medium text-base leading-relaxed px-4 italic">
                    "{steps[currentStep].action}"
                  </p>
                </div>

                {steps[currentStep].arabic && (
                  <div className="space-y-6 w-full">
                    <div className="py-8 px-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50">
                      <p className="font-arabic text-4xl md:text-5xl text-emerald-950 leading-[1.8]">{steps[currentStep].arabic}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-emerald-600/70 text-[10px] font-black uppercase tracking-widest italic">{steps[currentStep].rumi}</p>
                      <p className="text-slate-800 text-lg font-bold font-serif italic max-w-xl mx-auto leading-relaxed">"{steps[currentStep].translation}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="p-6 border-t border-slate-50 flex items-center justify-between gap-4">
                <button 
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="p-4 bg-slate-50 text-slate-400 rounded-[1.5rem] hover:text-emerald-600 transition-all disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => {
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      setActiveSubModule(null);
                      navigate('/mualaf');
                    }
                  }}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  {currentStep === steps.length - 1 ? 'Selesai Modul' : 'Langkah Seterusnya'} <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-slate max-w-none bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
               <BookOpen size={24} className="text-emerald-600" />
               <h3 className="text-xl font-black text-slate-800 uppercase m-0">Kandungan Modul</h3>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
              {module.content || "Kandungan sedang dikemaskini. Sila tunggu kemas kini seterusnya."}
            </p>
            
            {module.id === 'support' && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-4 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-emerald-900 font-bold hover:bg-emerald-100 transition-all">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Users size={24} />
                  </div>
                  <span className="uppercase text-[10px] tracking-widest">Sertai Group Support</span>
                </button>
                <Link to="/komuniti" className="flex flex-col items-center gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-slate-900 font-bold hover:bg-slate-100 transition-all">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Star size={24} />
                  </div>
                  <span className="uppercase text-[10px] tracking-widest">Tanya Ustaz</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

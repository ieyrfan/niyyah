import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Wallet, Coins, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function ZakatPage() {
  const { t } = useLanguage();
  const [simpanan, setSimpanan] = useState<string>('');
  const [emasGram, setEmasGram] = useState<string>('');
  const [pelaburan, setPelaburan] = useState<string>('');
  const [goldPrice] = useState(380); // Approx current gold price per gram RM
  const [zakatRate] = useState(0.025);
  const NISAB = 24500; // Updated approx nisab for 2024 (approx 85g gold)

  const emasValue = (parseFloat(emasGram) || 0) * goldPrice;
  const wealthNum = (parseFloat(simpanan) || 0) + emasValue + (parseFloat(pelaburan) || 0);
  const isQualify = wealthNum >= NISAB;
  const zakatAmount = isQualify ? (wealthNum * zakatRate).toFixed(2) : '0.00';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-4 lg:space-y-6 pb-20 px-4"
    >
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[7.5px] font-bold uppercase tracking-widest">
            <Calculator size={10} />
            {t('zakat.subtitle')}
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-emerald-950 uppercase italic underline decoration-emerald-200">{t('zakat.title')}</h2>
          <p className="text-[9px] font-medium text-slate-500 max-w-sm uppercase tracking-wide">
            {t('zakat.desc')}
          </p>
        </div>
        <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-emerald-600/30 transform rotate-12 relative z-10">
           <Coins size={24} />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rotate-45 translate-x-12 -translate-y-12 rounded-full"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <div className="space-y-3">
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('zakat.type.saving')} (RM)</label>
                  <div className="relative">
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">RM</span>
                     <input 
                       type="number"
                       value={simpanan}
                       onChange={(e) => setSimpanan(e.target.value)}
                       placeholder="0.00"
                       className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:ring-4 focus:ring-emerald-500/10 text-base font-black text-slate-800 transition-all"
                     />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('zakat.type.gold')} (Gram)</label>
                  <div className="relative">
                     <input 
                       type="number"
                       value={emasGram}
                       onChange={(e) => setEmasGram(e.target.value)}
                       placeholder="0.0 g"
                       className="w-full pl-5 pr-14 py-3 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:ring-4 focus:ring-emerald-500/10 text-base font-black text-slate-800 transition-all"
                     />
                     <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">Gram</span>
                  </div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase pl-2 italic">Anggaran Harga: RM{goldPrice}/gram</p>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-2">{t('zakat.type.business')} (RM)</label>
                  <div className="relative">
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-black text-slate-300">RM</span>
                     <input 
                       type="number"
                       value={pelaburan}
                       onChange={(e) => setPelaburan(e.target.value)}
                       placeholder="0.00"
                       className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:ring-4 focus:ring-emerald-500/10 text-base font-black text-slate-800 transition-all"
                     />
                  </div>
               </div>
            </div>

           <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
              <div className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={14} />
              </div>
              <div className="space-y-0.5">
                 <h4 className="text-[9px] font-black text-emerald-950 uppercase tracking-tight">{t('zakat.status_title')}</h4>
                 <p className="text-[8.5px] text-emerald-700 font-bold uppercase leading-relaxed">
                   {isQualify 
                     ? t('zakat.qualify_true') 
                     : t('zakat.qualify_false').replace('{nisab}', NISAB.toLocaleString())}
                 </p>
              </div>
            </div>

        </div>

        <div className="bg-slate-900 text-white p-6 md:p-8 lg:p-10 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden group min-h-[300px]">
            <div className="space-y-0.5 relative z-10 w-full overflow-hidden">
              <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.3em]">{t('zakat.pay_label')}</p>
              <div className="flex items-baseline gap-2 flex-wrap min-h-[4rem]">
                 <span className="text-lg font-black opacity-50">RM</span>
                 <span className={cn(
                   "font-black tracking-tighter text-emerald-50 group-hover:text-emerald-400 transition-all animate-in fade-in duration-700 break-all leading-none",
                   zakatAmount.toString().length > 15 ? "text-xl md:text-2xl" : zakatAmount.toString().length > 10 ? "text-2xl md:text-3xl" : zakatAmount.toString().length > 7 ? "text-3xl md:text-4xl" : "text-4xl md:text-6xl"
                 )}>
                    {Number(zakatAmount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                 </span>
              </div>
           </div>

           <div className="space-y-3 relative z-10 mt-6">
              <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-lg border border-white/10">
                <Info size={12} className="text-emerald-400" />
                <p className="text-[8.5px] font-bold text-white/60 uppercase leading-snug">{t('zakat.info_rate')}</p>
              </div>
              
              <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[9px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3">
                {t('zakat.pay_btn')} <ArrowRight size={16} />
              </button>
           </div>
           
           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rotate-45 translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700"></div>
        </div>
      </div>

      <footer className="text-center space-y-4">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-8">{t('zakat.footer')}</p>
      </footer>
    </motion.div>
  );
}

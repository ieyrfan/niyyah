import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Zap, Globe, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function DermaPage() {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState('');

  const handleDerma = () => {
    const finalAmount = customAmount || selectedAmount;
    alert(t('derma.sim_alert').replace('{amount}', finalAmount?.toString() || '0'));
    // In production, this will call the API route we defined in specs
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20 px-4"
    >
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl mb-4">
          <Heart size={32} fill="currentColor" />
        </div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 italic">{t('derma.title')}</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          {t('derma.desc')}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Donation Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
          <div>
            <h3 className="font-bold text-lg text-slate-900">{t('derma.amount_label')}</h3>
            <p className="text-xs text-slate-500">{t('derma.amount_desc')}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[10, 30, 50, 100, 200, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                className={cn(
                  "py-4 rounded-xl border-2 font-bold transition-all",
                  selectedAmount === amount 
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700" 
                    : "border-slate-100 hover:border-emerald-200 text-slate-600"
                )}
              >
                RM{amount}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">RM</span>
            <input 
              type="number" 
              placeholder={t('derma.custom_amount')}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold"
            />
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleDerma}
              className="w-full py-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 group"
            >
              {t('derma.pay_btn')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">{t('derma.secure')}</p>
          </div>
        </div>

        {/* Why Donate */}
        <div className="space-y-8">
          <h3 className="font-serif font-bold text-2xl italic text-slate-900">{t('derma.why_title')}</h3>
          
          <div className="space-y-6">
            {[
              { icon: ShieldCheck, title: t('derma.reason1_title'), desc: t('derma.reason1_desc') },
              { icon: Zap, title: t('derma.reason2_title'), desc: t('derma.reason2_desc') },
              { icon: Globe, title: t('derma.reason3_title'), desc: t('derma.reason3_desc') },
              { icon: MessageSquare, title: t('derma.reason4_title'), desc: t('derma.reason4_desc') },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-4">
            <p className="text-xs text-emerald-800 italic leading-relaxed">
              {t('derma.hadith')}
            </p>
            <div className="pt-4 border-t border-emerald-200">
               <h4 className="text-xs font-black text-emerald-900 uppercase tracking-widest mb-2">Sedekah Terus ke Masjid</h4>
               <a 
                 href="https://sedekah.je/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center justify-between p-4 bg-white rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all group"
               >
                 <span className="font-bold text-sm">Klik untuk Infak (Sedekah.je)</span>
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

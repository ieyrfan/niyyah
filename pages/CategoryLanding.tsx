import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, Clock, Users, Settings, 
  GraduationCap, Book, Heart, Fingerprint, 
  Sparkles, History, Compass, CheckCircle2, 
  Calculator, Moon, HandHeart
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const items: Record<string, any[]> = {
  learn: [
    { icon: BookOpen, labelKey: 'nav.quran', path: '/quran' },
    { icon: GraduationCap, labelKey: 'nav.iqra', path: '/iqra' },
    { icon: BookOpen, labelKey: 'nav.muqaddam', path: '/muqaddam' },
    { icon: Book, labelKey: 'nav.hadis', path: '/hadis' },
    { icon: Heart, labelKey: 'nav.doa', path: '/doa' },
    { icon: Fingerprint, labelKey: 'nav.zikir', path: '/zikir' },
    { icon: Sparkles, labelKey: 'nav.99names', path: '/asmaul-husna' },
    { icon: History, labelKey: 'nav.sirah', path: '/sirah' },
  ],
  pray: [
    { icon: Clock, labelKey: 'nav.jadual', path: '/jadual' },
    { icon: Compass, labelKey: 'nav.kiblat', path: '/kiblat' },
    { icon: CheckCircle2, labelKey: 'nav.tracker', path: '/solat' },
    { icon: Calculator, labelKey: 'nav.zakat', path: '/zakat' },
    { icon: Moon, labelKey: 'nav.ramadan', path: '/ramadan' },
  ],
  ummah: [
    { icon: GraduationCap, labelKey: 'nav.kelas', path: '/kelas' },
    { icon: Users, labelKey: 'nav.komuniti', path: '/komuniti' },
    { icon: GraduationCap, labelKey: 'nav.mualaf', path: '/mualaf' },
  ],
  more: [
    { icon: HandHeart, labelKey: 'nav.derma', path: '/derma' },
    { icon: Settings, labelKey: 'nav.tetapan', path: '/tetapan' },
  ]
};

export function CategoryLanding() {
  const { category } = useParams<{ category: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const categoryItems = category ? items[category] : [];

  if (!categoryItems.length) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-3xl font-black text-emerald-950 uppercase italic tracking-tighter">
          {t(`nav.${category}`)}
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
          Terokai kandungan {t(`nav.${category}`)} Niyyah
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-slate-50 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shadow-sm">
              <item.icon size={20} />
            </div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center">
              {t(item.labelKey)}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

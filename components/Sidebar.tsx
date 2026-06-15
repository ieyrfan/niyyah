import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Clock, 
  Compass, 
  Heart, 
  Users, 
  Settings, 
  HandHeart,
  Calendar,
  Search,
  Menu,
  X,
  UserCircle,
  LogOut,
  CheckCircle2,
  GraduationCap,
  History,
  Moon,
  Fingerprint,
  Sparkles,
  Calculator,
  Book,
  ChevronDown,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';

const menuGroups = [
  {
    id: 'home',
    labelKey: 'nav.home',
    icon: Home,
    path: '/'
  },
  {
    id: 'learn',
    labelKey: 'nav.learn',
    icon: BookOpen,
    items: [
      { icon: BookOpen, labelKey: 'nav.quran', path: '/quran' },
      { icon: GraduationCap, labelKey: 'nav.iqra', path: '/iqra' },
      { icon: BookOpen, labelKey: 'nav.muqaddam', path: '/muqaddam' },
      { icon: Book, labelKey: 'nav.hadis', path: '/hadis' },
      { icon: Heart, labelKey: 'nav.doa', path: '/doa' },
      { icon: Fingerprint, labelKey: 'nav.zikir', path: '/zikir' },
      { icon: Sparkles, labelKey: 'nav.99names', path: '/asmaul-husna' },
      { icon: History, labelKey: 'nav.sirah', path: '/sirah' },
    ]
  },
  {
    id: 'pray',
    labelKey: 'nav.pray',
    icon: Clock,
    items: [
      { icon: Clock, labelKey: 'nav.jadual', path: '/jadual' },
      { icon: Compass, labelKey: 'nav.kiblat', path: '/kiblat' },
      { icon: CheckCircle2, labelKey: 'nav.tracker', path: '/solat' },
      { icon: Calculator, labelKey: 'nav.zakat', path: '/zakat' },
      { icon: Moon, labelKey: 'nav.ramadan', path: '/ramadan' },
    ]
  },
  {
    id: 'ummah',
    labelKey: 'nav.ummah',
    icon: Users,
    items: [
      { icon: GraduationCap, labelKey: 'nav.kelas', path: '/kelas' },
      { icon: Users, labelKey: 'nav.komuniti', path: '/komuniti' },
      { icon: GraduationCap, labelKey: 'nav.mualaf', path: '/mualaf' },
    ]
  },
  {
    id: 'more',
    labelKey: 'nav.more',
    icon: Settings,
    items: [
      { icon: HandHeart, labelKey: 'nav.derma', path: '/derma' },
      { icon: Settings, labelKey: 'nav.tetapan', path: '/tetapan' },
      { icon: Info, labelKey: 'nav.about', path: '/about' },
    ]
  }
];

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(['learn', 'pray']);
  const { user, signIn, signOut, profile, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-50 lg:hidden px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-600/20">N</div>
          <h1 className="text-xl font-black text-emerald-950 tracking-tighter">NIYYAH</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400">
            <Search size={22} />
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl active:scale-90 transition-all border border-emerald-100"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-[180px] bg-white border-r border-slate-100 transform transition-all duration-500 ease-in-out lg:translate-x-0 font-sans shadow-2xl shadow-slate-200/50",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 pt-4 lg:pt-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-lg shadow-emerald-600/20">N</div>
                <div>
                  <h1 className="text-base font-black text-emerald-950 tracking-tighter leading-none italic">NIYYAH</h1>
                  <p className="text-[6.5px] text-emerald-600 font-black uppercase tracking-[0.2em] mt-0.5">{t('nav.tagline')}</p>
                </div>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="relative group hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder={t('nav.search')}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white rounded-xl py-2.5 pl-10 pr-3 text-[9px] font-bold uppercase tracking-widest outline-none transition-all text-slate-900 placeholder:text-slate-300"
              />
            </div>
          </div>

          <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto no-scrollbar pb-8">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[7.5px] font-black text-slate-300 uppercase tracking-[0.3em]">{t('nav.menu')}</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setLanguage('ms')}
                  className={cn(
                    "w-5 h-5 flex items-center justify-center rounded text-[7.5px] font-black tracking-tighter transition-all shadow-sm",
                    language === 'ms' ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                  )}
                >
                  MS
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "w-5 h-5 flex items-center justify-center rounded text-[7.5px] font-black tracking-tighter transition-all shadow-sm",
                    language === 'en' ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
            
            {menuGroups.map((group) => (
              <div key={group.id} className="space-y-0.5">
                {group.path ? (
                  <NavLink
                    to={group.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-2 py-2 text-[8.5px] font-black uppercase tracking-[0.15em] rounded-lg transition-all group relative",
                      isActive 
                        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/30" 
                        : "text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/50"
                    )}
                  >
                    <group.icon size={14} />
                    {t(group.labelKey)}
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-2 text-[8.5px] font-black uppercase tracking-[0.15em] rounded-lg transition-all group",
                        expandedGroups.includes(group.id) ? "text-emerald-700 bg-emerald-50/30" : "text-slate-400 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <group.icon size={14} />
                        {t(group.labelKey)}
                      </div>
                      <ChevronDown size={12} className={cn("transition-transform", expandedGroups.includes(group.id) && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedGroups.includes(group.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-slate-50/30 rounded-xl"
                        >
                          {group.items?.map((item) => (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className={({ isActive }) => cn(
                                "flex items-center gap-3 pl-8 pr-3 py-2 text-[8.5px] font-bold uppercase tracking-[0.15em] transition-all",
                                isActive ? "text-emerald-600" : "text-slate-400 hover:text-emerald-600"
                              )}
                            >
                              {t(item.labelKey)}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-50 space-y-4">
            {/* Auth Section */}
            {!loading && (
              <div className="">
                {user ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={profile?.nama_paparan} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center"><UserCircle size={14} className="text-slate-400" /></div>
                        )}
                      </div>
                      <div className="overflow-hidden whitespace-nowrap">
                        <p className="text-[10px] font-bold text-slate-900 truncate w-16">{profile?.nama_paparan || t('komuniti.anon')}</p>
                        <p className="text-[7.5px] text-emerald-600 font-bold uppercase tracking-widest leading-none">{profile && `342 ${t('nav.saham')}`}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => signOut()}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <LogOut size={12} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => signIn()}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg text-[9px] tracking-widest uppercase hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
                  >
                    {t('nav.login')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

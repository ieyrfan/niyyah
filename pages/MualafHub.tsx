import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, 
  Heart, 
  MessageCircle, 
  Users, 
  HelpCircle, 
  Video, 
  Phone, 
  ChevronRight, 
  Play, 
  Volume2, 
  Sparkles, 
  Info, 
  Send,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  GraduationCap,
  ExternalLink,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot,
  Timestamp,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { MUALAF_MODULES } from '../data/mualafContent';
import { useAuth, handleFirestoreError, OperationType } from '../lib/AuthContext';
import { useLanguage } from '../lib/LanguageContext';

// --- DATA ---

const getBasicsModules = (t: any) => [
  { id: 'syahadah', title: t('mualaf.syahadah.title'), description: t('mualaf.syahadah.desc'), video: 'https://www.youtube.com/embed/5H3X2hO7Rkw' },
  { id: 'mandi', title: t('mualaf.mandi.title'), description: t('mualaf.mandi.desc'), video: 'https://www.youtube.com/embed/rP-8m_T7y0s' },
  { id: 'wuduk', title: t('mualaf.wuduk.title'), description: t('mualaf.wuduk.desc'), video: 'https://www.youtube.com/embed/6iI-7X_f6yA' },
  { id: 'tayammum', title: t('mualaf.tayammum.title'), description: t('mualaf.tayammum.desc'), video: 'https://www.youtube.com/embed/tayammum_guide' },
  { id: 'solat', title: t('mualaf.solat_module.title'), description: t('mualaf.solat_module.desc'), video: 'https://www.youtube.com/embed/solat_full_mualaf' },
  { id: 'puasa', title: t('mualaf.puasa.title'), description: t('mualaf.puasa.desc'), video: 'https://www.youtube.com/embed/puasa_mualaf' },
  { id: 'zakat', title: t('mualaf.zakat.title'), description: t('mualaf.zakat.desc'), video: 'https://www.youtube.com/embed/zakat_fitrah_guide' },
  { id: 'korban', title: t('mualaf.korban.title'), description: t('mualaf.korban.desc'), video: 'https://www.youtube.com/embed/korban_aqiqah_guide' }
];

const getDailyDoas = (t: any) => [
  { title: t('doa.wakeup.title'), arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', rumi: 'Alhamdulillahil ladzi ahyana ba\'da ma amatana wa ilaihin nushur', maksud: t('doa.wakeup.maksud') },
  { title: t('doa.toilet_in.title'), arab: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', rumi: 'Allahumma inni a\'uzu bika minal khubuthi wal khabaith', maksud: t('doa.toilet_in.maksud') },
  { title: t('doa.toilet_out.title'), arab: 'غُفْرَانَكَ الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَى وَعَافَانِي', rumi: 'Ghufranakal hamdu lillahil ladzi adzhaba \'annil aza wa \'afani', maksud: t('doa.toilet_out.maksud') },
  { title: t('doa.eat_before.title'), arab: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ', rumi: 'Allahumma barik lana fima razaqtana waqina adzaban nar', maksud: t('doa.eat_before.maksud') },
  { title: t('doa.eat_after.title'), arab: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', rumi: 'Alhamdulillahil ladzi at\'amana wa saqana wa ja\'alana muslimin', maksud: t('doa.eat_after.maksud') },
  { title: t('doa.house_out.title'), arab: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ', rumi: 'Bismillahi tawakkaltu \'alallah, la hawla wala quwwata illa billah', maksud: t('doa.house_out.maksud') },
  { title: t('doa.house_in.title'), arab: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا', rumi: 'Allahumma inni as-aluka khairal mawliji wa khairal makhraji, bismillahi walajna wa bismillahi kharajna wa \'alallahi rabbina tawakkalna', maksud: t('doa.house_in.maksud') },
  { title: t('doa.travel.title'), arab: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', rumi: 'Subhanal ladzi sakhara lana hadza wama kunna lahu muqrinin wa inna ila rabbina lamunqalibun', maksud: t('doa.travel.maksud') },
  { title: t('doa.sleep.title'), arab: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', rumi: 'Bismika Allahumma amutu wa ahya', maksud: t('doa.sleep.maksud') },
  { title: t('doa.protection.title'), arab: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', rumi: 'A\'uzu bikalimatillahit tammaati min sharri ma khalaq', maksud: t('doa.protection.maksud') },
  { title: t('doa.study.title'), arab: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقدَةً مِن لِسَانِي يَفقَهُوا قَولِي', rumi: 'Rabbi-shrahli sadri wa yassirli amri wahlul uqdatam mil lisani yafqahu qawli', maksud: t('doa.study.maksud') },
  { title: t('doa.rabbana.title'), arab: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', rumi: 'Rabbana atina fid dunya hasanatan wa fil akhirati hasanatan waqina \'adzaban nar', maksud: t('doa.rabbana.maksud') }
];

const getQuranRumi = (t: any) => [
  { title: 'Surah Al-Fatihah', rumi: 'Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-alamin. Ar-rahmanir-rahim. Maliki yawmid-din. Iyyaka na\'budu wa iyyaka nasta\'in. Ihdinas-siratal-mustaqim. Siratal-ladzina an\'amta \'alaihim, ghairil-maghdubi \'alaihim walad-dallin.', maksud: t('quran.fatihah.maksud') },
  { title: 'Surah Al-Ikhlas', rumi: 'Bismillahir-rahmanir-rahim. Qul huwallahu ahad. Allahus-samad. Lam yalid walam yulad. Walam yakul lahu kufuwan ahad.', maksud: t('quran.ikhlas.maksud') },
  { title: 'Surah Al-Falaq', rumi: 'Bismillahir-rahmanir-rahim. Qul a\'uzu birabbil-falaq. Min sharri ma khalaq. Wamin sharri ghasiqin iza waqab. Wamin sharrin-naffathati fil-uqad. Wamin sharri khasidin iza khasad.', maksud: t('quran.falaq.maksud') },
  { title: 'Surah An-Naas', rumi: 'Bismillahir-rahmanir-rahim. Qul a\'uzu birabbin-naas. Malikin-naas. Ilahin-naas. Min sharril-waswasil-khannaas. Al-ladzi yuwas-wisu fi sudurin-naas. Minal-jinnati wan-naas.', maksud: t('quran.nas.maksud') },
  { title: 'Surah Al-Kauthar', rumi: 'Bismillahir-rahmanir-rahim. Inna a\'tainakal-kauthar. Fasalli lirabbika wanhar. Inna shani\'aka huwal-abtar.', maksud: t('quran.kauthar.maksud') },
  { title: 'Surah An-Nasr', rumi: 'Bismillahir-rahmanir-rahim. Iza ja-a nasrullahi wal-fath. Wara-aitan-nasa yadkhuluna fi dinillahi afwaja. Fasabbih bihamdi rabbika wastaghfirh. Innahu kana tawwaba.', maksud: t('quran.nasr.maksud') },
  { title: 'Ayat Kursi', rumi: 'Allahu la ilaha illa huwal hayyul qayyum. La ta\'khuzuhu sinatun wala nawm. Lahu ma fis-samawati wama fil-ard. Man zal-ladzi yashfa\'u \'indahu illa bi-idznih. Ya\'lamu ma baina aidihim wama khalfahum...', maksud: t('quran.kursi.maksud') }
];

// --- COMPONENTS ---

export function MualafHub() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'basics' | 'doa' | 'solat' | 'quran' | 'support' | 'community'>('basics');
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentors, setMentors] = useState<any[]>([]);

  // Q&A Logic
  useEffect(() => {
    if (!user) return;
    const path = `users/${user.uid}/mualaf_qa`;
    const q = query(
      collection(db, path),
      orderBy('created_at', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
    return () => unsubscribe();
  }, [user]);

  // Mentors Logic
  useEffect(() => {
    const path = 'mualaf_mentors';
    const q = query(collection(db, path), where('is_approved', '==', true));
    getDocs(q).then(snapshot => {
      setMentors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }).catch(error => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  }, []);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !user) return;
    setIsSubmitting(true);
    const path = `users/${user.uid}/mualaf_qa`;
    try {
      await addDoc(collection(db, path), {
        soalan: newQuestion,
        created_at: serverTimestamp(),
        is_public: false
      });
      setNewQuestion('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basics', label: t('mualaf.tab.basics'), icon: Book },
    { id: 'doa', label: t('mualaf.tab.doa'), icon: Heart },
    { id: 'solat', label: t('mualaf.tab.solat'), icon: Play },
    { id: 'quran', label: t('mualaf.tab.quran'), icon: Sparkles },
    { id: 'support', label: t('mualaf.tab.support'), icon: MessageCircle },
    { id: 'community', label: t('mualaf.tab.community'), icon: Users },
  ];

  const BASICS_MODULES = getBasicsModules(t);
  const DAILY_DOAS = getDailyDoas(t);
  const QURAN_RUMI = getQuranRumi(t);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20 px-2"
    >
      <header className="py-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border border-indigo-100 shadow-sm">
          <GraduationCap size={14} />
          {t('mualaf.subtitle')}
        </div>
        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
          {t('mualaf.title')}
        </h2>
        <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
          {t('mualaf.desc')}
        </p>
      </header>

      {/* Tab Navigation */}
      <nav className="flex gap-2 overflow-x-auto pb-6 no-scrollbar lg:justify-center px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2",
              activeTab === tab.id 
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/20" 
                : "bg-white text-slate-400 border-slate-50 hover:border-indigo-100"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'basics' && (
            <motion.div 
              key="basics"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {MUALAF_MODULES.map((module, idx) => (
                <Link 
                  to={`/mualaf/${module.id}`}
                  key={module.id} 
                  className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 hover:border-emerald-200 transition-all flex flex-col gap-8 group shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      0{idx + 1}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic leading-tight group-hover:text-emerald-900">{module.title}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-2">{module.description}</p>
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] group-hover:text-emerald-600">Klik untuk mula</span>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}

          {activeTab === 'doa' && (
            <motion.div 
              key="doa"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {DAILY_DOAS.map((doa, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 space-y-8 group hover:border-rose-100 transition-all cursor-pointer shadow-sm">
                   <div className="flex justify-between items-center">
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                       <Heart size={16} className="text-rose-500" />
                       {doa.title}
                     </h3>
                     <button className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                       <Volume2 size={16} />
                     </button>
                   </div>
                   <div className="space-y-6">
                     <p className="font-arabic text-3xl leading-[1.8] text-right text-slate-900" dir="rtl">{doa.arab}</p>
                     <div className="space-y-2 bg-slate-50 p-6 rounded-2xl">
                       <p className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest">{t('mualaf.rumi.label')}</p>
                       <p className="text-xs font-bold text-slate-700 italic tracking-wide">{doa.rumi}</p>
                     </div>
                     <div className="space-y-2 border-l-2 border-rose-100 pl-4">
                        <p className="text-rose-400 font-bold text-[11px] uppercase tracking-widest">{t('mualaf.maksud.label')}</p>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{doa.maksud}"</p>
                     </div>
                   </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'solat' && (
            <motion.div 
              key="solat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 space-y-12"
            >
              <div className="text-center space-y-4">
                 <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">{t('mualaf.solat.title')}</h3>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('mualaf.solat.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  {[
                    { step: 1, action: t('mualaf.solat.step1.title'), detail: t('mualaf.solat.step1.desc') },
                    { step: 2, action: t('mualaf.solat.step2.title'), detail: t('mualaf.solat.step2.desc') },
                    { step: 3, action: t('mualaf.solat.step3.title'), detail: t('mualaf.solat.step3.desc') },
                    { step: 4, action: t('mualaf.solat.step4.title'), detail: t('mualaf.solat.step4.desc') },
                    { step: 5, action: t('mualaf.solat.step5.title'), detail: t('mualaf.solat.step5.desc') },
                    { step: 6, action: t('mualaf.solat.step6.title'), detail: t('mualaf.solat.step6.desc') },
                  ].map(item => (
                    <div key={item.step} className="flex gap-6 p-6 rounded-3xl bg-slate-50 group hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                      <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ring-1 ring-slate-200">
                        {item.step}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{item.action}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                  <div className="aspect-video w-full bg-slate-900 rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-2xl">
                     <iframe className="w-full h-full" src="https://www.youtube.com/embed/solat_full_guide"></iframe>
                  </div>
                  <div className="bg-amber-50 p-8 rounded-[2.5rem] border-2 border-amber-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <Info size={18} className="text-amber-600" />
                      <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-[0.2em]">{t('mualaf.solat.important')}</h4>
                    </div>
                    <ul className="space-y-3">
                      {[
                        t('mualaf.solat.note1'),
                        t('mualaf.solat.note2'),
                        t('mualaf.solat.note3'),
                        t('mualaf.solat.note4')
                      ].map((note, i) => (
                        <li key={i} className="text-[10px] font-bold text-amber-700 uppercase tracking-widest flex items-start gap-2 italic">
                          <span className="w-1 h-1 bg-amber-400 rounded-full mt-1.5 shrink-0"></span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'quran' && (
            <motion.div 
              key="quran"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-4 text-amber-800 shadow-sm">
                <Sparkles size={24} className="text-amber-500 mt-1 shrink-0" />
                <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{t('mualaf.rumi.notice')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {QURAN_RUMI.map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 space-y-6 hover:border-indigo-200 transition-all shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{item.title}</h3>
                      <Volume2 size={18} className="text-indigo-400" />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2 bg-indigo-50/30 p-5 rounded-2xl border border-indigo-50">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 block">{t('mualaf.rumi.label')}</span>
                        <p className="text-xs font-black text-slate-700 leading-loose italic">{item.rumi}</p>
                      </div>
                      <div className="space-y-2 pl-4 border-l-2 border-slate-100 italic font-bold">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 block">{t('mualaf.maksud.label')}</span>
                        <p className="text-xs text-slate-500 leading-relaxed leading-loose">{item.maksud}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div 
              key="support"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Motivation Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl shadow-indigo-600/20">
                  <Sparkles size={40} className="text-indigo-300 opacity-50" />
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight italic">{t('mualaf.motivation.title')}</h3>
                    <p className="text-sm font-medium text-indigo-100 leading-relaxed italic">"Sesungguhnya bersama setiap kesukaran itu ada kemudahan." (Surah Al-Insyirah: 6)</p>
                  </div>
                  <div className="pt-6 border-t border-indigo-500/30">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2">{t('mualaf.emotion_tip')}</p>
                     <p className="text-xs font-bold text-white/80 leading-loose">{t('mualaf.emotion_text')}</p>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 space-y-8 shadow-sm">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                       <MessageCircle size={24} />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic leading-none">{t('mualaf.qa.title')}</h3>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">{t('mualaf.qa.desc')}</p>
                   
                   <form onSubmit={handleAskQuestion} className="space-y-4">
                     <textarea 
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder={t('mualaf.qa.placeholder')}
                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-sm font-bold shadow-inner focus:border-indigo-100 focus:bg-white transition-all outline-none min-h-[120px]"
                     />
                     <button 
                        disabled={isSubmitting || !newQuestion.trim() || !user}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                     >
                       {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                       {t('mualaf.qa.submit')}
                     </button>
                    {!user && <p className="text-[10px] font-black text-rose-500 text-center uppercase tracking-widest">{t('mualaf.qa.login_required')}</p>}
                   </form>
                </div>
              </div>

              {/* Private Q&A History */}
              {user && questions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{t('mualaf.qa.history')}</h4>
                  </div>
                  <div className="space-y-4">
                    {questions.map((q) => (
                      <div key={q.id} className="bg-white p-6 rounded-[2rem] border-2 border-slate-50 space-y-6">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-black text-slate-800 leading-relaxed text-indigo-600">Q: {q.soalan}</p>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            {q.created_at?.toDate().toLocaleDateString()}
                          </span>
                        </div>
                        {q.jawapan ? (
                          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                             <div className="flex items-center gap-2 mb-2">
                               <ShieldCheck size={12} className="text-emerald-600" />
                               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">{t('mualaf.qa.mentor_reply')}</span>
                             </div>
                             <p className="text-sm font-bold text-slate-700 leading-loose italic">{q.jawapan}</p>
                          </div>
                        ) : (
                          <div className="text-[9px] font-black text-slate-300 uppercase flex items-center gap-2 italic">
                            <Clock size={12} /> {t('mualaf.qa.waiting')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div 
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Community Groups */}
                <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-50 space-y-8 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.05] rotate-12">
                     <Users size={120} />
                   </div>
                   <div className="space-y-3 relative z-10">
                     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">{t('mualaf.community.chat')}</h3>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">{t('mualaf.community.chat_desc')}</p>
                   </div>
                   <div className="space-y-4 pt-4 relative z-10">
                      <a 
                        href="https://t.me/mualaf_community_example" 
                        target="_blank" 
                        className="flex items-center justify-between p-6 bg-[#24A1DE]/5 text-[#24A1DE] border border-[#24A1DE]/10 rounded-[2rem] hover:bg-[#24A1DE] hover:text-white transition-all group shadow-sm"
                      >
                         <div className="flex items-center gap-4">
                           <div className="p-3 bg-white rounded-xl shadow-sm"><Phone size={20} /></div>
                           <div className="leading-tight">
                             <p className="text-xs font-black uppercase tracking-widest">{t('mualaf.community.tg')}</p>
                             <p className="text-[9px] font-bold opacity-70">{t('mualaf.community.tg_note')}</p>
                           </div>
                         </div>
                         <ChevronRight size={20} className="group-hover:translate-x-1" />
                      </a>
                      <a 
                        href="https://wa.me/60123456789" 
                        target="_blank" 
                        className="flex items-center justify-between p-6 bg-[#25D366]/5 text-[#25D366] border border-[#25D366]/10 rounded-[2rem] hover:bg-[#25D366] hover:text-white transition-all group shadow-sm"
                      >
                         <div className="flex items-center gap-4">
                           <div className="p-3 bg-white rounded-xl shadow-sm"><MessageCircle size={20} /></div>
                           <div className="leading-tight">
                             <p className="text-xs font-black uppercase tracking-widest">{t('mualaf.community.wa')}</p>
                             <p className="text-[9px] font-bold opacity-70">{t('mualaf.community.wa_note')}</p>
                           </div>
                         </div>
                         <ChevronRight size={20} className="group-hover:translate-x-1" />
                      </a>
                   </div>
                </div>

                {/* Mentor List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('mualaf.community.mentors')}</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{t('mualaf.community.online')}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {mentors.length > 0 ? mentors.map((mentor) => (
                      <div key={mentor.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 flex items-center justify-between gap-6 group hover:border-indigo-100 transition-all shadow-sm">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] border-2 border-white shadow-sm overflow-hidden shrink-0">
                            {mentor.avatar_url ? (
                              <img src={mentor.avatar_url} className="w-full h-full object-cover" alt={mentor.nama} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={28} /></div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{mentor.nama}</h4>
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">{mentor.kelulusan || t('mualaf.community.lecturer')}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <ShieldCheck size={10} className="text-emerald-500" />
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('mualaf.community.verified')}</span>
                            </div>
                          </div>
                        </div>
                        <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-sm">
                          {t('mualaf.community.chat_btn')}
                        </button>
                      </div>
                    )) : (
                      <div className="bg-slate-50 p-12 rounded-[3.5rem] border-2 border-dashed border-slate-100 text-center space-y-4 flex flex-col items-center">
                         <Users size={48} className="text-slate-200" />
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{t('mualaf.community.no_mentors')}</p>
                      </div>
                    )}
                    
                    {/* Add dummy for display if empty for now since db might be empty initially */}
                    {mentors.length === 0 && (
                       <div className="bg-white p-6 rounded-[2.5rem] border-2 border-indigo-50 flex items-center justify-between gap-6 opacity-60">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300"><User size={28} /></div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Ustaz Ahmad (Sample)</h4>
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Pensyarah UIAM</p>
                          </div>
                        </div>
                        <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest">{t('mualaf.community.book_btn')}</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

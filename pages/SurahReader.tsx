import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Play, Bookmark, Share2, Info, Pause, Volume2, Settings2, RotateCcw } from 'lucide-react';
import { fetchSurahDetail } from '../services/quranService';
import { Surah, Ayah } from '../types';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';
import { useAuth } from '../lib/AuthContext';

export function SurahReader() {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{ ayahs: Ayah[], surah: Surah } | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [repeatCount, setRepeatCount] = useState(1);
  const [currentRepeat, setCurrentRepeat] = useState(1);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!number) return;
      try {
        const detail = await fetchSurahDetail(parseInt(number), profile?.preferred_qari || 'ar.alafasy');
        setData(detail);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
    
    // Load Bookmarks
    const saved = localStorage.getItem('niyyah_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [number]);

  const toggleAudio = (ayahNumber: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyah === ayahNumber) {
      if (audioRef.current?.paused) {
        audioRef.current.play();
      } else {
        audioRef.current?.pause();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.volume = volume;
      
      audioRef.current.play();
      setPlayingAyah(ayahNumber);
      setCurrentRepeat(1);

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setAudioProgress(audioRef.current.currentTime);
          setAudioDuration(audioRef.current.duration);
        }
      };
      
      audioRef.current.onended = () => {
        if (currentRepeat < repeatCount) {
          setCurrentRepeat(prev => prev + 1);
          audioRef.current?.play();
        } else {
          const nextAyah = data?.ayahs[data.ayahs.findIndex(a => a.number === ayahNumber) + 1];
          if (nextAyah) {
            toggleAudio(nextAyah.number, nextAyah.audio);
          } else {
            setPlayingAyah(null);
          }
        }
      };
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioProgress(time);
    }
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleBookmark = (ayahNumber: number) => {
    let NewBookmarks = [...bookmarks];
    if (bookmarks.includes(ayahNumber)) {
      NewBookmarks = NewBookmarks.filter(b => b !== ayahNumber);
    } else {
      NewBookmarks.push(ayahNumber);
    }
    setBookmarks(NewBookmarks);
    localStorage.setItem('niyyah_bookmarks', JSON.stringify(NewBookmarks));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 animate-pulse">{t('quran.loading')}</p>
      </div>
    );
  }

  if (!data) return <div className="text-[10px] font-black uppercase text-slate-400 p-20 text-center tracking-widest">{t('quran.empty')}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto pb-20"
    >
      {/* Header Sticky */}
      <header className="sticky top-16 lg:top-0 z-30 flex items-center justify-between p-4 lg:p-6 bg-white/95 backdrop-blur-2xl border-b border-slate-50 mb-6 lg:mb-10 xl:rounded-b-[3rem] shadow-sm transition-colors">
        <button 
          onClick={() => navigate('/quran')}
          className="p-2.5 lg:p-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl lg:rounded-2xl transition-all active:scale-90 border border-emerald-100"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        
        <div className="text-center">
          <h2 className="font-serif font-black text-lg lg:text-xl italic text-emerald-950 tracking-tight transition-colors">{data.surah.englishName}</h2>
          <p className="text-[8px] lg:text-[9px] uppercase tracking-[0.3em] text-emerald-600 font-black">{data.surah.englishNameTranslation}</p>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <button 
            onClick={changeSpeed}
            className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-2 lg:py-2.5 bg-slate-900 text-[9px] lg:text-[10px] font-black text-white rounded-xl lg:rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10"
          >
            <Settings2 className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">{playbackSpeed}x</span>
          </button>
          <button className="p-2.5 lg:p-3 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-xl lg:rounded-2xl transition-colors border border-transparent">
            <Info className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </header>

      {/* Surah Intro */}
      <div className="text-center mb-10 lg:mb-16 space-y-6 lg:space-y-10 px-4 lg:px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-64 h-48 lg:h-64 bg-emerald-100/30 blur-3xl rounded-full -z-10"></div>
        <p className="font-arabic text-5xl lg:text-8xl text-slate-900 drop-shadow-sm transition-colors">{data.surah.name}</p>
        <div className="flex justify-center items-center gap-4 lg:gap-6 text-[8px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] lg:tracking-[0.4em]">
          <span className="bg-slate-100 px-3 lg:px-4 py-1.5 rounded-full transition-colors">{data.surah.revelationType}</span>
          <span>•</span>
          <span className="bg-slate-100 px-3 lg:px-4 py-1.5 rounded-full transition-colors">{t('quran.verses').replace('{num}', data.surah.numberOfAyahs.toString())}</span>
        </div>
        {data.surah.number !== 1 && data.surah.number !== 9 && (
          <div className="font-arabic text-3xl lg:text-5xl text-emerald-800 py-8 lg:py-12 italic leading-relaxed max-w-2xl mx-auto border-y border-emerald-50/50 transition-colors">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
      </div>

      {/* Ayahs List */}
      <div className="space-y-3 lg:space-y-4 px-2 lg:px-4">
        {data.ayahs.map((ayah, index) => (
          <div 
            key={ayah.number}
            className={cn(
              "group py-8 lg:py-20 border-b border-slate-50 transition-all px-6 lg:px-12 rounded-[2rem] lg:rounded-[4rem] relative overflow-hidden",
              playingAyah === ayah.number ? "bg-emerald-50/50 shadow-inner" : "hover:bg-slate-50/30"
            )}
          >
            {playingAyah === ayah.number && (
              <motion.div 
                layoutId="active-bg"
                className="absolute inset-0 bg-emerald-50/40 -z-10"
              />
            )}
            <div className="flex flex-col gap-8 lg:gap-12">
              {/* Arabic Text */}
              <div className="w-full text-right">
                <p className={cn(
                  "font-arabic text-3xl leading-[2.2] text-slate-900 transition-all selection:bg-emerald-100",
                  "lg:text-6xl lg:leading-[2.8]",
                  playingAyah === ayah.number && "text-emerald-900 scale-[1.01] lg:scale-[1.02] origin-right"
                )}>
                  {ayah.text}
                </p>
                <span className={cn(
                  "inline-flex items-center justify-center w-8 h-8 lg:w-12 lg:h-12 ml-4 lg:ml-6 rounded-lg lg:rounded-[1.25rem] border-2 text-[10px] lg:text-xs font-black font-sans align-middle transition-all",
                  playingAyah === ayah.number 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/20" 
                    : "border-emerald-100 text-emerald-700 bg-white"
                )}>
                  {ayah.numberInSurah}
                </span>
              </div>

              {/* Controls & Translation */}
              <div className="max-w-3xl space-y-6 lg:space-y-8">
                <div className="flex items-center gap-2 lg:gap-3">
                  <button 
                    onClick={() => toggleAudio(ayah.number, ayah.audio)}
                    className={cn(
                      "p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all shadow-md group/play",
                      playingAyah === ayah.number 
                        ? "bg-emerald-600 text-white" 
                        : "bg-white text-emerald-600 border border-emerald-50 hover:bg-emerald-600 hover:text-white"
                    )}
                  >
                    {playingAyah === ayah.number && !audioRef.current?.paused ? <Pause className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" /> : <Play className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" />}
                  </button>
                  <button 
                    onClick={() => toggleBookmark(ayah.number)}
                    className={cn(
                      "p-3 lg:p-4 border border-slate-50 rounded-xl lg:rounded-2xl transition-all shadow-sm",
                      bookmarks.includes(ayah.number) 
                        ? "bg-emerald-600 text-white border-emerald-600" 
                        : "bg-white text-slate-300 hover:text-emerald-600 hover:border-emerald-100"
                    )}
                  >
                    <Bookmark className="w-4 h-4 lg:w-5 lg:h-5" fill={bookmarks.includes(ayah.number) ? "currentColor" : "none"} />
                  </button>
                  <button className="p-3 lg:p-4 bg-white border border-slate-50 text-slate-300 rounded-xl lg:rounded-2xl hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">
                    <Share2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 lg:space-y-4">
                  <p className="text-emerald-600 italic text-[11px] lg:text-sm font-bold tracking-tight">
                    {ayah.transliteration}
                  </p>
                  <p className="text-slate-800 leading-[1.6] lg:leading-[1.8] text-base lg:text-xl font-bold font-serif selection:bg-emerald-50 transition-colors">
                    "{ayah.translation}"
                  </p>
                  <div className="flex items-center gap-3 pt-3 lg:pt-4 border-t border-slate-50 transition-colors">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <Volume2 size={10} />
                    </div>
                    <p className="text-[8px] lg:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                      {profile?.preferred_qari === 'ar.abdulsamad' ? 'AbdulBaset AbdulSamad' : 
                       profile?.preferred_qari === 'ar.abdurrahmaansudais' ? 'Abdur-Rahman as-Sudais' :
                       profile?.preferred_qari === 'ar.saoodshuraym' ? 'Saud Al-Shuraim' :
                       profile?.preferred_qari === 'ar.husary' ? 'Mahmoud Khalil Al-Husary' :
                       profile?.preferred_qari === 'ar.husarymujawwad' ? 'Mahmoud Khalil Al-Husary (Mujawwad)' :
                       'Mishary Rashid Alafasy'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Bottom Player */}
      {playingAyah && (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
    >
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-white/5 backdrop-blur-xl">
         <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 truncate">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-emerald-600/30">
                  {data.ayahs.find(a => a.number === playingAyah)?.numberInSurah}
               </div>
               <div className="truncate">
                  <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">{data.surah.englishName}</p>
                  <p className="text-xs font-medium opacity-60 truncate">{t('dash.ayat_title')} {data.ayahs.find(a => a.number === playingAyah)?.numberInSurah}</p>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setRepeatCount(prev => prev === 5 ? 1 : prev + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5"
              >
                <RotateCcw size={12} />
                {repeatCount}x
              </button>
              <div className="hidden md:flex items-center gap-2">
                <Volume2 size={14} className="text-slate-400" />
                <input 
                  type="range" min="0" max="1" step="0.1"
                  value={volume}
                  onChange={(e) => handleVolume(parseFloat(e.target.value))}
                  className="w-20 accent-emerald-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <button 
                onClick={() => toggleAudio(playingAyah!)}
                className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {!audioRef.current?.paused ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
            </div>
         </div>

         <div className="flex flex-col gap-1">
            <input 
              type="range" min="0" max={audioDuration || 100} step="0.1"
              value={audioProgress}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest">
               <span>{Math.floor(audioProgress / 60)}:{(audioProgress % 60).toFixed(0).padStart(2, '0')}</span>
               <span>{Math.floor(audioDuration / 60)}:{(audioDuration % 60).toFixed(0).padStart(2, '0')}</span>
            </div>
         </div>
      </div>
    </motion.div>
      )}
    </motion.div>
  );
}

import React from 'react';
import { BADGES, Badge } from '../data/badgeContent';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface BadgeGalleryProps {
  earnedBadgeIds: string[];
}

export function BadgeGallery({ earnedBadgeIds }: BadgeGalleryProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {BADGES.map((badge) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        const Icon = badge.icon;
        
        return (
          <motion.div
            key={badge.id}
            whileHover={isEarned ? { scale: 1.05, y: -5 } : {}}
            className={cn(
              "relative p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-3 overflow-hidden group",
              isEarned 
                ? "bg-white border-slate-100 shadow-xl shadow-slate-200/40" 
                : "bg-slate-50/50 border-slate-50 opacity-40 grayscale"
            )}
          >
            {/* Background pattern if earned */}
            {isEarned && (
              <div className={cn(
                "absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-10",
                `bg-${badge.color}-500 blur-xl group-hover:scale-150 transition-transform`
              )} />
            )}

            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
              isEarned 
                ? `bg-${badge.color}-50 text-${badge.color}-600 shadow-inner` 
                : "bg-slate-200 text-slate-400"
            )}>
              {isEarned ? <Icon size={28} /> : <Lock size={20} />}
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-tight text-slate-800">
                {language === 'ms' ? badge.title : badge.title_en}
              </h4>
              <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {badge.rarity}
              </p>
            </div>

            {/* Hover tooltip logic could go here */}
          </motion.div>
        );
      })}
    </div>
  );
}

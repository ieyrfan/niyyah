import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Clock, Users, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function BottomNav() {
  const { t } = useLanguage();
  const location = useLocation();

  const mainNav = [
    { icon: Home, labelKey: 'nav.home', path: '/' },
    { icon: BookOpen, labelKey: 'nav.learn', path: '/learn' },
    { icon: Clock, labelKey: 'nav.pray', path: '/pray' },
    { icon: Users, labelKey: 'nav.ummah', path: '/ummah' },
    { icon: Settings, labelKey: 'nav.more', path: '/more' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 lg:hidden px-4 py-2 flex items-center justify-around shadow-2xl">
      {mainNav.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all",
            isActive ? "text-emerald-600 scale-105" : "text-slate-400"
          )}
        >
          {({ isActive }) => (
            <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[10px] tracking-tight font-medium",
                isActive ? "font-bold" : ""
              )}>
                {t(item.labelKey)}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

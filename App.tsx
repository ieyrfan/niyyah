/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { QuranPage } from './pages/QuranPage';
import { SurahReader } from './pages/SurahReader';
import { DermaPage } from './pages/DermaPage';
import { SettingsPage } from './pages/SettingsPage';
import { DoaPage } from './pages/DoaPage';
import { KiblatPage } from './pages/KiblatPage';
import { TrackerPage } from './pages/TrackerPage';
import { KomunitiPage } from './pages/KomunitiPage';
import { JadualPage } from './pages/JadualPage';
import { IqraPage } from './pages/IqraPage';
import { SirahPage } from './pages/SirahPage';
import { RamadanPage } from './pages/RamadanPage';
import { ZikirPage } from './pages/ZikirPage';
import { AsmaulHusnaPage } from './pages/AsmaulHusnaPage';
import { ZakatPage } from './pages/ZakatPage';
import { MuqaddamPage } from './pages/MuqaddamPage';
import { HadisPage } from './pages/HadisPage';
import { NiatWudukPage } from './pages/NiatWudukPage';
import { KelasHome } from './pages/KelasHome';
import { KelasDashboard } from './pages/KelasDashboard';
import { KelasForm } from './pages/KelasForm';
import { KelasDetail } from './pages/KelasDetail';
import { MualafHub } from './pages/MualafHub';
import { MualafModule } from './pages/MualafModule';
import { AboutPage } from './pages/AboutPage';
import { CategoryLanding } from './pages/CategoryLanding';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import { ThemeProvider, useTheme } from './lib/ThemeContext';
import { Onboarding } from './components/Onboarding';
import { useState, useEffect } from 'react';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const { theme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!loading && user && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [loading, user, profile]);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        <BottomNav />
        <Routes>
          <Route path="/" element={null} />
          <Route path="*" element={<Header />} />
        </Routes>
        
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
        
        <main className="flex-1 lg:ml-[180px] p-2 md:p-3 lg:p-5 pt-11 lg:pt-13 transition-all duration-500 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/:category" element={<CategoryLanding />} />
                <Route path="/mualaf" element={<MualafHub />} />
                <Route path="/mualaf/:id" element={<MualafModule />} />
                <Route path="/quran" element={<QuranPage />} />
                <Route path="/quran/:number" element={<SurahReader />} />
                <Route path="/derma" element={<DermaPage />} />
                <Route path="/tetapan" element={<SettingsPage />} />
                <Route path="/doa" element={<DoaPage />} />
                <Route path="/kiblat" element={<KiblatPage />} />
                <Route path="/solat" element={<TrackerPage />} />
                <Route path="/komuniti" element={<KomunitiPage />} />
                <Route path="/jadual" element={<JadualPage />} />
                <Route path="/iqra" element={<IqraPage />} />
                <Route path="/sirah" element={<SirahPage />} />
                <Route path="/ramadan" element={<RamadanPage />} />
                <Route path="/zikir" element={<ZikirPage />} />
                <Route path="/asmaul-husna" element={<AsmaulHusnaPage />} />
                <Route path="/zakat" element={<ZakatPage />} />
                <Route path="/muqaddam" element={<MuqaddamPage />} />
                <Route path="/wuduk" element={<NiatWudukPage />} />
                <Route path="/hadis" element={<HadisPage />} />
                <Route path="/kelas" element={<KelasHome />} />
                <Route path="/kelas/dashboard" element={<KelasDashboard />} />
                <Route path="/kelas/baru" element={<KelasForm />} />
                <Route path="/kelas/edit/:id" element={<KelasForm />} />
                <Route path="/kelas/:id" element={<KelasDetail />} />
                <Route path="/about" element={<AboutPage />} />
                {/* Fallback */}
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center h-[80vh]">
                    <h2 className="text-2xl font-bold text-slate-800">Akan Datang</h2>
                    <p className="text-slate-500 mt-2">Fungsi ini sedang dibangunkan dalam fasa seterusnya.</p>
                  </div>
                } />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

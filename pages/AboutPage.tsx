import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Linkedin, Globe, Shield, 
  FileText, Info, Award, Heart, HeartHandshake,
  CheckCircle2, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export function AboutPage() {
  const { t } = useLanguage();

  const sections = [
    {
      id: 'developer',
      icon: User,
      title: 'About The Developer',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-600 shadow-inner">
               <User size={64} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-800 uppercase italic">Muhammad Irfan Rizal</h3>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">Cloud Computing Student • Malaysia</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            Hi, I’m Muhammad Irfan Rizal, a Cloud Computing student from Malaysia with a strong passion for technology, cloud computing, cybersecurity, and modern software development.
          </p>
          <p className="text-slate-600 leading-relaxed font-medium">
            I build digital solutions that focus on usability, accessibility, and real-world impact. My goal is not just to create applications, but to solve meaningful problems through technology.
          </p>
          
          <div className="pt-4 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Projects</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'NeuroNote', desc: 'Mental health & productivity system' },
                { name: 'SmartShef', desc: 'AWS Serverless recipe platform' },
                { name: 'Threat Nexus XDR', desc: 'Cloud cybersecurity monitoring' }
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Award size={18} className="text-emerald-500" />
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-slate-800">{p.name}</h5>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'niyyah',
      icon: Heart,
      title: 'Why I Created NIYYAH',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-medium">
            NIYYAH was created to make Islamic learning and daily worship easier, simpler, and more accessible for everyone — especially:
          </p>
          <ul className="space-y-3">
             {[
               'Elderly users who struggle with modern apps',
               'New Muslims (Muallaf) who need guidance and support',
               'Malaysian Muslims looking for an all-in-one Islamic platform'
             ].map((item, i) => (
               <li key={i} className="flex items-start gap-3">
                 <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
                 <span className="text-sm font-bold text-slate-700">{item}</span>
               </li>
             ))}
          </ul>
          <div className="mt-8 p-8 bg-emerald-950 text-white rounded-[2.5rem] relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Vision</p>
                <blockquote className="text-lg font-black italic tracking-tight leading-relaxed">
                  “To build a platform where technology serves faith and helps people connect closer to Islam in a simple and meaningful way.”
                </blockquote>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>
      )
    },
    {
      id: 'terms',
      icon: FileText,
      title: 'Terms & Conditions',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
          <p>By using NIYYAH, you agree to use the app responsibly and respect other users. NIYYAH reserves the right to suspend accounts that violate community rules.</p>
          <p>Prayer times, Qibla direction, and religious content are for general guidance and may contain minor inaccuracies. Users should verify with qualified authorities.</p>
        </div>
      )
    },
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacy Policy',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
          <p>NIYYAH collects limited information (Name, Email, Location) only to improve your experience. We do NOT sell your data to third parties.</p>
          <p>Data is stored securely using trusted platforms like Firebase. Users may request account deletion at any time.</p>
        </div>
      )
    },
    {
      id: 'disclaimer',
      icon: Info,
      title: 'Disclaimer',
      content: (
        <div className="space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
          <p>NIYYAH is for educational and worship assistance purposes only. It does NOT replace official religious rulings (fatwa) or professional medical advice.</p>
          <p>While every effort is made for accuracy, mistakes may occur. Please report any issues you find.</p>
        </div>
      )
    },
    {
      id: 'contact',
      icon: Mail,
      title: 'Contact & Links',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="mailto:irfanizzani46@gmail.com" className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all text-center group">
            <Mail className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Email</span>
          </a>
          <a href="https://www.linkedin.com/in/irfanrizal2004" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-center group">
            <Linkedin className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">LinkedIn</span>
          </a>
          <a href="https://irfanrizalv2.netlify.app" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-100 rounded-3xl hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all text-center group">
            <Globe className="text-slate-300 group-hover:text-purple-500 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Portfolio</span>
          </a>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-32 px-4"
    >
      <header className="text-center space-y-4">
         <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/20">
            <HeartHandshake size={40} />
         </div>
         <h2 className="text-4xl font-black text-emerald-950 uppercase italic tracking-tighter">About NIYYAH</h2>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ummah Enlightened • Developed with Passions</p>
      </header>

      <div className="grid gap-12">
        {sections.map((section) => (
          <div key={section.id} className="group">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all shadow-sm">
                   <section.icon size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{section.title}</h3>
             </div>
             <div className="pl-0 md:pl-16">
                {section.content}
             </div>
          </div>
        ))}
      </div>

      <footer className="pt-12 border-t border-slate-100 text-center">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 Muhammad Irfan Rizal — NIYYAH Ummah Enlightened</p>
      </footer>
    </motion.div>
  );
}

import { 
  Award, 
  Target, 
  BookOpen, 
  Users, 
  Zap, 
  Flame, 
  Stars,
  ShieldCheck
} from 'lucide-react';

export interface Badge {
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  icon: any;
  color: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: 'Tracker' | 'Quran' | 'Community' | 'System';
}

export const BADGES: Badge[] = [
  {
    id: 'first_prayer',
    title: 'Langkah Pertama',
    title_en: 'First Step',
    description: 'Tanda rekod solat buat pertama kali.',
    description_en: 'Mark your first prayer record.',
    icon: Zap,
    color: 'amber',
    rarity: 'Common',
    category: 'Tracker'
  },
  {
    id: 'full_day',
    title: 'Disiplin Tinggi',
    title_en: 'High Discipline',
    description: 'Lengkapkan 5 waktu solat dalam satu hari.',
    description_en: 'Complete all 5 prayers in a single day.',
    icon: Target,
    color: 'emerald',
    rarity: 'Common',
    category: 'Tracker'
  },
  {
    id: 'streak_3',
    title: 'Istiqamah Muda',
    title_en: 'Young Consistency',
    description: 'Lengkapkan 5 waktu solat selama 3 hari berturut-turut.',
    description_en: 'Complete all 5 prayers for 3 consecutive days.',
    icon: Flame,
    color: 'orange',
    rarity: 'Rare',
    category: 'Tracker'
  },
  {
    id: 'quran_beginner',
    title: 'Pencinta Al-Quran',
    title_en: 'Quran Lover',
    description: 'Mula membaca Al-Quran dalam aplikasi.',
    description_en: 'Start reading Al-Quran in the app.',
    icon: BookOpen,
    color: 'blue',
    rarity: 'Common',
    category: 'Quran'
  },
  {
    id: 'community_helper',
    title: 'Tangan Terbuka',
    title_en: 'Helping Hand',
    description: 'Hantar komen atau jawapan pertama di komunitas.',
    description_en: 'Post your first comment or answer in the community.',
    icon: Users,
    color: 'purple',
    rarity: 'Common',
    category: 'Community'
  },
  {
    id: 'mualaf_grad',
    title: 'Pelajar Cemerlang',
    title_en: 'Excellent Learner',
    description: 'Selesaikan modul pertama dalam Mualaf Hub.',
    description_en: 'Complete the first module in Mualaf Hub.',
    icon: Stars,
    color: 'indigo',
    rarity: 'Rare',
    category: 'System'
  },
  {
    id: 'profile_hero',
    title: 'Identiti Lengkap',
    title_en: 'Complete Identity',
    description: 'Lengkapkan maklumat profil anda.',
    description_en: 'Complete your profile information.',
    icon: ShieldCheck,
    color: 'slate',
    rarity: 'Common',
    category: 'System'
  }
];

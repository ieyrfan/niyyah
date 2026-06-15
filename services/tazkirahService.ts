import { notificationService } from './notificationService';

export interface Tazkirah {
  title: string;
  body: string;
}

const TAZKIRAHS: Tazkirah[] = [
  { 
    title: 'Niat Yang Ikhlas', 
    body: 'Setiap amalan bermula dengan niat. Pastikan niat kita sentiasa kerana Allah SWT.' 
  },
  { 
    title: 'Kelebihan Sedekah', 
    body: 'Sedekah tidak mengurangkan harta, malah menambah keberkatan dalam rezeki.' 
  },
  { 
    title: 'Adab Berdoa', 
    body: 'Mulakan doa dengan pujian kepada Allah dan selawat ke atas Nabi SAW.' 
  },
  { 
    title: 'Solat di Awal Waktu', 
    body: 'Solat di awal waktu adalah antara amalan yang paling dicintai Allah.' 
  },
  { 
    title: 'Menjaga Lisan', 
    body: 'Berkata baik atau diam. Lisan yang terjaga mencerminkan iman yang sempurna.' 
  }
];

export function getDailyTazkirah() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return TAZKIRAHS[dayOfYear % TAZKIRAHS.length];
}

export function notifyDailyTazkirah() {
  const tazkirah = getDailyTazkirah();
  notificationService.sendLocalNotification(
    `Tazkirah Harian: ${tazkirah.title}`,
    tazkirah.body
  );
}

export interface MualafStep {
  step: number;
  name: string;
  action: string;
  arabic?: string;
  rumi?: string;
  translation: string;
  image?: string;
}

export interface MualafModuleContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  videoUrl?: string; // Add video URL
  content?: string;
  steps?: MualafStep[];
  subModules?: {
    id: string;
    title: string;
    steps: MualafStep[];
  }[];
}

export const MUALAF_MODULES: MualafModuleContent[] = [
  {
    id: 'syahadah',
    title: 'Modul 01: Syahadah',
    description: 'Panduan melafazkan dua kalimah syahadah dengan betul dan maknanya.',
    icon: 'Fingerprint',
    videoUrl: 'https://www.youtube.com/embed/SsXHcObCLJw',
    steps: [
      {
        step: 1,
        name: 'Lafaz Syahadah (Bahagian 1)',
        action: 'Melafazkan pengakuan ketuhanan Allah.',
        arabic: 'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ',
        rumi: 'Asyhadu alla ilaha illallah',
        translation: 'Aku naik saksi bahawa tiada Tuhan melainkan Allah'
      },
      {
        step: 2,
        name: 'Lafaz Syahadah (Bahagian 2)',
        action: 'Melafazkan pengakuan kerasulan Nabi Muhammad.',
        arabic: 'وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ',
        rumi: 'Wa asyhadu anna Muhammadan Rasulullah',
        translation: 'Dan aku naik saksi bahawa Nabi Muhammad itu pesuruh Allah'
      }
    ]
  },
  {
    id: 'rukun',
    title: 'Rukun Islam & Rukun Iman',
    description: 'Asas-asas kepercayaan dan amalan dalam Islam.',
    icon: 'ShieldCheck',
    steps: [
      {
        step: 1,
        name: 'Pengenalan',
        action: 'Rukun Islam dan Rukun Iman adalah asas penting bagi setiap Muslim.',
        translation: 'Rukun Islam adalah amalan zahir, manakala Rukun Iman adalah kepercayaan batin.'
      },
      {
        step: 2,
        name: 'Rukun Islam (1-3)',
        action: '1. Syahadah, 2. Solat 5 Waktu, 3. Berpuasa Ramadan.',
        translation: 'Syahadah adalah kunci masuk Islam. Solat adalah tiang agama. Puasa melatih kesabaran.'
      },
      {
        step: 3,
        name: 'Rukun Islam (4-5)',
        action: '4. Menunaikan Zakat, 5. Menunaikan Haji.',
        translation: 'Zakat menyucikan harta. Haji adalah kemuncak ibadah bagi yang mampu.'
      },
      {
        step: 4,
        name: 'Rukun Iman (1-3)',
        action: '1. Beriman kepada Allah, 2. Malaikat, 3. Kitab.',
        translation: 'Percaya Allah itu Esa, adanya Malaikat sebagai pesuruh Allah, dan Kitab sebagai panduan.'
      },
      {
        step: 5,
        name: 'Rukun Iman (4-6)',
        action: '4. Beriman kepada Rasul, 5. Hari Akhirat, 6. Qada\' & Qadar.',
        translation: 'Percaya para Rasul pembawa wahyu, adanya hari pembalasan, dan setiap perkara adalah ketentuan Allah.'
      }
    ]
  },
  {
    id: 'mandi-wajib',
    title: 'Modul 02: Mandi Wajib',
    description: 'Panduan menyucikan diri daripada hadas besar (Standard JAKIM).',
    icon: 'Droplets',
    videoUrl: 'https://www.youtube.com/embed/iWFMlUyB73A',
    steps: [
      {
        step: 1,
        name: 'Niat Mandi Wajib',
        action: 'Membaca niat di dalam hati semasa air mula menyentuh mana-mana bahagian anggota badan.',
        arabic: 'نَوَيْتُ رَفْعَ الْحَدَثِ الْأَكْبَرِ لِلّٰهِ تَعَالَى',
        rumi: 'Nawaitu raf\'al hadathil akbari lillahi ta\'ala',
        translation: 'Sahaja aku mengangkat hadas besar kerana Allah Ta\'ala'
      },
      {
        step: 2,
        name: 'Membasuh Tangan & Kemaluan',
        action: 'Membasuh kedua tangan sebanyak tiga kali dan membersihkan kemaluan serta kawasan sekitarnya daripada kotoran atau najis.',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        rumi: 'Bismillahir rahmanir rahim',
        translation: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang.'
      },
      {
        step: 3,
        name: 'Berwuduk',
        action: 'Mengambil wuduk sepertimana wuduk untuk solat. Ini adalah sunnah yang digalakkan sebelum meratakan air ke seluruh badan.',
        arabic: 'نَوَيْتُ الْوُضُوْءَ لِلّٰهِ تَعَالَى',
        rumi: 'Nawaitul wudhua lillahi ta\'ala',
        translation: 'Sahaja aku berwuduk kerana Allah Ta\'ala.'
      },
      {
        step: 4,
        name: 'Menyiram Kepala',
        action: 'Menyiram air ke kepala sebanyak tiga kali dan mengusap rambut sehingga air sampai ke kulit kepala.',
        arabic: '',
        rumi: '',
        translation: 'Pastikan air meresap ke liang-liang rambut.'
      },
      {
        step: 5,
        name: 'Meratakan Air ke Seluruh Badan',
        action: 'Meratakan air ke seluruh anggota badan bermula dari sebelah kanan, kemudian kiri. Pastikan kawasan seperti pusat, ketiak, dan celah jari terkena air.',
        arabic: '',
        rumi: '',
        translation: 'Air mestilah merata tanpa meninggalkan sedikit pun kawasan kering.'
      }
    ]
  },
  {
    id: 'wuduk',
    title: 'Modul 03: Wuduk Lengkap',
    description: 'Cara mengambil wuduk mengikut tertib dan sunnah.',
    icon: 'Waves',
    videoUrl: 'https://www.youtube.com/embed/hj9bNliOmsM',
    steps: [
      {
        step: 1,
        name: 'Niat Wuduk',
        action: 'Membaca niat di dalam hati semasa air mula menyentuh sebahagian muka.',
        arabic: 'نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى',
        rumi: 'Nawaitul wudhuu-a lirof’il hadatsil ashgori fardhon lillaahi ta’aala',
        translation: 'Sahaja aku berniat wuduk untuk menghilangkan hadas kecil, fardu kerana Allah Taala.'
      },
      {
        step: 2,
        name: 'Membasuh Muka',
        action: 'Ratakan air ke seluruh muka dari tempat tumbuh rambut hingga ke bawah dagu dan dari anak telinga kanan ke kiri.',
        arabic: 'نَوَيْتُ الْوُضُوْءَ لِلّٰهِ تَعَالَى',
        rumi: 'Nawaitul wudhua lillahi ta\'ala',
        translation: 'Lafaz niat dilakukan serentak ketika air mula membasuh sebahagian muka.'
      },
      {
        step: 3,
        name: 'Membasuh Tangan Hingga Siku',
        action: 'Ratakan air dari hujung jari hingga ke atas siku, mulakan dengan tangan kanan kemudian kiri.',
        arabic: '',
        rumi: '',
        translation: 'Pastikan air sampai ke siku dan celah-celah jari.'
      },
      {
        step: 4,
        name: 'Menyapu Kepala',
        action: 'Menyapu sebahagian kepala (sekurang-kurangnya 3 helai rambut) with air.',
        arabic: '',
        rumi: '',
        translation: 'Menyapu air ke sebahagian kepala dengan tangan yang basah.'
      },
      {
        step: 5,
        name: 'Membasuh Kaki Hingga Buku Lali',
        action: 'Ratakan air hingga ke buku lali dan celah-celah jari, mulakan dengan kaki kanan.',
        arabic: '',
        rumi: '',
        translation: 'Sela jari-jari kaki dengan jari tangan untuk memastikan air sampai.'
      },
      {
        step: 6,
        name: 'Tertib',
        action: 'Melakukan langkah-langkah fardu wuduk di atas mengikut urutan yang betul.',
        arabic: '',
        rumi: '',
        translation: 'Mengikut susunan satu persatu dari niat hingga membasuh kaki.'
      }
    ]
  },
  {
    id: 'tayamum',
    title: 'Modul 04: Cara Bertayamum',
    description: 'Panduan menyucikan diri menggunakan debu tanah yang suci apabila tiada air.',
    icon: 'Eraser',
    videoUrl: 'https://www.youtube.com/embed/8frJLplYkc4',
    steps: [
      {
        step: 1,
        name: 'Niat Tayamum',
        action: 'Niat secara dalam hati untuk mengharuskan solat.',
        arabic: 'نَوَيْتُ التَّيَمُّمَ لِاسْتِبَاحَةِ الصَّلَاةِ لِلَّهِ تَعَالَى',
        rumi: 'Nawaitu tayamumma listibahatis salati lillahi ta\'ala',
        translation: 'Sahaja aku bertayamum untuk mengharuskan solat kerana Allah Ta\'ala'
      },
      {
        step: 2,
        name: 'Menepuk Debu',
        action: 'Menepuk kedua-dua tapak tangan ke debu tanah yang suci kemudian menipiskan debu dengan meniup atau menepuk tangan.',
        arabic: '',
        rumi: '',
        translation: 'Gunakan debu yang suci dan tidak musta\'mal.'
      },
      {
        step: 3,
        name: 'Menyapu Muka',
        action: 'Menyapu debu ke seluruh muka dengan sekali sapuan dari atas ke bawah.',
        arabic: '',
        rumi: '',
        translation: 'Pastikan debu sampai ke seluruh kawasan muka.'
      },
      {
        step: 4,
        name: 'Menyapu Tangan',
        action: 'Menyapu debu ke kedua-dua tangan hingga ke siku bermula dari tangan kanan.',
        arabic: '',
        rumi: '',
        translation: 'Gunakan debu yang berbeza (tepukan kedua) untuk menyapu tangan.'
      }
    ]
  },
  {
    id: 'solat',
    title: 'Modul 05: Panduan Solat Lengkap',
    description: 'Langkah demi langkah solat 5 waktu yang lengkap.',
    icon: 'Moon',
    subModules: [
      {
        id: 'subuh',
        title: 'Solat Subuh (2 Rakaat)',
        steps: [
          {
            step: 1,
            name: 'Niat Solat Subuh',
            action: 'Melafazkan niat solat subuh di dalam hati.',
            arabic: 'أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ أَدَاءً لِلَّهِ تَعَالَى',
            rumi: 'Ushalli fardhas sub-hi rak\'ataini ada\'an lillahi ta\'ala',
            translation: 'Sahaja aku solat fardu Subuh dua rakaat tunai kerana Allah Ta\'ala'
          },
          {
            step: 2,
            name: 'Takbiratul Ihram',
            action: 'Mengangkat kedua-dua tangan selari dengan telinga dan membaca Takbir.',
            arabic: 'اللهُ أَكْبَرُ',
            rumi: 'Allahu Akbar',
            translation: 'Allah Maha Besar'
          },
          {
            step: 3,
            name: 'Membaca Doa Iftitah',
            action: 'Membaca doa pembukaan solat (Sunat).',
            arabic: 'اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا...',
            rumi: 'Allahu akbaru kabira, walhamdu lillahi kashira...',
            translation: 'Allah Maha Besar sebesar-besarnya. Segala puji bagi Allah sebanyak-banyaknya...'
          },
          {
            step: 4,
            name: 'Membaca Surah Al-Fatihah',
            action: 'Membaca surah wajib dalam setiap rakaat.',
            arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...',
            rumi: 'Bismillahir rahmanir rahim. Alhamdulillahi rabbil alamin...',
            translation: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. Segala puji bagi Allah, Tuhan sekalian alam...'
          },
          {
            step: 5,
            name: 'Rukuk',
            action: 'Membongkokkan badan dengan meletakkan tangan di lutut.',
            arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
            rumi: 'Subhana rabbiyal azimi wabihamdih',
            translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan segala puji-pujian-Nya (3 kali)'
          },
          {
            step: 6,
            name: 'Iktidal',
            action: 'Bangun semula tegak selepas rukuk.',
            arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا وَلَكَ الْحَمْدُ',
            rumi: 'Sami\'allahu liman hamidah. Rabbana walakal hamd',
            translation: 'Allah mendengar pujian orang yang memujinya. Wahai Tuhan kami, bagi-Mu segala pujian'
          },
          {
            step: 7,
            name: 'Sujud',
            action: 'Meletakkan dahi, kedua tapak tangan, lutut dan jari kaki ke lantai.',
            arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
            rumi: 'Subhana rabbiyal a\'la wabihamdih',
            translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan segala puji-pujian-Nya (3 kali)'
          },
          {
            step: 8,
            name: 'Duduk Antara Dua Sujud',
            action: 'Duduk sebentar selepas sujud pertama.',
            arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
            rumi: 'Rabbighfirli warhamni wajburni warfa\'ni warzuqni wahdini wa\'afini wa\'fu \'anni',
            translation: 'Wahai Tuhanku, ampunilah dosaku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah darjatku, berilah rezeki kepadaku, berilah hidayah kepadaku, afiatkanlah aku dan ampunilah aku'
          },
          {
            step: 9,
            name: 'Tahiyat Akhir',
            action: 'Duduk untuk membaca tahiyat sebelum salam.',
            arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ...',
            rumi: 'At-tahiyyatul mubarakatus salawatut tayyibatu lillah...',
            translation: 'Segala penghormatan yang berkat, solat yang baik adalah untuk Allah...'
          },
          {
            step: 10,
            name: 'Memberi Salam',
            action: 'Memalingkan muka ke kanan dan ke kiri.',
            arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
            rumi: 'Assalamu alaikum wa rahmatullah',
            translation: 'Sejahtera ke atas kamu dan rahmat Allah'
          }
        ]
      },
      {
        id: 'zohor',
        title: 'Solat Zohor (4 Rakaat)',
        steps: [
           {
            step: 1,
            name: 'Niat Solat Zohor',
            action: 'Melafazkan niat solat zohor di dalam hati.',
            arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى',
            rumi: 'Ushalli fardhaz zuhri arba\'a rak\'atin ada\'an lillahi ta\'ala',
            translation: 'Sahaja aku solat fardu Zohor empat rakaat tunai kerana Allah Ta\'ala'
          }
        ]
      },
      {
        id: 'asar',
        title: 'Solat Asar (4 Rakaat)',
        steps: [
           {
            step: 1,
            name: 'Niat Solat Asar',
            action: 'Melafazkan niat solat asar di dalam hati.',
            arabic: 'أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى',
            rumi: 'Ushalli fardhal \'asri arba\'a rak\'atin ada\'an lillahi ta\'ala',
            translation: 'Sahaja aku solat fardu Asar empat rakaat tunai kerana Allah Ta\'ala'
          }
        ]
      },
      {
        id: 'maghrib',
        title: 'Solat Maghrib (3 Rakaat)',
        steps: [
           {
            step: 1,
            name: 'Niat Solat Maghrib',
            action: 'Melafazkan niat solat maghrib di dalam hati.',
            arabic: 'أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى',
            rumi: 'Ushalli fardhal maghribi thalatha rak\'atin ada\'an lillahi ta\'ala',
            translation: 'Sahaja aku solat fardu Maghrib tiga rakaat tunai kerana Allah Ta\'ala'
          }
        ]
      },
      {
        id: 'isyak',
        title: 'Solat Isyak (4 Rakaat)',
        steps: [
           {
            step: 1,
            name: 'Niat Solat Isyak',
            action: 'Melafazkan niat solat isyak di dalam hati.',
            arabic: 'أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ أَدَاءً لِلَّهِ تَعَالَى',
            rumi: 'Ushalli fardhal \'isha-i arba\'a rak\'atin ada\'an lillahi ta\'ala',
            translation: 'Sahaja aku solat fardu Isyak empat rakaat tunai kerana Allah Ta\'ala'
          }
        ]
      }
    ]
  },
  {
    id: 'puasa',
    title: 'Modul 06: Berpuasa Ramadan',
    description: 'Panduan menahan diri daripada lapar, dahaga dan perkara yang membatalkan puasa.',
    icon: 'CloudMoon',
    videoUrl: 'https://www.youtube.com/watch?v=tFOP8v5noAs',
    content: 'Puasa adalah salah satu daripada Rukun Islam yang wajib dilaksanakan pada bulan Ramadan. Ia bermula dari terbit fajar sehingga terbenam matahari.'
  },
  {
    id: 'zakat-fitrah',
    title: 'Modul 07: Zakat Fitrah',
    description: 'Panduan membayar zakat fitrah untuk menyucikan diri dan membantu fakir miskin.',
    icon: 'Coins',
    videoUrl: 'http://www.youtube.com/watch?v=f7vsCThn9ME',
    content: 'Zakat fitrah wajib dibayar oleh setiap individu Muslim pada bulan Ramadan sehingga sebelum solat sunat Hari Raya Aidilfitri.'
  },
  {
    id: 'korban',
    title: 'Modul 08: Korban & Aqiqah',
    description: 'Panduan ibadah korban pada Hari Raya Aidiladha dan aqiqah untuk kelahiran anak.',
    icon: 'Beef',
    videoUrl: 'http://www.youtube.com/watch?v=dZH5NAK_kiM',
    content: 'Ibadah korban dilakukan pada 10, 11, 12, dan 13 Zulhijjah sebagai tanda syukur kepada Allah SWT.'
  },
  {
    id: 'doa',
    title: 'Koleksi Doa-doa Harian',
    description: 'Doa-doa penting untuk diamalkan setiap hari.',
    icon: 'Heart',
    steps: [
      {
        step: 1,
        name: 'Doa Sebelum Makan',
        action: 'Dibaca sebelum memulakan jamuan.',
        arabic: 'اللّٰهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
        rumi: 'Allahumma barik lana fima razaqtana waqina \'adhaban-nar',
        translation: 'Ya Allah berkatilah rezeki yang Engkau berikan kepada kami dan peliharalah kami dari azab neraka'
      }
    ]
  },
  {
    id: 'faq',
    title: 'Soalan Lazim (FAQ) Mualaf',
    description: 'Jawapan kepada kemusykilan biasa saudara baru.',
    icon: 'MessageSquare',
    content: '1. Adakah saya perlu tukar nama? Tidak wajib sekiranya nama asal tidak mempunyai maksud buruk.\n2. Bagaimana dengan keluarga bukan Islam? Kekalkan hubungan baik dan berbakti kepada mereka.\n3. Cara beritahu majikan? Berbincang dengan baik tentang keperluan solat 5 waktu.'
  },
  {
    id: 'adab',
    title: 'Adab Sebagai Seorang Muslim',
    description: 'Etika dan tingkah laku yang baik mengikut sunnah.',
    icon: 'Star',
    content: 'Adab kepada ibu bapa, jiran, dan masyarakat...'
  },
  {
    id: 'support',
    title: 'Hubungi Ustaz / Support Group',
    description: 'Khidmat bantuan dan sokongan untuk saudara baru.',
    icon: 'Users',
    content: 'Anda boleh menghubungi kami di talian bantuan 1-800-NIYYAH atau sertai group WhatsApp kami.'
  }
];

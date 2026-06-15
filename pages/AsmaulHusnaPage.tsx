import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, Search, Star, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function AsmaulHusnaPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState<any | null>(null);

  // High-detail authentic data
  const ASMAUL_HUSNA = [
    { 
      number: 1, 
      name: 'الرَّحْمَنُ', 
      transliteration: 'Ar-Rahman', 
      meaning: language === 'ms' ? 'Yang Maha Pemurah' : 'The Most Merciful', 
      detail: language === 'ms' ? 'Pemberi rahmat yang luas kepada seluruh makhluk-Nya di dunia tanpa mengira iman atau tidak. Sifat Rahman Allah meliputi segala-galanya; dari udara yang kita hirup hingga makanan yang kita makan. Ia menunjukkan betapa Pemurahnya Allah kepada setiap hamba-Nya di dunia ini.' : 'The One who wills mercy and good for all His creatures in this world.',
      quran: 'Surah Al-Fatihah: 3',
      benefit: language === 'ms' ? 'Membaca Ar-Rahman selepas solat fardhu dapat melembutkan hati yang keras dan menarik kasih sayang Allah SWT.' : 'Softens a hard heart and attracts Allah\'s love.'
    },
    { 
      number: 2, 
      name: 'الرَّحِيمُ', 
      transliteration: 'Ar-Rahim', 
      meaning: language === 'ms' ? 'Yang Maha Penyayang' : 'The Most Compassionate', 
      detail: language === 'ms' ? 'Pemberi rahmat yang khusus kepada hamba-hamba-Nya yang beriman di akhirat nanti. Sifat Rahim ini adalah rahmat yang bersifat kekal dan mendalam bagi mereka yang taat kepada-Nya. Ia memberi harapan bagi setiap Muslim untuk sentiasa mengharapkan syurga-Nya.' : 'The One who acts with extreme kindness and mercy specifically to believers.',
      quran: 'Surah Al-Baqarah: 163',
      benefit: language === 'ms' ? 'Mendapat perlindungan khusus dari Allah, ketenangan jiwa, dan dipermudahkan urusan di akhirat.' : 'Receiving special protection from Allah and peace of soul.'
    },
    { 
      number: 3, 
      name: 'الْمَلِكُ', 
      transliteration: 'Al-Malik', 
      meaning: language === 'ms' ? 'Yang Maha Berkuasa' : 'The Sovereign', 
      detail: language === 'ms' ? 'Pemilik mutlak seluruh alam semesta. Dia tidak memerlukan bantuan sesiapa pun dalam mentadbir kerajaan-Nya. Segala kekuasaan di dunia adalah pinjaman, manakala kekuasaan Allah adalah hakiki dan abadi.' : 'The One with the complete Dominion, the One Whose Dominion is clear and absolute.',
      quran: 'Surah Al-Hasyr: 23',
      benefit: language === 'ms' ? 'Diberikan kewibawaan, kehormatan, dan kecukupan dalam kehidupan seharian jika diamalkan dengan ikhlas.' : 'Granted authority and sufficiency in life.'
    },
    { 
      number: 4, 
      name: 'الْقُدُّوسُ', 
      transliteration: 'Al-Quddus', 
      meaning: language === 'ms' ? 'Yang Maha Suci' : 'The Pure', 
      detail: language === 'ms' ? 'Suci dari segala kekurangan, aib, dan sifat makhluk. Dia jauh lebih suci daripada apa yang dibayangkan akal manusia. Sifat ini mengajar kita untuk sentiasa menyucikan niat dan hati hanya untuk-Nya.' : 'The One who is pure from any imperfection and free from any error.',
      quran: 'Surah Al-Jumu\'ah: 1',
      benefit: language === 'ms' ? 'Membantu membersihkan hati daripada penyakit hati seperti riyak, sombong, dan was-was.' : 'Cleanses the heart from blameworthy traits and whispers.'
    },
    { 
      number: 5, 
      name: 'السَّلَامُ', 
      transliteration: 'As-Salam', 
      meaning: language === 'ms' ? 'Yang Maha Sejahtera' : 'The Source of Peace', 
      detail: language === 'ms' ? 'Pemberi keselamatan dan kedamaian. Kesejahteraan mutlak hanya datang daripada-Nya. Allah menyelamatkan hamba-Nya daripada kesusahan di dunia dan azab di akhirat.' : 'The One who is free from every imperfection and provide peace.',
      quran: 'Surah Al-Hasyr: 23',
      benefit: language === 'ms' ? 'Membawa kedamaian dalam keluarga, perlindungan daripada bahaya, dan ketenangan dalam menghadapi musibah.' : 'Brings peace to the family and protection from danger.'
    },
    { 
      number: 6, 
      name: 'الْمُؤْمِنُ', 
      transliteration: 'Al-Mu\'min', 
      meaning: language === 'ms' ? 'Yang Maha Pemberi Keamanan' : 'The Giver of Faith', 
      detail: language === 'ms' ? 'Pemberi keamanan dan ketenangan jiwa. Dia membenarkan iman dalam hati hamba-Nya.' : 'The One who witnessed for Himself that no one is God but Him.',
      quran: 'Surah Al-Hasyr: 23',
      benefit: language === 'ms' ? 'Menghilangkan ketakutan dan kebimbangan masa hadapan.' : 'Eliminates fear and anxiety about the future.'
    },
    { 
      number: 7, 
      name: 'الْمُهَيْمِنُ', 
      transliteration: 'Al-Muhaymin', 
      meaning: language === 'ms' ? 'Yang Maha Memelihara' : 'The Guardian', 
      detail: language === 'ms' ? 'Pengawas yang amat teliti. Dia menjaga setiap titisan hujan dan degupan jantung.' : 'The One who witnesses the saying and deeds of His creatures.',
      quran: 'Surah Al-Hasyr: 23',
      benefit: language === 'ms' ? 'Diberikan perlindungan zahir dan batin dalam kehidupan.' : 'Granted outward and inward protection in life.'
    },
    { 
      number: 8, 
      name: 'الْعَزِيزُ', 
      transliteration: 'Al-Aziz', 
      meaning: language === 'ms' ? 'Yang Maha Perkasa' : 'The Almighty', 
      detail: language === 'ms' ? 'Pemilik kemuliaan yang tidak terjangkau. Kekuatan-Nya tidak dapat ditandingi.' : 'The Defeater who is not defeated and the All-Powerful.',
      quran: 'Surah Ibrahim: 4',
      benefit: language === 'ms' ? 'Allah akan menolong daripada dizalimi dan dihina.' : 'Allah will help from being oppressed or humiliated.'
    },
    { 
      number: 9, 
      name: 'الْجَبَّارُ', 
      transliteration: 'Al-Jabbar', 
      meaning: language === 'ms' ? 'Yang Maha Gagah' : 'The Compeller', 
      detail: language === 'ms' ? 'Yang kehendak-Nya tidak dapat dihalang. Dia juga yang merawat hati yang hancur.' : 'The One whose will is always carried out and who mends the broken.',
      quran: 'Surah Al-Hasyr: 23',
      benefit: language === 'ms' ? 'Perlindungan daripada pemerintah zalim dan merawat duka.' : 'Protection from oppressive rulers and healing grief.'
    },
    { 
      number: 10, 
      name: 'الْمُتَكَبِّرُ', 
      transliteration: 'Al-Mutakabbir', 
      meaning: language === 'ms' ? 'Yang Maha Megah' : 'The Supreme', 
      detail: language === 'ms' ? 'Hanya Allah yang layak memiliki sifat sombong kerana segala keagungan milik-Nya.' : 'The One who is clear from the attributes of the creatures.',
      quran: 'Surah Al-Hasyr: 23',
      benefit: language === 'ms' ? 'Melahirkan sifat tawaduk dan rendah diri yang sebenar.' : 'Instills true humility and lowliness.'
    },
    { 
      number: 11, 
      name: 'الْخَالِقُ', 
      transliteration: 'Al-Khaliq', 
      meaning: language === 'ms' ? 'Yang Maha Pencipta' : 'The Creator', 
      detail: language === 'ms' ? 'Pencipta segala sesuatu daripada tiada kepada ada dengan perancangan yang sempurna.' : 'The One who brings everything from non-existence to existence.',
      quran: 'Surah Al-An\'am: 102',
      benefit: language === 'ms' ? 'Diberikan ilham dan kreativiti dalam menyelesaikan masalah.' : 'Granted inspiration and creativity in problem-solving.'
    },
    { 
      number: 12, 
      name: 'الْبَارِئُ', 
      transliteration: 'Al-Bari\'', 
      meaning: language === 'ms' ? 'Yang Maha Merancang' : 'The Maker of Order', 
      detail: language === 'ms' ? 'Menjadikan ciptaan-Nya teratur dan seimbang tanpa cacat cela.' : 'The One who creates without a model or previous matter.',
      quran: 'Surah Al-Hasyr: 24',
      benefit: language === 'ms' ? 'Urusan kehidupan menjadi lebih teratur dan lancar.' : 'Life affairs become more organized and smooth.'
    },
    { 
      number: 13, 
      name: 'الْمُصَوِّرُ', 
      transliteration: 'Al-Mushawwir', 
      meaning: language === 'ms' ? 'Yang Maha Membentuk' : 'The Fashioner', 
      detail: language === 'ms' ? 'Memberi rupa paras dan bentuk yang berbeza-beza kepada setiap makhluk-Nya.' : 'The One who gives each creation its unique form and shape.',
      quran: 'Surah Al-Hasyr: 24',
      benefit: language === 'ms' ? 'Mendapat zuriat yang baik dan rupa yang menyenangkan.' : 'Granted good offspring and a pleasant appearance.'
    },
    { 
      number: 14, 
      name: 'الْغَفَّارُ', 
      transliteration: 'Al-Ghaffar', 
      meaning: language === 'ms' ? 'Yang Maha Pengampun' : 'The All-Forgiving', 
      detail: language === 'ms' ? 'Sentiasa mengampuni dosa hamba-Nya walaupun dosa itu setinggi langit.' : 'The One who forgives sins repeatedly and covers them.',
      quran: 'Surah Nuh: 10',
      benefit: language === 'ms' ? 'Mendapat keampunan Allah dan dipermudahkan rezeki.' : 'Receiving Allah\'s forgiveness and eased sustenance.'
    },
    { 
      number: 15, 
      name: 'الْقَهَّارُ', 
      transliteration: 'Al-Qahhar', 
      meaning: language === 'ms' ? 'Yang Maha Menundukkan' : 'The Subduer', 
      detail: language === 'ms' ? 'Segala sesuatu tunduk di bawah kekuasaan-Nya. Tiada siapa boleh melawan kehendak-Nya.' : 'The One who has power over everything and subdues all.',
      quran: 'Surah Az-Zumar: 4',
      benefit: language === 'ms' ? 'Menundukkan hawa nafsu dan musuh-musuh kebenaran.' : 'Subdues whims and enemies of truth.'
    },
    { 
      number: 16, 
      name: 'الْوَهَّابُ', 
      transliteration: 'Al-Wahhab', 
      meaning: language === 'ms' ? 'Yang Maha Pemberi' : 'The Bestower', 
      detail: language === 'ms' ? 'Memberi nikmat tanpa mengharapkan balasan dan memberi kepada sesiapa yang dikehendaki-Nya.' : 'The One who gives generously without seeking anything in return.',
      quran: 'Surah Ali Imran: 8',
      benefit: language === 'ms' ? 'Tercapai hajat yang besar dan kecukupan dalam hidup.' : 'Great needs are met and sufficiency in life.'
    },
    { 
      number: 17, 
      name: 'الرَّزَّاقُ', 
      transliteration: 'Ar-Razzaq', 
      meaning: language === 'ms' ? 'Yang Maha Pemberi Rezeki' : 'The Provider', 
      detail: language === 'ms' ? 'Menjamin rezeki setiap makhluk, baik yang beriman mahupun yang ingkar.' : 'The One who provides all sustenance for His creation.',
      quran: 'Surah Adz-Dzariyat: 58',
      benefit: language === 'ms' ? 'Rezeki melimpah ruah dan datang dari sumber tidak disangka.' : 'Sustenance overflows and comes from unexpected sources.'
    },
    { 
      number: 18, 
      name: 'الْفَتَّاحُ', 
      transliteration: 'Al-Fattah', 
      meaning: language === 'ms' ? 'Yang Maha Pembuka' : 'The Opener', 
      detail: language === 'ms' ? 'Membuka pintu rahmat, pintu hidayah, dan segala jalan penyelesaian masalah.' : 'The One who opens the doors of mercy and success.',
      quran: 'Surah Saba\': 26',
      benefit: language === 'ms' ? 'Mendapat jalan keluar daripada kesulitan yang buntu.' : 'Finding a way out of dead-end difficulties.'
    },
    { 
      number: 19, 
      name: 'الْعَلِيمُ', 
      transliteration: 'Al-Alim', 
      meaning: language === 'ms' ? 'Yang Maha Mengetahui' : 'The All-Knowing', 
      detail: language === 'ms' ? 'Pengetahuan-Nya meliputi segala yang nyata dan yang tersembunyi sedalam-dalamnya.' : 'The One whose knowledge encompasses everything, seen and unseen.',
      quran: 'Surah Al-Baqarah: 158',
      benefit: language === 'ms' ? 'Dibukakan pintu ilmu dan kecerdasan berfikir.' : 'Opening doors of knowledge and intelligent thinking.'
    },
    { 
      number: 20, 
      name: 'الْقَابِضُ', 
      transliteration: 'Al-Qabidh', 
      meaning: language === 'ms' ? 'Yang Maha Menyempitkan' : 'The Withholder', 
      detail: language === 'ms' ? 'Dia yang berkuasa menyempitkan rezeki atau perasaan sebagai ujian bagi hamba-Nya.' : 'The One who constricts sustenance or the souls as a trial.',
      quran: 'Surah Al-Baqarah: 245',
      benefit: language === 'ms' ? 'Melindungi daripada sifat boros dan tamak.' : 'Protecting from extravagance and greed.'
    },
    { 
      number: 21, 
      name: 'الْبَاسِطُ', 
      transliteration: 'Al-Basit', 
      meaning: language === 'ms' ? 'Yang Maha Melapangkan' : 'The Enlarger', 
      detail: language === 'ms' ? 'Allah yang melapangkan rezeki dan hati. Tiada siapa yang boleh menyempitkan apa yang telah Allah lapangkan. Ia adalah ubat bagi mereka yang merasa sempit dalam kehidupan.' : 'The One who expands and widens.',
      quran: 'Surah Al-Baqarah: 245',
      benefit: language === 'ms' ? 'Melapangkan rezeki dan memberikan kegembiraan dalam hati.' : 'Expands sustenance and gives joy to the heart.'
    },
    { 
      number: 22, 
      name: 'الْخَافِضُ', 
      transliteration: 'Al-Khafidh', 
      meaning: language === 'ms' ? 'Yang Maha Merendahkan' : 'The Abaser', 
      detail: language === 'ms' ? 'Allah yang merendahkan darjat orang-orang yang sombong dan ingkar. Ia mengingatkan kita agar tidak takbur dengan nikmat sementara.' : 'The One who lowers.',
      quran: 'Surah Al-Waqi\'ah: 3',
      benefit: language === 'ms' ? 'Perlindungan daripada kezaliman orang yang sombong.' : 'Protection from the oppression of the arrogant.'
    },
    { 
      number: 23, 
      name: 'الرَّافِعُ', 
      transliteration: 'Ar-Rafi\'', 
      meaning: language === 'ms' ? 'Yang Maha Meninggikan' : 'The Exalter', 
      detail: language === 'ms' ? 'Allah yang meninggikan darjat hamba-Nya yang berilmu dan bertakwa. Kemuliaan sejati hanyalah di sisi Allah SWT.' : 'The One who exalts.',
      quran: 'Surah Al-An\'am: 83',
      benefit: language === 'ms' ? 'Ditinggikan kedudukan dan darjat di mata manusia dan di sisi Allah.' : 'Raised position and rank in the sight of humans and Allah.'
    },
    { 
      number: 24, 
      name: 'الْمُعِزُّ', 
      transliteration: 'Al-Mu\'izz', 
      meaning: language === 'ms' ? 'Yang Maha Memuliakan' : 'The Bestower of Honors', 
      detail: language === 'ms' ? 'Dia yang memberikan kemuliaan kepada sesiapa yang dikehendaki-Nya. Kemuliaan yang datang daripada Allah tidak akan dapat dihina oleh sesiapa pun.' : 'The One who gives honor.',
      quran: 'Surah Ali Imran: 26',
      benefit: language === 'ms' ? 'Diberikan wibawa dan disegani oleh orang sekeliling.' : 'Granted authority and respected by those around.'
    },
    { 
      number: 25, 
      name: 'الْمُذِلُّ', 
      transliteration: 'Al-Mudhill', 
      meaning: language === 'ms' ? 'Yang Maha Menghinakan' : 'The Humiliator', 
      detail: language === 'ms' ? 'Allah menghinakan mereka yang menzalimi agama-Nya. Ini adalah amaran bagi mereka yang melampaui batas.' : 'The One who humbles.',
      quran: 'Surah Ali Imran: 26',
      benefit: language === 'ms' ? 'Dijauhkan daripada sifat sombong dan selamat daripada tipu daya musuh.' : 'Kept away from arrogance and safe from enemy deception.'
    },
    { 
      number: 26, 
      name: 'السَّمِيعُ', 
      transliteration: 'As-Sami\'', 
      meaning: language === 'ms' ? 'Yang Maha Mendengar' : 'The All-Hearing', 
      detail: language === 'ms' ? 'Mendengar setiap bisikan hati dan doa hamba-Nya. Tiada satu pun suara yang terlepas daripada pengetahuan-Nya.' : 'The One who hears everything.',
      quran: 'Surah Al-Baqarah: 127',
      benefit: language === 'ms' ? 'Doa diijabah dan sentiasa merasa dalam pengawasan Allah.' : 'Prayers are answered and always feeling under Allah\'s supervision.'
    },
    { 
      number: 27, 
      name: 'الْبَصِيرُ', 
      transliteration: 'Al-Basir', 
      meaning: language === 'ms' ? 'Yang Maha Melihat' : 'The All-Seeing', 
      detail: language === 'ms' ? 'Melihat segala yang ada di alam semesta, yang nyata mahupun yang tersembunyi halus.' : 'The One who sees everything.',
      quran: 'Surah Al-Baqarah: 110',
      benefit: language === 'ms' ? 'Terhindar daripada maksiat yang tersembunyi.' : 'Avoidance of hidden sins.'
    },
    { 
      number: 28, 
      name: 'الْحَكَمُ', 
      transliteration: 'Al-Hakam', 
      meaning: language === 'ms' ? 'Yang Maha Menghukum' : 'The Judge', 
      detail: language === 'ms' ? 'Hakim yang paling adil. Keputusan-Nya adalah mutlak dan tidak boleh dibantah.' : 'The Impartial Judge.',
      quran: 'Surah Al-An\'am: 114',
      benefit: language === 'ms' ? 'Diberikan keadilan dalam urusan dan dijauhkan daripada kezaliman.' : 'Given justice in affairs and kept away from oppression.'
    },
    { 
      number: 29, 
      name: 'الْعَدْلُ', 
      transliteration: 'Al-Adl', 
      meaning: language === 'ms' ? 'Yang Maha Adil' : 'The Utterly Just', 
      detail: language === 'ms' ? 'Keadilan Allah adalah sempurna. Dia tidak pernah menzalimi walau sebesar zarah pun.' : 'The One who is entitled to do what He does.',
      quran: 'Surah Al-An\'am: 115',
      benefit: language === 'ms' ? 'Hati menjadi tenang dengan takdir Allah yang sentiasa adil.' : 'The heart becomes calm with Allah\'s destiny which is always just.'
    },
    { 
      number: 30, 
      name: 'اللَّطِيفُ', 
      transliteration: 'Al-Latif', 
      meaning: language === 'ms' ? 'Yang Maha Lembut' : 'The Subtle One', 
      detail: language === 'ms' ? 'Dia mengetahui segala yang halus. Rahmat-Nya juga sampai kepada hamba-Nya dengan cara yang paling halus dan lembut.' : 'The One who is subtle in actions.',
      quran: 'Surah Al-An\'am: 103',
      benefit: language === 'ms' ? 'Urusan hidup menjadi mudah dan hati menjadi tenang.' : 'Life affairs become easy and the heart becomes calm.'
    },
    { 
      number: 31, 
      name: 'الْخَبِيرُ', 
      transliteration: 'Al-Khabir', 
      meaning: language === 'ms' ? 'Yang Maha Waspada' : 'The All-Aware', 
      detail: language === 'ms' ? 'Mengetahui rahsia yang paling dalam dan perkara yang akan berlaku.' : 'The One who knows the internal qualities of all things.',
      quran: 'Surah Al-An\'am: 18',
      benefit: language === 'ms' ? 'Dilindungi daripada tipu daya dan fitnah.' : 'Protected from deception and slander.'
    },
    { 
      number: 32, 
      name: 'الْحَلِيمُ', 
      transliteration: 'Al-Halim', 
      meaning: language === 'ms' ? 'Yang Maha Penyantun' : 'The Forbearing', 
      detail: language === 'ms' ? 'Tidak terburu-buru menghukum hamba-Nya yang melakukan dosa.' : 'The One who is not in a hurry to punish.',
      quran: 'Surah Al-Baqarah: 225',
      benefit: language === 'ms' ? 'Menenangkan kemarahan dan memberikan kesabaran.' : 'Calms anger and gives patience.'
    },
    { 
      number: 33, 
      name: 'الْعَظِيمُ', 
      transliteration: 'Al-Azim', 
      meaning: language === 'ms' ? 'Yang Maha Agung' : 'The Magnificent', 
      detail: language === 'ms' ? 'Keagungan-Nya tidak terbatas dan tiada tandingan.' : 'The One who is infinite and beyond understanding.',
      quran: 'Surah Al-Baqarah: 255',
      benefit: language === 'ms' ? 'Mendapat kemuliaan dan dihormati makhluk.' : 'Granted honor and respected by creation.'
    },
    { 
      number: 34, 
      name: 'الْغَفُورُ', 
      transliteration: 'Al-Ghafur', 
      meaning: language === 'ms' ? 'Yang Maha Pengampun' : 'The All-Forgiving', 
      detail: language === 'ms' ? 'Mengampuni dosa yang besar dengan rahmat-Nya.' : 'The One who forgives all sins.',
      quran: 'Surah Al-Baqarah: 173',
      benefit: language === 'ms' ? 'Penyembuh penyakit dan penawar duka.' : 'Healer of diseases and cure for grief.'
    },
    { 
      number: 35, 
      name: 'الشَّكُورُ', 
      transliteration: 'Ash-Shakur', 
      meaning: language === 'ms' ? 'Yang Maha Bersyukur' : 'The Grateful', 
      detail: language === 'ms' ? 'Membalas amalan yang sedikit dengan ganjaran yang melimpah.' : 'The One who rewards abundantly for small deeds.',
      quran: 'Surah Fatir: 30',
      benefit: language === 'ms' ? 'Menambah nikmat dan syukur dalam hati.' : 'Increases blessings and gratitude in the heart.'
    },
    { 
      number: 36, 
      name: 'الْعَلِيُّ', 
      transliteration: 'Al-Ali', 
      meaning: language === 'ms' ? 'Yang Maha Tinggi' : 'The Most High', 
      detail: language === 'ms' ? 'Ketinggian-Nya mutlak di atas segala-galanya.' : 'The One who is above everything.',
      quran: 'Surah Al-Baqarah: 255',
      benefit: language === 'ms' ? 'Mendapat kedudukan yang tinggi dan kejayaan.' : 'Granted high position and success.'
    },
    { 
      number: 37, 
      name: 'الْكَبِيرُ', 
      transliteration: 'Al-Kabir', 
      meaning: language === 'ms' ? 'Yang Maha Besar' : 'The Greatest', 
      detail: language === 'ms' ? 'Kebesaran-Nya tidak dapat diukur oleh masa dan ruang.' : 'The One who is greater than anything.',
      quran: 'Surah Ar-Ra\'d: 9',
      benefit: language === 'ms' ? 'Membuka pintu rezeki dan menghalau gangguan jin.' : 'Opens doors of sustenance and wards off djinns.'
    },
    { 
      number: 38, 
      name: 'الْحَفِيظُ', 
      transliteration: 'Al-Hafiz', 
      meaning: language === 'ms' ? 'Yang Maha Memelihara' : 'The Preserver', 
      detail: language === 'ms' ? 'Menjaga seluruh alam dan amalan hamba-Nya.' : 'The One who protects and preserves.',
      quran: 'Surah Hud: 57',
      benefit: language === 'ms' ? 'Perlindungan daripada bencana dan bahaya.' : 'Protection from disasters and dangers.'
    },
    { 
      number: 39, 
      name: 'الْمُقِيتُ', 
      transliteration: 'Al-Muqit', 
      meaning: language === 'ms' ? 'Yang Maha Memberi Kecukupan' : 'The Nourisher', 
      detail: language === 'ms' ? 'Pemberi kekuatan dan makanan kepada seluruh makhluk.' : 'The One who gives power and food for all.',
      quran: 'Surah An-Nisa\': 85',
      benefit: language === 'ms' ? 'Diberikan kekuatan dan kecukupan rezeki harian.' : 'Granted strength and daily sufficiency.'
    },
    { 
      number: 40, 
      name: 'الْحَسِيبُ', 
      transliteration: 'Al-Hasib', 
      meaning: language === 'ms' ? 'Yang Maha Penghisab' : 'The Accounter', 
      detail: language === 'ms' ? 'Mencukupi keperluan hamba-Nya dan menghisap setiap amal.' : 'The One who is sufficient for everything.',
      quran: 'Surah An-Nisa\': 6',
      benefit: language === 'ms' ? 'Allah akan mencukupi segala keperluan hidup.' : 'Allah will suffice all life needs.'
    },
    { 
      number: 41, 
      name: 'الْجَلِيلُ', 
      transliteration: 'Al-Jalil', 
      meaning: language === 'ms' ? 'Yang Maha Luhur' : 'The Majestic', 
      detail: language === 'ms' ? 'Pemilik sifat-sifat kesempurnaan dan keagungan.' : 'The One who has the attributes of greatness.',
      quran: 'Surah Ar-Rahman: 27',
      benefit: language === 'ms' ? 'Dihormati dan disegani oleh kawan mahupun lawan.' : 'Respected and feared by friend and foe.'
    },
    { 
      number: 42, 
      name: 'الْكَرِيمُ', 
      transliteration: 'Al-Karim', 
      meaning: language === 'ms' ? 'Yang Maha Mulia' : 'The Generous', 
      detail: language === 'ms' ? 'Memberi tanpa diminta dan memaafkan walaupun berkuasa mendendam.' : 'The One who is most generous.',
      quran: 'Surah Al-Infitar: 6',
      benefit: language === 'ms' ? 'Mendapat kemuliaan di dunia dan akhirat.' : 'Granted honor in this world and the hereafter.'
    },
    { 
      number: 43, 
      name: 'الرَّقِيبُ', 
      transliteration: 'Ar-Raqib', 
      meaning: language === 'ms' ? 'Yang Maha Mengawasi' : 'The Watchful', 
      detail: language === 'ms' ? 'Pengawas yang tidak pernah tidur dan tidak pernah lalai.' : 'The One who observes everything.',
      quran: 'Surah Al-Ahzab: 52',
      benefit: language === 'ms' ? 'Selamat daripada gangguan dan kejahatan tersembunyi.' : 'Safe from hidden disturbances and evils.'
    },
    { 
      number: 44, 
      name: 'الْمُجِيبُ', 
      transliteration: 'Al-Mujib', 
      meaning: language === 'ms' ? 'Yang Maha Mengabulkan' : 'The Responsive', 
      detail: language === 'ms' ? 'Sentiasa menyahut seruan dan doa hamba-Nya.' : 'The One who responds to prayers.',
      quran: 'Surah Hud: 61',
      benefit: language === 'ms' ? 'Doa-doa cepat dikabulkan oleh Allah SWT.' : 'Prayers are quickly answered by Allah.'
    },
    { 
      number: 45, 
      name: 'الْوَاسِعُ', 
      transliteration: 'Al-Wasi\'', 
      meaning: language === 'ms' ? 'Yang Maha Luas' : 'The All-Embracing', 
      detail: language === 'ms' ? 'Rahmat dan ilmu-Nya meliputi segala-galanya.' : 'The One whose capacity is limitless.',
      quran: 'Surah Al-Baqarah: 268',
      benefit: language === 'ms' ? 'Diluangkan rezeki dan dilapangkan hati.' : 'Expanded sustenance and peaceful heart.'
    },
    { 
      number: 46, 
      name: 'الْحَكِيمُ', 
      transliteration: 'Al-Hakim', 
      meaning: language === 'ms' ? 'Yang Maha Bijaksana' : 'The All-Wise', 
      detail: language === 'ms' ? 'Setiap ciptaan dan aturan-Nya mempunyai hikmah yang mendalam.' : 'The One who is correct in His doings.',
      quran: 'Surah Al-Baqarah: 129',
      benefit: language === 'ms' ? 'Diberikan hikmah dan kebijaksanaan dalam bertindak.' : 'Granted wisdom and prudence in actions.'
    },
    { 
      number: 47, 
      name: 'الْوَدُودُ', 
      transliteration: 'Al-Wadud', 
      meaning: language === 'ms' ? 'Yang Maha Pencinta' : 'The Most Loving', 
      detail: language === 'ms' ? 'Sangat mencintai hamba-Nya yang soleh dan menarik cinta dalam hati manusia.' : 'The One who loves His believers.',
      quran: 'Surah Al-Buruj: 14',
      benefit: language === 'ms' ? 'Menarik kasih sayang manusia dan kedamaian rumah tangga.' : 'Attracts human love and household peace.'
    },
    { 
      number: 48, 
      name: 'الْمَجِيدُ', 
      transliteration: 'Al-Majid', 
      meaning: language === 'ms' ? 'Yang Maha Mulia' : 'The Glorious', 
      detail: language === 'ms' ? 'Kemuliaan-Nya sempurna dan sangat tinggi.' : 'The One who is most glorious.',
      quran: 'Surah Hud: 73',
      benefit: language === 'ms' ? 'Mendapat kedudukan yang terpuji dan mulia.' : 'Granted a praised and noble position.'
    },
    { 
      number: 49, 
      name: 'الْبَاعِثُ', 
      transliteration: 'Al-Ba\'ith', 
      meaning: language === 'ms' ? 'Yang Maha Membangkitkan' : 'The Resurrector', 
      detail: language === 'ms' ? 'Membangkitkan manusia dari kubur untuk dihadapkan ke mahkamah Allah.' : 'The One who resurrects the dead.',
      quran: 'Surah Al-Hajj: 7',
      benefit: language === 'ms' ? 'Hati menjadi takut kepada Allah dan sentiasa bersedia untuk mati.' : 'The heart fears Allah and is always ready for death.'
    },
    { 
      number: 50, 
      name: 'الشَّهِيدُ', 
      transliteration: 'Ash-Shahid', 
      meaning: language === 'ms' ? 'Yang Maha Menyaksikan' : 'The Witness', 
      detail: language === 'ms' ? 'Saksi yang tidak pernah terlepas sebarang kejadian.' : 'The One who witnesses everything.',
      quran: 'Surah Al-Ma\'idah: 117',
      benefit: language === 'ms' ? 'Kebenaran akan tertegak dan musuh akan terdedah.' : 'Truth will prevail and enemies will be exposed.'
    },
    { 
      number: 51, 
      name: 'الْحَقُّ', 
      transliteration: 'Al-Haqq', 
      meaning: language === 'ms' ? 'Yang Maha Benar' : 'The Truth', 
      detail: language === 'ms' ? 'Kewujudan-Nya adalah benar dan segala janji-Nya adalah benar.' : 'The One whose existence is basic.',
      quran: 'Surah Al-An\'am: 62',
      benefit: language === 'ms' ? 'Diberikan ketetapan hati dalam kebenaran.' : 'Granted steadfastness in truth.'
    },
    { 
      number: 52, 
      name: 'الْوَكِيلُ', 
      transliteration: 'Al-Wakil', 
      meaning: language === 'ms' ? 'Yang Maha Mentadbir' : 'The Trustee', 
      detail: language === 'ms' ? 'Tempat berserah yang paling dipercayai bagi segala urusan.' : 'The One who provides a solution.',
      quran: 'Surah Al-An\'am: 102',
      benefit: language === 'ms' ? 'Segala urusan akan dipermudahkan dan dilindungi.' : 'All affairs will be eased and protected.'
    },
    { 
      number: 53, 
      name: 'الْقَوِيُّ', 
      transliteration: 'Al-Qawiyy', 
      meaning: language === 'ms' ? 'Yang Maha Kuat' : 'The Strong', 
      detail: language === 'ms' ? 'Memiliki kekuatan yang tidak terbatas dan tidak pernah lemah.' : 'The One with the complete Power.',
      quran: 'Surah Al-Hajj: 40',
      benefit: language === 'ms' ? 'Diberikan kekuatan fizikal dan mental.' : 'Granted physical and mental strength.'
    },
    { 
      number: 54, 
      name: 'الْمَتِينُ', 
      transliteration: 'Al-Matin', 
      meaning: language === 'ms' ? 'Yang Maha Kukuh' : 'The Firm', 
      detail: language === 'ms' ? 'Kekuatan-Nya sangat kukuh dan tidak dapat digugat.' : 'The One with extreme Power.',
      quran: 'Surah Adz-Dzariyat: 58',
      benefit: language === 'ms' ? 'Diberikan ketetapan iman yang kukuh.' : 'Granted firm steadfastness of faith.'
    },
    { 
      number: 55, 
      name: 'الْوَلِيُّ', 
      transliteration: 'Al-Wali', 
      meaning: language === 'ms' ? 'Yang Maha Melindungi' : 'The Friend', 
      detail: language === 'ms' ? 'Pelindung dan penolong bagi hamba-hamba-Nya yang beriman.' : 'The One who supports His believers.',
      quran: 'Surah Al-Baqarah: 257',
      benefit: language === 'ms' ? 'Sentiasa mendapat pertolongan dan perlindungan Allah.' : 'Always getting Allah\'s help and protection.'
    },
    { 
      number: 56, 
      name: 'الْحَمِيدُ', 
      transliteration: 'Al-Hamid', 
      meaning: language === 'ms' ? 'Yang Maha Terpuji' : 'The Praiseworthy', 
      detail: language === 'ms' ? 'Layak menerima segala pujian atas segala nikmat dan sifat-Nya.' : 'The One who deserves to be praised.',
      quran: 'Surah Ibrahim: 8',
      benefit: language === 'ms' ? 'Menjadi hamba yang bersyukur dan disayangi Allah.' : 'Becoming a grateful servant and loved by Allah.'
    },
    { 
      number: 57, 
      name: 'الْمُحْصِي', 
      transliteration: 'Al-Muhsi', 
      meaning: language === 'ms' ? 'Yang Maha Menghitung' : 'The Counter', 
      detail: language === 'ms' ? 'Menghitung setiap zarah dan amalan manusia tanpa tertinggal sedikit pun.' : 'The One who the count of things is known to Him.',
      quran: 'Surah Maryam: 94',
      benefit: language === 'ms' ? 'Sentiasa berwaspada dalam melakukan amalan.' : 'Always alert in performing deeds.'
    },
    { 
      number: 58, 
      name: 'الْمُبْدِئُ', 
      transliteration: 'Al-Mubdi\'', 
      meaning: language === 'ms' ? 'Yang Maha Memulai' : 'The Originator', 
      detail: language === 'ms' ? 'Pencipta awal segalanya tanpa contoh sebelumnya.' : 'The One who started the creation.',
      quran: 'Surah Al-Buruj: 13',
      benefit: language === 'ms' ? 'Berjaya dalam setiap permulaan urusan baru.' : 'Success in every start of a new affair.'
    },
    { 
      number: 59, 
      name: 'الْمُعِيدُ', 
      transliteration: 'Al-Mu\'id', 
      meaning: language === 'ms' ? 'Yang Maha Mengembalikan' : 'The Restorer', 
      detail: language === 'ms' ? 'Akan mengembalikan semula nyawa selepas kematian.' : 'The One who restores creation.',
      quran: 'Surah Al-Buruj: 13',
      benefit: language === 'ms' ? 'Kembali kepada fitrah dan dijauhkan daripada kesesatan.' : 'Returning to fitrah and kept away from misguidance.'
    },
    { 
      number: 60, 
      name: 'الْمُحْيِي', 
      transliteration: 'Al-Muhyi', 
      meaning: language === 'ms' ? 'Yang Maha Menghidupkan' : 'The Giver of Life', 
      detail: language === 'ms' ? 'Pemberi kehidupan dan yang menghidupkan hati yang mati.' : 'The One who gives life.',
      quran: 'Surah Al-A\'raf: 158',
      benefit: language === 'ms' ? 'Mendapat kesembuhan daripada penyakit kronik.' : 'Healing from chronic diseases.'
    },
    { 
      number: 61, 
      name: 'الْمُمِيتُ', 
      transliteration: 'Al-Mumit', 
      meaning: language === 'ms' ? 'Yang Maha Mematikan' : 'The Bringer of Death', 
      detail: language === 'ms' ? 'Setiap yang hidup akan mati atas kehendak-Nya.' : 'The One who renders the living dead.',
      quran: 'Surah Al-A\'raf: 158',
      benefit: language === 'ms' ? 'Menghilangkan sifat sombong dan takutkan mati.' : 'Eliminates arrogance and fear of death.'
    },
    { 
      number: 62, 
      name: 'الْحَيُّ', 
      transliteration: 'Al-Hayy', 
      meaning: language === 'ms' ? 'Yang Maha Hidup' : 'The Ever-Living', 
      detail: language === 'ms' ? 'Hidup selama-lamanya tanpa awal dan tanpa akhir.' : 'The One who is undying.',
      quran: 'Surah Al-Baqarah: 255',
      benefit: language === 'ms' ? 'Diberikan umur yang berkat dan kesihatan yang baik.' : 'Granted blessed age and good health.'
    },
    { 
      number: 63, 
      name: 'الْقَيُّومُ', 
      transliteration: 'Al-Qayyum', 
      meaning: language === 'ms' ? 'Yang Maha Berdiri Sendiri' : 'The Self-Subsisting', 
      detail: language === 'ms' ? 'Tidak memerlukan sesiapa untuk terus wujud dan mentadbir alam.' : 'The One who remains and does not end.',
      quran: 'Surah Al-Baqarah: 255',
      benefit: language === 'ms' ? 'Ketenangan jiwa dan dijauhkan daripada sifat bergantung kepada makhluk.' : 'Peace of soul and kept away from relying on creatures.'
    },
    { 
      number: 64, 
      name: 'الْوَاجِدُ', 
      transliteration: 'Al-Wajid', 
      meaning: language === 'ms' ? 'Yang Maha Menemui' : 'The Perceiver', 
      detail: language === 'ms' ? 'Sentiasa menemui apa yang dikehendaki-Nya tanpa gagal.' : 'The One who finds what He wants.',
      quran: 'Surah Ad-Duha: 6-8',
      benefit: language === 'ms' ? 'Menemui jalan keluar atau barang yang hilang.' : 'Finding a way out or a lost item.'
    },
    { 
      number: 65, 
      name: 'الْمَاجِدُ', 
      transliteration: 'Al-Majid', 
      meaning: language === 'ms' ? 'Yang Maha Mulia' : 'The Noble', 
      detail: language === 'ms' ? 'Kemuliaan yang agung dan limpahan nikmat-Nya.' : 'The One who is noble.',
      quran: 'Surah Hud: 73',
      benefit: language === 'ms' ? 'Mendapat kemuliaan dan kebahagiaan sejati.' : 'Granted real honor and happiness.'
    },
    { 
      number: 66, 
      name: 'الْوَاحِدُ', 
      transliteration: 'Al-Wahid', 
      meaning: language === 'ms' ? 'Yang Maha Esa' : 'The Unique', 
      detail: language === 'ms' ? 'Tunggal pada zat, sifat, dan perbuatan-Nya.' : 'The One without a partner.',
      quran: 'Surah Al-Ikhlas: 1',
      benefit: language === 'ms' ? 'Menghilangkan perasaan takut dan ragu-ragu.' : 'Eliminates fear and doubt.'
    },
    { 
      number: 67, 
      name: 'الْأَحَدُ', 
      transliteration: 'Al-Ahad', 
      meaning: language === 'ms' ? 'Yang Maha Tunggal' : 'The One', 
      detail: language === 'ms' ? 'Maha Esa dalam kewujudan-Nya, tiada dua baginya.' : 'The One and Only.',
      quran: 'Surah Al-Ikhlas: 1',
      benefit: language === 'ms' ? 'Kekuatan tauhid yang mendalam dalam jiwa.' : 'Deep strength of monotheism in the soul.'
    },
    { 
      number: 68, 
      name: 'الصَّمَدُ', 
      transliteration: 'As-Samad', 
      meaning: language === 'ms' ? 'Yang Maha Diperlukan' : 'The Eternal', 
      detail: language === 'ms' ? 'Menjadi tumpuan segala makhluk untuk memohon apa sahaja keperluan.' : 'The One who is needed by everyone.',
      quran: 'Surah Al-Ikhlas: 2',
      benefit: language === 'ms' ? 'Tercapai hajat dan tidak lagi bergantung kepada manusia.' : 'Needs are met and no longer relying on humans.'
    },
    { 
      number: 69, 
      name: 'الْقَادِرُ', 
      transliteration: 'Al-Qadir', 
      meaning: language === 'ms' ? 'Yang Maha Menentukan' : 'The Able', 
      detail: language === 'ms' ? 'Berkuasa menentukan sesuatu mengikut kehendak-Nya.' : 'The One who is able to do anything.',
      quran: 'Surah Al-Baqarah: 20',
      benefit: language === 'ms' ? 'Kekuatan dalam menghadapi cabaran hidup.' : 'Strength in facing life challenges.'
    },
    { 
      number: 70, 
      name: 'الْمُقْتَدِرُ', 
      transliteration: 'Al-Muqtadir', 
      meaning: language === 'ms' ? 'Yang Maha Berkuasa' : 'The Powerful', 
      detail: language === 'ms' ? 'Kekuasaan yang tidak terbatas dan sangat hebat.' : 'The One who is dominant.',
      quran: 'Surah Al-Qamar: 42',
      benefit: language === 'ms' ? 'Allah akan menolong dalam urusan yang sulit.' : 'Allah will help in difficult affairs.'
    },
    { 
      number: 71, 
      name: 'الْمُقَدِّمُ', 
      transliteration: 'Al-Muqaddim', 
      meaning: language === 'ms' ? 'Yang Maha Mendahulukan' : 'The Expediter', 
      detail: language === 'ms' ? 'Mendahulukan apa yang dikehendaki-Nya mengikut hikmah.' : 'The One who makes things happen sooner.',
      quran: 'Surah Al-Isra\': 34',
      benefit: language === 'ms' ? 'Dahulukan dalam kebaikan dan kejayaan.' : 'Expedited in goodness and success.'
    },
    { 
      number: 72, 
      name: 'الْمُؤَخِّرُ', 
      transliteration: 'Al-Mu\'akhkhir', 
      meaning: language === 'ms' ? 'Yang Maha Mengemudiankan' : 'The Delayer', 
      detail: language === 'ms' ? 'Mengakhirkan sesuatu mengikut perancangan-Nya yang terbaik.' : 'The One who makes things happen later.',
      quran: 'Surah Ibrahim: 42',
      benefit: language === 'ms' ? 'Selamat daripada kejahatan yang segera.' : 'Safe from immediate evil.'
    },
    { 
      number: 73, 
      name: 'الْأَوَّلُ', 
      transliteration: 'Al-Awwal', 
      meaning: language === 'ms' ? 'Yang Maha Awal' : 'The First', 
      detail: language === 'ms' ? 'Wujud sebelum segala sesuatu wujud, tiada awal bagi kewujudan-Nya.' : 'The One whose existence has no beginning.',
      quran: 'Surah Al-Hadid: 3',
      benefit: language === 'ms' ? 'Mendapat keberkatan dalam setiap permulaan urusan.' : 'Granted blessings in every start of an affair.'
    },
    { 
      number: 74, 
      name: 'الْآخِرُ', 
      transliteration: 'Al-Akhir', 
      meaning: language === 'ms' ? 'Yang Maha Akhir' : 'The Last', 
      detail: language === 'ms' ? 'Kekal wujud selepas segala sesuatu binasa, tiada akhir bagi-Nya.' : 'The One whose existence has no end.',
      quran: 'Surah Al-Hadid: 3',
      benefit: language === 'ms' ? 'Husnul Khatimah (pengakhiran yang baik).' : 'Husnul Khatimah (a good end).'
    },
    { 
      number: 75, 
      name: 'الظَّاهِرُ', 
      transliteration: 'Az-Zahir', 
      meaning: language === 'ms' ? 'Yang Maha Nyata' : 'The Manifest', 
      detail: language === 'ms' ? 'Kewujudan-Nya dibuktikan dengan segala ciptaan-Nya yang nyata.' : 'The One who is evident.',
      quran: 'Surah Al-Hadid: 3',
      benefit: language === 'ms' ? 'Hati dibukakan untuk melihat kebesaran Allah.' : 'The heart is opened to see Allah\'s greatness.'
    },
    { 
      number: 76, 
      name: 'الْبَاطِنُ', 
      transliteration: 'Al-Batin', 
      meaning: language === 'ms' ? 'Yang Maha Tersembunyi' : 'The Hidden', 
      detail: language === 'ms' ? 'Zat Allah tidak dapat dilihat melainkan dengan mata hati.' : 'The One who is hidden from eyes.',
      quran: 'Surah Al-Hadid: 3',
      benefit: language === 'ms' ? 'Hati menjadi tenang dan khusyuk dalam ibadah.' : 'The heart becomes calm and focused in worship.'
    },
    { 
      number: 77, 
      name: 'الْوَالِي', 
      transliteration: 'Al-Wali', 
      meaning: language === 'ms' ? 'Yang Maha Memerintah' : 'The Governor', 
      detail: language === 'ms' ? 'Pemerintah mutlak yang mentadbir segala urusan makhluk-Nya.' : 'The One who manages everything.',
      quran: 'Surah Ar-Ra\'d: 11',
      benefit: language === 'ms' ? 'Selamat daripada gangguan pemerintah yang zalim.' : 'Safe from the interference of oppressive rulers.'
    },
    { 
      number: 78, 
      name: 'الْمُتَعَالِي', 
      transliteration: 'Al-Muta\'ali', 
      meaning: language === 'ms' ? 'Yang Maha Tinggi' : 'The Most Exalted', 
      detail: language === 'ms' ? 'Maha Tinggi daripada segala sifat kurang dan cela.' : 'The One who is above everything.',
      quran: 'Surah Ar-Ra\'d: 9',
      benefit: language === 'ms' ? 'Ditinggikan darjat dan dihormati oleh masyarakat.' : 'Raised in rank and respected by society.'
    },
    { 
      number: 79, 
      name: 'الْبَرُّ', 
      transliteration: 'Al-Barr', 
      meaning: language === 'ms' ? 'Yang Maha Penderma' : 'The Source of Goodness', 
      detail: language === 'ms' ? 'Sentiasa melimpahkan kebaikan dan kebajikan kepada makhluk-Nya.' : 'The One who is kind to His creatures.',
      quran: 'Surah At-Tur: 28',
      benefit: language === 'ms' ? 'Allah akan memudahkan jalan ke arah kebaikan.' : 'Allah will ease the way toward goodness.'
    },
    { 
      number: 80, 
      name: 'التَّوَّابُ', 
      transliteration: 'At-Tawwab', 
      meaning: language === 'ms' ? 'Yang Maha Penerima Taubat' : 'The Acceptor of Repentance', 
      detail: language === 'ms' ? 'Sentiasa membuka pintu taubat bagi hamba-Nya yang ingin kembali.' : 'The One who accepts repentance.',
      quran: 'Surah Al-Baqarah: 128',
      benefit: language === 'ms' ? 'Taubat diterima dan jiwa menjadi bersih semula.' : 'Repentance is accepted and the soul becomes clean again.'
    },
    { 
      number: 81, 
      name: 'الْمُنْتَقِمُ', 
      transliteration: 'Al-Muntaqim', 
      meaning: language === 'ms' ? 'Yang Maha Pemberi Balasan' : 'The Avenger', 
      detail: language === 'ms' ? 'Memberi balasan yang setimpal kepada mereka yang ingkar.' : 'The One who punishes the wrongdoers.',
      quran: 'Surah As-Sajdah: 22',
      benefit: language === 'ms' ? 'Diberikan kemenangan terhadap musuh yang zalim.' : 'Granted victory over oppressive enemies.'
    },
    { 
      number: 82, 
      name: 'الْعَفُوُّ', 
      transliteration: 'Al-Afuww', 
      meaning: language === 'ms' ? 'Yang Maha Pemaaf' : 'The Pardoner', 
      detail: language === 'ms' ? 'Menghapuskan dosa seolah-olah hamba itu tidak pernah melakukannya.' : 'The One who blots out sins.',
      quran: 'Surah An-Nisa\': 43',
      benefit: language === 'ms' ? 'Dosanya diampuni dan hatinya menjadi tenang.' : 'Sins are forgiven and the heart becomes calm.'
    },
    { 
      number: 83, 
      name: 'الرَّؤُوفُ', 
      transliteration: 'Ar-Ra\'uf', 
      meaning: language === 'ms' ? 'Yang Maha Pengasih' : 'The Compassionate', 
      detail: language === 'ms' ? 'Belas kasihan-Nya sangat tinggi melebihi segalanya.' : 'The One with extreme mercy.',
      quran: 'Surah Al-Baqarah: 143',
      benefit: language === 'ms' ? 'Mendapat kasih sayang Allah dan manusia.' : 'Granted Allah\'s and human love.'
    },
    { 
      number: 84, 
      name: 'مَالِكُ الْمُلْكِ', 
      transliteration: 'Malik-ul-Mulk', 
      meaning: language === 'ms' ? 'Pemilik Kedaulatan' : 'The Owner of All', 
      detail: language === 'ms' ? 'Pemilik mutlak segala kekuasaan di langit dan di bumi.' : 'The One who owns everything.',
      quran: 'Surah Ali Imran: 26',
      benefit: language === 'ms' ? 'Diberikan kecukupan harta dan kewibawaan.' : 'Granted sufficiency of wealth and authority.'
    },
    { 
      number: 85, 
      name: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', 
      transliteration: 'Dhul-Jalali wal-Ikram', 
      meaning: language === 'ms' ? 'Pemilik Keagungan dan Kemuliaan' : 'The Lord of Majesty and Generosity', 
      detail: language === 'ms' ? 'Pemilik segala kebesaran dan sumber segala kehormatan.' : 'The One who has Majesty and Generosity.',
      quran: 'Surah Ar-Rahman: 27',
      benefit: language === 'ms' ? 'Segala hajat dikabulkan dan dihormati makhluk.' : 'All needs are met and respected by creation.'
    },
    { 
      number: 86, 
      name: 'الْمُقْسِطُ', 
      transliteration: 'Al-Muqsit', 
      meaning: language === 'ms' ? 'Yang Maha Saksama' : 'The Equitable', 
      detail: language === 'ms' ? 'Memberikan hak kepada yang berhak dengan seadil-adilnya.' : 'The One who is equitable.',
      quran: 'Surah An-Nisa\': 135',
      benefit: language === 'ms' ? 'Dijauhkan daripada melakukan kezaliman.' : 'Avoidance of doing oppression.'
    },
    { 
      number: 87, 
      name: 'الْجَامِعُ', 
      transliteration: 'Al-Jami\'', 
      meaning: language === 'ms' ? 'Yang Maha Mengumpulkan' : 'The Gatherer', 
      detail: language === 'ms' ? 'Mengumpulkan segala makhluk di Padang Mahsyar.' : 'The One who gathers.',
      quran: 'Surah Ali Imran: 9',
      benefit: language === 'ms' ? 'Dapat mengumpulkan barang yang hilang atau keluarga yang berpecah.' : 'Ability to gather lost items or split families.'
    },
    { 
      number: 88, 
      name: 'الْغَنِيُّ', 
      transliteration: 'Al-Ghani', 
      meaning: language === 'ms' ? 'Yang Maha Kaya' : 'The Self-Sufficient', 
      detail: language === 'ms' ? 'Tidak memerlukan apa-apa daripada sesiapa pun.' : 'The One who is all-rich.',
      quran: 'Surah Al-Baqarah: 263',
      benefit: language === 'ms' ? 'Diberikan kekayaan jiwa dan kecukupan harta.' : 'Granted riches of soul and sufficiency of wealth.'
    },
    { 
      number: 89, 
      name: 'الْمُغْنِي', 
      transliteration: 'Al-Mughni', 
      meaning: language === 'ms' ? 'Yang Maha Memberi Kekayaan' : 'The Enricher', 
      detail: language === 'ms' ? 'Memberi kekayaan kepada sesiapa yang dikehendaki-Nya.' : 'The One who enriches.',
      quran: 'Surah An-Najm: 48',
      benefit: language === 'ms' ? 'Dipermudahkan urusan rezeki dan kekayaan.' : 'Eased in sustenance and riches.'
    },
    { 
      number: 90, 
      name: 'الْمَانِعُ', 
      transliteration: 'Al-Mani\'', 
      meaning: language === 'ms' ? 'Yang Maha Mencegah' : 'The Preventer', 
      detail: language === 'ms' ? 'Mencegah bahaya atau menahan nikmat mengikut hikmah-Nya.' : 'The One who prevents harm.',
      quran: 'Surah Al-Mulk: 21',
      benefit: language === 'ms' ? 'Selamat daripada bencana dan musibah.' : 'Safe from disasters and calamities.'
    },
    { 
      number: 91, 
      name: 'الضَّارُّ', 
      transliteration: 'Ad-Dharr', 
      meaning: language === 'ms' ? 'Yang Maha Memberi Mudarat' : 'The Distressor', 
      detail: language === 'ms' ? 'Hanya Allah yang boleh memberi mudarat sebagai ujian.' : 'The One who can cause harm.',
      quran: 'Surah Al-An\'am: 17',
      benefit: language === 'ms' ? 'Selamat daripada gangguan sihir dan penyakit.' : 'Safe from magic and diseases.'
    },
    { 
      number: 92, 
      name: 'النَّافِعُ', 
      transliteration: 'An-Nafi\'', 
      meaning: language === 'ms' ? 'Yang Maha Memberi Manfaat' : 'The Propitious', 
      detail: language === 'ms' ? 'Hanya Allah sumber segala manfaat di dunia ini.' : 'The One who gives benefit.',
      quran: 'Surah Al-An\'am: 17',
      benefit: language === 'ms' ? 'Mendapat manfaat dalam setiap usaha yang dilakukan.' : 'Granted benefit in every effort made.'
    },
    { 
      number: 93, 
      name: 'النُّورُ', 
      transliteration: 'An-Nur', 
      meaning: language === 'ms' ? 'Yang Maha Bercahaya' : 'The Light', 
      detail: language === 'ms' ? 'Pemberi cahaya hidayah kepada hati hamba-Nya.' : 'The One who provides light.',
      quran: 'Surah An-Nur: 35',
      benefit: language === 'ms' ? 'Mendapat cahaya iman dan terang hati.' : 'Granted light of faith and enlightenment.'
    },
    { 
      number: 94, 
      name: 'الْهَادِي', 
      transliteration: 'Al-Hadi', 
      meaning: language === 'ms' ? 'Yang Maha Pemberi Petunjuk' : 'The Guide', 
      detail: language === 'ms' ? 'Membimbing hamba-Nya ke jalan yang lurus dan benar.' : 'The One who guides.',
      quran: 'Surah Al-Hajj: 54',
      benefit: language === 'ms' ? 'Sentiasa berada di bawah hidayah Allah SWT.' : 'Always staying under Allah\'s guidance.'
    },
    { 
      number: 95, 
      name: 'الْبَدِيعُ', 
      transliteration: 'Al-Badi\'', 
      meaning: language === 'ms' ? 'Yang Maha Pencipta Keindahan' : 'The Incomparable', 
      detail: language === 'ms' ? 'Mencipta segala sesuatu dengan penuh keindahan dan keunikan.' : 'The One who creates in an amazing way.',
      quran: 'Surah Al-Baqarah: 117',
      benefit: language === 'ms' ? 'Diberikan kreativiti dan ilham yang luar biasa.' : 'Granted creativity and extraordinary inspiration.'
    },
    { 
      number: 96, 
      name: 'الْبَاقِي', 
      transliteration: 'Al-Baqi', 
      meaning: language === 'ms' ? 'Yang Maha Kekal' : 'The Everlasting', 
      detail: language === 'ms' ? 'Kekal abadi walaupun segala-galanya telah binasa.' : 'The One who is eternal.',
      quran: 'Surah Taha: 73',
      benefit: language === 'ms' ? 'Mendapat amalan yang pahalanya mengalir kekal.' : 'Granted deeds whose rewards flow eternally.'
    },
    { 
      number: 97, 
      name: 'الْوَارِثُ', 
      transliteration: 'Al-Warith', 
      meaning: language === 'ms' ? 'Yang Maha Mewarisi' : 'The Inheritor', 
      detail: language === 'ms' ? 'Pewaris mutlak segala sesuatu setelah pemilik asalnya tiada.' : 'The One who inherits everything.',
      quran: 'Surah Al-Hijr: 23',
      benefit: language === 'ms' ? 'Mendapat warisan yang baik dan rezeki berpanjangan.' : 'Granted good inheritance and long-lasting sustenance.'
    },
    { 
      number: 98, 
      name: 'الرَّشِيدُ', 
      transliteration: 'Ar-Rashid', 
      meaning: language === 'ms' ? 'Yang Maha Pandai' : 'The Guide to Right Path', 
      detail: language === 'ms' ? 'Memberi bimbingan yang tepat ke arah kebaikan tanpa silap.' : 'The One who guides to the right path.',
      quran: 'Surah Al-Kahf: 17',
      benefit: language === 'ms' ? 'Sentiasa membuat keputusan yang bijak dan benar.' : 'Always making wise and correct decisions.'
    },
    { 
      number: 99, 
      name: 'الصَّبُورُ', 
      transliteration: 'As-Sabur', 
      meaning: language === 'ms' ? 'Yang Maha Penyabar' : 'The Patient', 
      detail: language === 'ms' ? 'Sangat penyabar terhadap kerenah hamba-Nya dan tidak terburu-buru menghukum.' : 'The One who is very patient.',
      quran: 'Surah Al-Ahzab: 35',
      benefit: language === 'ms' ? 'Diberikan kesabaran yang tinggi dalam menghadapi ujian.' : 'Granted high patience in facing trials.'
    }
  ];

  const filtered = ASMAUL_HUSNA.filter(name => 
    name.transliteration.toLowerCase().includes(search.toLowerCase()) || 
    name.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-32 px-4"
    >
      <header className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm">
            <Star size={14} className="text-amber-400" />
            {t('names.subtitle')}
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">{t('names.title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm font-medium leading-relaxed uppercase tracking-widest">
            {t('names.quote')}
          </p>
          
          <div className="max-w-md mx-auto relative pt-8">
             <Search size={18} className="absolute left-6 bottom-4 -translate-y-1/2 text-slate-500" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder={t('names.search')}
               className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 font-bold text-xs uppercase tracking-widest text-white placeholder-slate-600 transition-all"
             />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabic-bazillion.png')]"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((name) => (
          <motion.div
            key={name.number}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -8 }}
            onClick={() => setSelectedName(name)}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all text-center group relative overflow-hidden cursor-pointer"
          >
            <div className="absolute top-6 left-6 text-[10px] font-black text-slate-100 group-hover:text-emerald-50 transition-colors uppercase">#{name.number}</div>
            
            <div className="space-y-6 pt-4">
               <p className="font-arabic text-5xl text-emerald-950 group-hover:text-emerald-600 transition-colors">{name.name}</p>
               <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{name.transliteration}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight px-4">{name.meaning}</p>
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 transition-colors">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-emerald-600">{language === 'ms' ? 'Klik untuk penjelasan' : 'Click for details'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedName && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedName(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 p-6 flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-xl rounded-[4rem] overflow-hidden shadow-2xl relative p-12 md:p-16 space-y-8 border border-slate-100"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center font-black text-xl mx-auto shadow-sm border border-emerald-100">
                  #{selectedName.number}
                </div>
                <p className="font-arabic text-7xl text-emerald-950">{selectedName.name}</p>
                <div>
                   <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight italic">{selectedName.transliteration}</h3>
                   <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">{selectedName.meaning}</p>
                </div>
              </div>

              <div className="space-y-8">
                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Info size={14} /> {language === 'ms' ? 'PENJELASAN' : 'EXPLANATION'}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                       {selectedName.detail}
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          {language === 'ms' ? 'DALAM AL-QURAN' : 'IN QURAN'}
                       </p>
                       <p className="text-xs font-bold text-slate-700">{selectedName.quran}</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                       <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">
                          {language === 'ms' ? 'MANFAAT ZIKIR' : 'BENEFIT'}
                       </p>
                       <p className="text-xs font-bold text-emerald-900">{selectedName.benefit}</p>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedName(null)}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all"
              >
                {language === 'ms' ? 'TUTUP' : 'CLOSE'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

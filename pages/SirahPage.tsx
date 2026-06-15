import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Bookmark, Share2, ChevronRight, UserCircle, X, Sparkles, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export function SirahPage() {
  const { t, language } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const sirahEpochs = [
    {
      id: 1,
      title: language === 'ms' ? 'Kelahiran & Tahun Gajah' : 'Birth & Year of the Elephant',
      year: '570 M',
      description: language === 'ms' 
        ? 'Nabi Muhammad SAW dilahirkan pada subuh hari Isnin, 12 Rabiulawal. Kelahiran baginda diiringi dengan terpancarnya cahaya yang menerangi istana di Syam.' 
        : 'Prophet Muhammad PBUH was born on Monday dawn, 12th Rabiulawwal. His birth was accompanied by a light illuminating palaces in Sham.',
      fullStory: language === 'ms'
        ? 'Nabi Muhammad SAW dilahirkan pada subuh hari Isnin, 12 Rabiulawal Tahun Gajah di Mekah. Ayahanda baginda, Abdullah bin Abdul Muttalib telah wafat sebelum baginda dilahirkan. Bondanya, Aminah binti Wahab, menceritakan bahawa sewaktu mengandung, beliau melihat cahaya keluar dari rahimnya yang menerangi istana-istana di Syam. Baginda kemudian disusukan oleh Thuwaibah al-Aslamiah dan Halimatus Sa\'adiah di perkampungan Bani Sa\'ad. Kehidupan baginda di sana membawa keberkatan yang luar biasa kepada keluarga Halimah, di mana ternakan mereka menjadi gemuk dan susu mereka melimpah ruah. Di sinilah juga berlakunya peristiwa pembelahan dada baginda oleh malaikat Jibril untuk membersihkan hati baginda daripada segala kotoran. Peristiwa ini melambangkan penyucian rohani baginda sebelum memikul tanggungjawab besar sebagai Rasulullah.'
        : 'The Prophet PBUH was born in Makkah on the 12th of Rabi\' al-Awwal in the Year of the Elephant. His father, Abdullah, passed away before his birth. His mother, Aminah, witnessed a light radiating from her at his birth that illuminated the palaces of Sham. He was cared for by Halimatus Sa\'adiah in the desert, where her family experienced immense blessings — their livestock flourished and their land became fertile. During this time, the "Cleansing of the Heart" occurred when Angel Jibril appeared and washed his heart with Zamzam water, removing any trace of worldly impurity. This miracle prepared his soul for the divine mission that awaited him years later.',
      lessons: language === 'ms'
        ? ['Kelahiran Nabi adalah rahmat bagi sekalian alam.', 'Penyucian hati adalah asas kepada integriti dan akhlak mulia.', 'Keberkatan datang kepada mereka yang menyantuni anak yatim.']
        : ['The Prophet\'s birth is a mercy to all worlds.', 'Purification of the heart is the foundation of integrity.', 'Blessings come to those who care for orphans.'],
      status: 'Completed'
    },
    {
      id: 2,
      title: language === 'ms' ? 'Peristiwa Peletakan Hajarul Aswad' : 'Placing of the Black Stone',
      year: '605 M',
      description: language === 'ms'
        ? 'Pada usia 35 tahun, berlaku pertikaian sengit antara kabilah tentang siapa yang paling layak meletakkan Hajarul Aswad.'
        : 'At age 35, tribes disputed over who would place the Black Stone in the newly reconstructed Kaaba.',
      fullStory: language === 'ms'
        ? 'Apabila Kaabah perlu dibina semula akibat banjir besar, kabilah-kabilah Arab bertikai hebat tentang siapa yang paling layak mendapat kemuliaan meletakkan Hajarul Aswad ke tempat asalnya. Pertikaian ini hampir mencetuskan pertumpahan darah selama 4-5 hari. Akhirnya, mereka bersetuju bahawa sesiapa yang pertama memasuki pintu Masjidil Haram pada keesokan harinya akan menjadi hakim. Orang itu ialah Muhammad SAW. Dengan gelaran al-Amin (yang dipercayai), baginda mencadangkan satu penyelesaian bijak: baginda menghamparkan kain, meletakkan batu itu di tengah, dan meminta setiap ketua kabilah memegang hujung kain tersebut. Mereka mengangkatnya bersama-sama dengan penuh harmoni, dan baginda sendiri meletakkannya di tempat asal. Ini memuaskan hati semua pihak dan mengelakkan peperangan saudara yang dahsyat di kalangan kabilah Arab.'
        : 'When the Kaaba was rebuilt after a flood, tribal leaders fought over the honor of placing the Black Stone. Muhammad PBUH was chosen as the arbitrator because he was the first to enter the sanctuary the next morning. He devised a brilliant solution: placing the stone on a large cloth and having each tribal leader hold a corner. Together, they lifted it to the correct height, and he performed the final placement. This act not only prevented a potential war but also established his reputation as Al-Amin (the Trustworthy) and a master diplomat who could unite conflicting parties through wisdom and respect.',
      lessons: language === 'ms'
        ? ['Kebijaksanaan (Fatonah) boleh menyelesaikan konflik besar tanpa kekerasan.', 'Integriti dan kepercayaan (Al-Amin) adalah modal sosial yang paling berharga.', 'Kerjasama dan muafakat membawa kepada keamanan.']
        : ['Wisdom can resolve major conflicts without violence.', 'Integrity and trust (Al-Amin) are the most valuable social capital.', 'Cooperation and consensus lead to peace.'],
      status: 'Completed'
    },
    {
      id: 3,
      title: language === 'ms' ? 'Wahyu Pertama di Gua Hira\'' : 'First Revelation at Cave Hira',
      year: '610 M',
      description: language === 'ms'
        ? 'Malaikat Jibril datang membawa wahyu pertama ketika baginda sedang bersendiri mencari kebenaran. "Iqra\'!"'
        : 'Angel Jibril brought the first revelation while the Prophet was meditating in Cave Hira. "Iqra!" (Read!).',
      fullStory: language === 'ms'
        ? 'Pada usia 40 tahun, sewaktu baginda sedang bertahannuth (bermeditasi) di Gua Hira\', Malaikat Jibril datang menemui baginda pada malam 17 Ramadan. Jibril memeluk baginda dengan kuat seraya berkata, "Iqra\'!" (Bacalah!). Nabi menjawab, "Ma ana biqarin" (Aku tidak tahu membaca). Perkara ini berulang sebanyak tiga kali sehingga Jibril membacakan lima ayat pertama Surah Al-Alaq. Baginda pulang dalam keadaan menggigil kelaparan dan ketakutan kepada Khadijah R.A. Khadijah kemudian membawa baginda menemui Waraqah bin Naufal, yang mengesahkan bahawa itu adalah Namus (malaikat) yang sama pernah turun kepada Nabi Musa A.S.'
        : 'At age 40, in Cave Hira, Angel Jibril appeared to Muhammad PBUH on the 17th of Ramadan. Jibril commanded him to read, and despite his illiteracy, he received the first five verses of Surah Al-Alaq. Trembling, he returned to his wife Khadijah, who comforted him. Her cousin, Waraqah bin Naufal, confirmed he was the prophet foretold in the scriptures of Moses.',
      lessons: language === 'ms'
        ? ['Ilmu adalah kunci kepada kebangkitan umat.', 'Kepentingan mencari kebenaran dan bermuhasabah.', 'Peranan isteri (Khadijah) dalam menyokong dakwah suami.']
        : ['Knowledge is the key to the ummah\'s revival.', 'The importance of seeking truth and reflection.', 'The role of a spouse (Khadijah) in supporting one\'s mission.'],
      status: 'Current'
    },
    {
      id: 4,
      title: language === 'ms' ? 'Isra\' & Mi\'raj: Perjalanan Agung' : 'Isra\' & Mi\'raj: The Divine Journey',
      year: '621 M',
      description: language === 'ms' 
        ? 'Selepas Tahun Kesedihan, Allah menghiburkan hati Nabi dengan perjalanan satu malam merentasi tujuh langit.' 
        : 'Following the Year of Sorrow, Allah comforted the Prophet with a night journey through seven heavens.',
      fullStory: language === 'ms'
        ? 'Isra\' Mi\'raj berlaku selepas kewafatan Siti Khadijah dan bapa saudara baginda Abu Talib. Ia adalah mukjizat besar di mana Nabi dibawa melintasi jarak ribuan kilometer dari Mekah ke Baitul Maqdis (Isra\') menunggang Buraq. Kemudian baginda diangkat ke langit (Mi\'raj) melalui tujuh tingkatan syurga, bertemu nabi-nabi terdahulu seperti Nabi Adam, Isa, Yahya, Yusuf, Idris, Harun, Musa, dan Ibrahim. Puncak perjalanan ini adalah di Sidratul Muntaha, di mana baginda menerima perintah solat lima waktu secara terus daripada Allah SWT. Perjalanan yang mengambil masa sekelip mata ini membuktikan kekuasaan mutlak Allah SWT.'
        : 'The Night Journey (Isra\') and Ascension (Mi\'raj) was a divine comfort for the Prophet after intense personal losses. He traveled from Makkah to Jerusalem on the Buraq, then ascended through the seven heavens. He met previous prophets and reached Sidratul Muntaha, where the command for the five daily prayers was established. This miraculous event remains a cornerstone of faith, illustrating the vastness of divine power.',
      lessons: language === 'ms'
        ? ['Solat adalah hadiah dan pertemuan rohani antara hamba dengan Pencipta.', 'Allah sentiasa memberikan kemudahan dan berita gembira selepas kesusahan.', 'Ketinggian kedudukan Nabi Muhammad SAW di sisi Allah.']
        : ['Prayer is a gift and a spiritual meeting between servant and Creator.', 'Allah always provides ease and good news after hardship.', 'The high status of Prophet Muhammad PBUH before Allah.'],
      status: 'Completed'
    },
    {
      id: 5,
      title: language === 'ms' ? 'Perang Badar: Kemenangan Al-Furqan' : 'Battle of Badr: The Day of Criterion',
      year: '624 M',
      description: language === 'ms'
        ? 'Pertempuran pertama yang menentukan antara umat Islam (313 orang) menentang musyrikin Mekah (1,000 orang).'
        : 'The first decisive battle between Muslims (313 men) and the Meccan polytheists (1,000 men).',
      fullStory: language === 'ms'
        ? 'Perang Badar berlaku pada 17 Ramadan tahun ke-2 Hijrah. Walaupun umat Islam hanya berjumlah 313 orang dengan kelengkapan yang sangat sedikit, mereka berdepan dengan 1,000 tentera musyrikin Mekah yang lengkap bersenjata. Nabi Muhammad SAW berdoa dengan sangat khusyuk memohon pertolongan Allah sehingga selendang baginda terjatuh. Allah kemudian menurunkan bantuan ribuan malaikat untuk membantu tentera Islam. Kemenangan luar biasa ini membuktikan bahawa kejayaan bukan terletak pada jumlah bilangan, tetapi pada kekuatan iman dan pertolongan Allah. Ramai pemimpin besar Quraisy termasuk Abu Jahl terkorban dalam perang ini.'
        : 'The Battle of Badr took place on the 17th of Ramadan, 2nd year of Hijrah. Despite being outnumbered 313 to 1,000, the Muslims achieved a miraculous victory. The Prophet PBUH prayed intensely for divine help, and Allah sent thousands of angels to assist. This victory established the Muslims as a formidable force in Arabia and showed that faith and divine support are more decisive than military numbers. Key leaders of the Quraysh, including Abu Jahl, were defeated, marking a turning point in Islamic history.',
      lessons: language === 'ms'
        ? ['Pertolongan Allah (Ma\'unah) datang kepada mereka yang benar-benar bertawakal.', 'Kekuatan iman lebih utama daripada kekuatan fizikal.', 'Kepentingan syura (bermesyuarat) dalam merancang strategi perang.']
        : ['Allah\'s help comes to those who truly trust Him.', 'Strength of faith is superior to physical strength.', 'The importance of consultation (Shura) in strategy.'],
      status: 'Completed'
    },
    {
      id: 6,
      title: language === 'ms' ? 'Perang Uhud: Ibrah Ketaatan' : 'Battle of Uhud: Lesson in Obedience',
      year: '625 M',
      description: language === 'ms'
        ? 'Ujian besar bagi umat Islam di mana baginda sendiri terdera akibat ketidakpatuhan terhadap arahan.'
        : 'A major trial for Muslims where the Prophet himself was injured due to disobedience to orders.',
      fullStory: language === 'ms'
        ? 'Perang Uhud berlaku pada tahun ke-3 Hijrah sebagai dendam Quraisy atas kekalahan di Badar. Nabi Muhammad SAW meletakkan 50 orang pemanah di atas Bukit Rumat dengan arahan tegas supaya jangan meninggalkan posisi walau apa pun yang terjadi. Namun, apabila melihat kemenangan awal, sebahagian besar pemanah turun untuk mengambil harta rampasan perang. Khalid bin Al-Walid (yang ketika itu belum Islam) mengambil peluang ini untuk menyerang dari belakang. Tentera Islam mengalami kerugian besar, ramai sahabat gugur syahid termasuk Hamzah bin Abdul Muttalib, dan Nabi sendiri mengalami kecederaan di muka dan gigi. Peristiwa ini menjadi pengajaran abadi tentang bahaya ketidakpatuhan kepada pemimpin demi kepentingan duniawi.'
        : 'Battle of Uhud (3rd Hijrah) was a Meccan counter-offensive. The Prophet positioned 50 archers on a hill with strict orders not to leave, regardless of the outcome. However, seeing an initial victory, most archers abandoned their posts for spoils of war. Khalid bin Al-Walid seized this opening and attacked from behind. The Muslims suffered heavy losses, including the martyrdom of Hamzah R.A, and the Prophet was wounded. This trial taught a permanent lesson regarding the consequences of prioritizing worldly gains over the commands of a leader.',
      lessons: language === 'ms'
        ? ['Ketaatan kepada arahan adalah kunci kepada kejayaan berpasukan.', 'Bahaya sifat tamak dan mementingkan duniawi.', 'Kekuatan mental dan sabar dalam menghadapi kekalahan sementara.']
        : ['Obedience to orders is the key to collective success.', 'The danger of greed and prioritizing worldly gains.', 'Resilience and patience in facing temporary setbacks.'],
      status: 'Completed'
    },
    {
      id: 7,
      title: language === 'ms' ? 'Perang Khandaq: Strategi & Mukjizat' : 'Battle of the Trench (Khandaq)',
      year: '627 M',
      description: language === 'ms'
        ? 'Kepungan besar oleh 10,000 tentera bersekutu yang dihadapi dengan strategi parit oleh Salman Al-Farisi.'
        : 'A massive siege by 10,000 allied forces countered with the innovative trench strategy by Salman Al-Farisi.',
      fullStory: language === 'ms'
        ? 'Dalam Perang Khandaq (Ahzab), tentera bersekutu (10,000 orang) mengepung Madinah dari pelbagai arah. Atas cadangan Salman Al-Farisi, umat Islam menggali parit besar di sekeliling Madinah sebagai benteng pertahanan — sebuah strategi yang belum pernah dilihat oleh bangsa Arab. Sepanjang penggalian, berlaku banyak mukjizat seperti makanan yang sedikit mencukupi untuk ramai orang. Kepungan ini berlangsung selama sebulan dalam keadaan cuaca sejuk dan bekalan makanan yang semakin berkurangan. Akhirnya, Allah menghantar angin kencang yang memusnahkan perkhemahan musuh, menyebabkan mereka lari ketakutan. Ini membuktikan bahawa kesabaran dan inovasi dalam dakwah akan membuahkan hasil dengan izin Allah.'
        : 'During the Battle of the Trench (5th Hijrah), 10,000 allied forces besieged Madinah. Following Salman Al-Farisi\'s suggestion, Muslims dug a massive trench around the city—a strategy unknown to Arabs at the time. Despite hunger and cold during the month-long siege, the Muslims remained firm. Miracles occurred, such as a small meal feeding hundreds. Eventually, Allah sent a violent wind that uprooted the enemy\'s tents and broke their resolve, leading to their retreat. This event highlighted the importance of innovation and strategic thinking in defense.',
      lessons: language === 'ms'
        ? ['Menerima idea yang baik walaupun ia datang dari budaya luar (inovasi).', 'Kekuatan perpaduan dalam menghadapi ancaman luar.', 'Keyakinan bahawa Allah adalah sebaik-baik pelindung.']
        : ['Accepting good ideas regardless of their origin (innovation).', 'The power of unity against external threats.', 'Conviction that Allah is the ultimate protector.'],
      status: 'Completed'
    },
    {
      id: 8,
      title: language === 'ms' ? 'Peristiwa Hijrah ke Madinah' : 'Hijrah to Madinah',
      year: '622 M',
      description: language === 'ms'
        ? 'Penghijrahan besar umat Islam dari Mekah ke Yathrib (Madinah) yang menjadi titik awal kalendar Islam.'
        : 'The great migration of Muslims from Makkah to Yathrib (Madinah), marking the start of the Islamic calendar.',
      fullStory: language === 'ms'
        ? 'Selepas 13 tahun berdakwah di Mekah dengan penuh cabaran dan penindasan, Allah memerintahkan Nabi Muhammad SAW dan para sahabat untuk berhijrah ke Yathrib. Perjalanan ini penuh dengan keberanian dan strategi, di mana Saidina Ali R.A sanggup tidur di tempat tidur Nabi untuk mengaburi mata musuh, dan Nabi bersama Saidina Abu Bakar R.A bersembunyi di Gua Thaur selama tiga hari. Setibanya di Madinah, baginda disambut dengan penuh kegembiraan oleh golongan Ansar. Di sinilah terbinanya Masjid Nabawi dan Piagam Madinah yang menyatukan masyarakat berbilang kaum dan agama di bawah satu sistem pemerintahan yang adil.'
        : 'After 13 years of oppression in Makkah, Muslims migrated to Yathrib. The journey involved immense courage, including Ali R.A taking the Prophet\'s place in bed to deceive assassins and the Prophet hiding in Cave Thaur with Abu Bakar R.A. In Madinah, they were welcomed by the Ansar. This migration saw the construction of Masjid Nabawi and the drafting of the Constitution of Madinah, creating a harmonious multi-faith society.',
      lessons: language === 'ms'
        ? ['Perancangan yang teliti mestilah diiringi dengan tawakkal kepada Allah.', 'Persaudaraan Islam (Ukhuwah) melangkaui batas warna kulit dan bangsa.', 'Kepentingan memiliki sahabat yang setia (seperti Abu Bakar).']
        : ['Meticulous planning must be accompanied by trust in Allah (Tawakkal).', 'Islamic brotherhood (Ukhuwah) transcends race and color.', 'The importance of having a loyal companion (like Abu Bakar).'],
      status: 'Completed'
    },
    {
      id: 9,
      title: language === 'ms' ? 'Fathu Makkah: Pembukaan Kota Suci' : 'Conquest of Makkah',
      year: '630 M',
      description: language === 'ms'
        ? 'Kemenangan besar tanpa pertumpahan darah di mana Nabi memaafkan seluruh penduduk Mekah.'
        : 'A major victory without bloodshed where the Prophet pardoned all residents of Makkah.',
      fullStory: language === 'ms'
        ? 'Peristiwa Pembukaan Kota Mekah berlaku pada tahun ke-8 Hijrah. Nabi Muhammad SAW mengetuai 10,000 tentera Islam bergerak menuju ke Mekah selepas pihak Quraisy melanggar Perjanjian Hudaibiyah. Baginda memasuki Mekah dengan penuh rasa tawaduk tanpa sebarang peperangan besar. Baginda kemudian membersihkan Kaabah daripada berhala-berhala sambil membacakan ayat Al-Quran: "Telah datang kebenaran, dan lenyaplah kebatilan". Sifat pemaaf Nabi yang luar biasa terserlah apabila baginda memaafkan musuh-musuh lama baginda yang pernah menyiksa umat Islam, termasuk Hindun dan Abu Sufyan. Baginda mengisytiharkan kemaafan umum: "Pergilah, kamu semua bebas." Kemuliaan akhlak ini menyebabkan ribuan orang memeluk Islam secara sukarela, mengakhiri era jahiliah di Mekah selama-lamanya.'
        : 'In the 8th year of Hijrah, the Prophet led 10,000 Muslims into Makkah after the Quraysh broke the Treaty of Hudaibiyah. He entered with humility, his head bowed, and captured the city without bloodshed. He then cleared 360 idols from the Kaaba. His extraordinary mercy shined when he pardoned his former enemies, including those who had persecuted him and killed his companions. He declared a general amnesty, saying, "Go, for you are free." This unparalleled act of forgiveness led to a massive voluntary conversion to Islam, transforming Makkah from a center of idol worship into the holiest sanctuary of Monotheism.',
      lessons: language === 'ms'
        ? ['Kemaafan adalah senjata yang lebih kuat daripada pedang.', 'Kemenangan sebenar adalah apabila kita menawan hati manusia dengan akhlak.', 'Sentiasa tawaduk (rendah diri) walaupun berada di puncak kejayaan.']
        : ['Forgiveness is a stronger weapon than the sword.', 'True victory is winning hearts with character (Akhlak).', 'Always remain humble (Tawaduk) even at the height of success.'],
      status: 'Current'
    },
    {
      id: 10,
      title: language === 'ms' ? 'Haji Wada\': Pesanan Terakhir' : 'Haji Wada\': The Farewell Pilgrimage',
      year: '632 M',
      description: language === 'ms'
        ? 'Haji terakhir baginda di mana baginda menyampaikan khutbah yang merangkumi seluruh prinsip Islam.'
        : 'The final pilgrimage where the Prophet delivered a sermon encompassing all Islamic principles.',
      fullStory: language === 'ms'
        ? 'Pada tahun ke-10 Hijrah, Nabi Muhammad SAW menunaikan haji yang pertama dan terakhir baginda, dikenali sebagai Haji Wada\'. Di Padang Arafah, baginda menyampaikan khutbah yang sangat menyentuh hati di hadapan lebih 100,000 umat Islam. Baginda menekankan tentang persamaan hak manusia, mengharamkan riba, menuntut penghormatan terhadap hak wanita, dan mewasiatkan agar umat Islam berpegang teguh kepada Al-Quran dan Sunnah. Khutbah ini adalah manifesto hak asasi manusia yang pertama dan menjadi panduan abadi umat Islam. Tidak lama selepas itu, turunlah ayat terakhir Al-Quran (Surah Al-Maidah: 3) yang menyatakan bahawa agama Islam telah disempurnakan.'
        : 'In the 10th year of Hijrah, the Prophet performed his final pilgrimage, Haji Wada\'. At Mount Arafat, he delivered a poignant sermon to over 100,000 Muslims. He stressed the equality of all humans, abolished interest (riba), demanded respect for women\'s rights, and urged Muslims to hold fast to the Quran and Sunnah. This sermon serves as a timeless manifesto of human rights and ethical conduct. Shortly after, the final revelation (Surah Al-Maidah: 3) was received, declaring the perfection and completion of the Islamic religion.',
      lessons: language === 'ms'
        ? ['Islam memartabatkan hak asasi manusia dan keadilan sosial.', 'Tanggungjawab setiap Muslim untuk menyampaikan dakwah walaupun satu ayat.', 'Kepentingan menjaga hubungan sesama manusia (Hablun minannas).']
        : ['Islam upholds human rights and social justice.', 'Every Muslim\'s responsibility to convey the message even if just one verse.', 'The importance of maintaining human relations.'],
      status: 'Completed'
    },
    {
      id: 11,
      title: language === 'ms' ? 'Wafatnya Kekasih Allah' : 'The Passing of the Beloved',
      year: '632 M',
      description: language === 'ms'
        ? 'Saat paling sedih dalam sejarah Islam apabila Rasulullah SAW pulang menemui Pencipta.'
        : 'The saddest moment in Islamic history as the Prophet PBUH returned to his Creator.',
      fullStory: language === 'ms'
        ? 'Pada hari Isnin, 12 Rabiulawal tahun ke-11 Hijrah, Nabi Muhammad SAW wafat di pangkuan Aisyah R.A di Madinah pada usia 63 tahun. Berita kewafatan baginda menyebabkan seluruh sahabat tergamam dan sedih yang amat mendalam. Saidina Abu Bakar R.A menenangkan umat Islam dengan kata-kata masyhur: "Sesiapa yang menyembah Muhammad, ketahuilah Muhammad telah wafat. Sesiapa yang menyembah Allah, Allah hidup dan tidak akan mati." Baginda tidak meninggalkan harta melainkan sebilah pedang, seekor keldai, dan sebidang tanah yang diwakafkan. Baginda meninggalkan warisan yang mengubah tamadun dunia — cahaya iman yang terus menerangi hati jutaan manusia sehingga hari ini.'
        : 'On Monday, 12th Rabiulawwal in the 11th year of Hijrah, the Prophet PBUH passed away in the arms of Aisha R.A in Madinah at the age of 63. His death caused profound grief throughout the Muslim world. Abu Bakr R.A consoled the masses with the famous words: "He who worshipped Muhammad, let him know that Muhammad is dead. But he who worships Allah, let him know that Allah is alive and never dies." The Prophet left no material wealth, only a sword, a mule, and land bequeathed to charity. He left behind a legacy that transformed world history — the light of faith that continues to guide billions toward righteousness.',
      lessons: language === 'ms'
        ? ['Setiap yang bernyawa pasti akan menemui kematian.', 'Kematian adalah permulaan kepada kehidupan yang abadi.', 'Wajib mencintai Rasulullah SAW lebih daripada diri sendiri.']
        : ['Every soul shall taste death.', 'Death is the beginning of eternal life.', 'Loving the Prophet PBUH more than oneself is mandatory.'],
      status: 'Completed'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-20 px-4"
    >
      <header className="relative py-12 text-center overflow-hidden rounded-[3rem] bg-amber-50 border border-amber-100">
        <div className="relative z-10 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-200/50 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-widest">
              <History size={14} />
              {t('sirah.timeline')}
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-amber-950 uppercase tracking-tighter">{t('sirah.title')}</h2>
           <p className="text-sm font-medium text-amber-800/60 max-w-xl mx-auto uppercase tracking-wide">
              {t('sirah.subtitle')}
           </p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabic-bazillion.png')]"></div>
      </header>

      <div className="grid grid-cols-1 gap-12 relative">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-amber-200/30 hidden md:block"></div>

        {sirahEpochs.map((epoch, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="hidden md:flex absolute left-8 -translate-x-1/2 w-10 h-10 bg-amber-500 border-4 border-white rounded-full items-center justify-center shadow-lg shadow-amber-500/20 z-10">
               <span className="text-[10px] font-black text-white">{i + 1}</span>
            </div>

            <div className="md:ml-20 flex-1 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-900/5 transition-all group overflow-hidden relative">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">{epoch.year}</span>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight group-hover:text-amber-700 transition-colors">{epoch.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-amber-100 hover:text-amber-700 transition-all"><Bookmark size={18} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-amber-100 hover:text-amber-700 transition-all"><Share2 size={18} /></button>
                  </div>
               </div>

               <p className="text-slate-500 font-medium leading-relaxed mb-8">
                 {epoch.description}
               </p>

               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                      <UserCircle size={16} className="text-amber-600" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t('sirah.author').replace('{name}', 'Ustaz Fadhil')}</span>
                  </div>
                  <button 
                    onClick={() => setExpandedId(expandedId === epoch.id ? null : epoch.id)}
                    className="flex items-center gap-2 py-3 px-6 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all"
                  >
                     {expandedId === epoch.id ? 'Tutup' : t('sirah.read_more')} <ChevronRight size={14} className={cn("transition-transform", expandedId === epoch.id && "rotate-90")} />
                  </button>
               </div>

               <AnimatePresence>
                 {expandedId === epoch.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-slate-50 overflow-hidden space-y-6"
                    >
                      <div className="bg-amber-50/50 p-8 rounded-[2rem] border border-amber-100/50 space-y-6">
                         <div className="space-y-4">
                            <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                               <Sparkles size={14} className="text-amber-500" />
                               {language === 'ms' ? 'Kisah Lengkap' : 'Full Story'}
                            </h4>
                            <p className="text-slate-700 leading-relaxed font-serif text-lg italic">
                              {epoch.fullStory}
                            </p>
                         </div>

                         {epoch.lessons && (
                           <div className="pt-6 border-t border-amber-100/50 space-y-4">
                              <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                                 <GraduationCap size={14} className="text-amber-500" />
                                 {language === 'ms' ? 'Pengajaran & Ibrah' : 'Moral Lessons'}
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                 {epoch.lessons.map((lesson, idx) => (
                                   <li key={idx} className="flex gap-3 text-xs font-bold text-amber-800/80 bg-white/50 p-4 rounded-xl border border-amber-100/30">
                                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0"></div>
                                      {lesson}
                                   </li>
                                 ))}
                              </ul>
                           </div>
                         )}
                      </div>
                    </motion.div>
                 )}
               </AnimatePresence>

               <div className="absolute right-0 bottom-0 w-32 h-32 bg-amber-500/5 rotate-45 translate-x-12 translate-y-12 rounded-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all"></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-12 text-center bg-slate-900 text-white rounded-[3rem] shadow-2xl space-y-4">
         <h4 className="text-xl font-black uppercase">{t('sirah.footer_title')}</h4>
         <p className="opacity-60 text-sm max-w-md mx-auto">{t('sirah.footer_desc')}</p>
         <button className="mt-4 px-8 py-3 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
            {t('sirah.notify_btn')}
         </button>
      </div>
    </motion.div>
  );
}

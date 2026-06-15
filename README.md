Saya akan tulis **README.md** yang lengkap dan profesional untuk repository NIYYAH anda.

---

## 📄 README.md

```markdown
# 🕌 NIYYAH – Ummah Enlightened

**NIYYAH** is a comprehensive Islamic super application designed specifically for **Malaysian Muslims** — with special focus on **muallaf (new Muslims)** and **the elderly (warga emas)**.

Built with ❤️ for Mama, Aboh, and all new Muslims who need guidance.

---

## ✨ Features

### 🕌 Pray
| Feature | Description |
|---------|-------------|
| **Prayer Times** | Official JAKIM prayer times for all zones in Malaysia |
| **Live Countdown** | Real-time countdown to next prayer |
| **Qibla Direction** | Compass + GPS to find direction of Kaabah |
| **Ibadah Tracker** | Daily prayer checklist, fasting tracker |
| **Zakat Calculator** | Fitrah, income, savings, gold zakat |
| **Ramadan Guide** | Imsakiah schedule, tarawih guide, preparation toolkit |

### 📖 Learn
| Feature | Description |
|---------|-------------|
| **Al-Quran** | Arabic + Rumi + Malay + English translation. Audio by Sheikh Alafasy |
| **Iqra Digital** | Complete levels 1-6 with makhraj tips |
| **Muqaddam** | Basic Quran reading guide |
| **Doa & Zikir** | 20+ daily doa with audio, zikir pagi petang |
| **99 Names of Allah** | Asmaul Husna with meanings and audio |
| **Hadith** | Authentic hadith from Bukhari, Muslim, etc. with grading (Sahih/Hasan) |
| **Seerah** | Stories of Prophet Muhammad SAW |

### 👥 Ummah
| Feature | Description |
|---------|-------------|
| **Online Classes** | Create or join classes (religion, school, skills, hobbies) |
| **Community** | Find nearby Muslims for jemaah, local charity |
| **Muallaf Hub** | Step-by-step guides, mentor system, private community |
| **Find Ustaz** | Directory of verified religious teachers in Malaysia |

### 💰 Wealth
| Feature | Description |
|---------|-------------|
| **Zakat Calculator** | Easy calculation for all types of zakat |
| **Islamic Financial Planner** | Halal budget, debt tracker, hajj/umrah savings |
| **Donation** | Support NIYYAH development |

### ⚙️ More
| Feature | Description |
|---------|-------------|
| **Settings** | Font size (for elderly), dark mode, notifications, language |
| **Global Search** | Search all content (Quran, hadith, doa, classes) |

---

## 🎯 Target Users

| User Group | Special Features |
|------------|------------------|
| **👴🏻 Elderly (Mama & Aboh)** | Large adjustable fonts, big buttons, bookmarks, repeat audio 3x |
| **🕌 Muallaf (New Muslims)** | Step-by-step guides (8 modules), mentor system, private community, anonymous Q&A |
| **👨‍👩‍👧 Parents** | Islamic parenting guide, age-based learning for children |
| **👩‍🏫 Teachers / Ustaz** | Create online classes, mentor muallaf |
| **🧕 All Muslims** | All Islamic features in ONE app |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React / Next.js |
| **Styling** | TailwindCSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Hosting** | Vercel / Netlify |

### APIs Used
| API | Purpose |
|-----|---------|
| JAKIM (waktusolat.app) | Official Malaysian prayer times |
| AlQuran Cloud API | Quran text, translation, audio |
| Hadeeth Encyclopedia API | Authentic hadith with Malay translation |
| Google Places API | Halal food finder |

---

## 📱 Screenshots

*(Coming soon)*

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/niyyah.git

# 2. Navigate to project folder
cd niyyah

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 5. Run development server
npm run dev

# 6. Open http://localhost:3000
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
niyyah/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (Home, Learn, Pray, Ummah, More)
│   ├── services/       # API services (solat, quran, hadis, etc.)
│   ├── utils/          # Helper functions
│   └── styles/         # Global styles
├── public/             # Static assets
├── supabase/           # Database migrations
├── .env.local          # Environment variables (gitignored)
└── package.json        # Dependencies
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'moderator', 'admin'
  is_muallaf BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Prayer tracker table
CREATE TABLE prayer_tracker (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  subuh BOOLEAN DEFAULT FALSE,
  zohor BOOLEAN DEFAULT FALSE,
  asar BOOLEAN DEFAULT FALSE,
  maghrib BOOLEAN DEFAULT FALSE,
  isyak BOOLEAN DEFAULT FALSE
);

-- Online classes table
CREATE TABLE online_classes (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  meeting_link TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` file for more information.

---

## 👨‍💻 Developer

**Muhammad Irfan Rizal**

| Contact | Info |
|---------|------|
| 📧 Email | irfanizzani46@gmail.com |
| 💼 LinkedIn | [Muhammad Irfan Rizal](https://www.linkedin.com/in/irfanrizal2004) |
| 🌐 Portfolio | [irfanrizalv2.netlify.app](https://irfanrizalv2.netlify.app) |

---

## 🙏 Acknowledgements

| Source | For |
|--------|-----|
| **JAKIM Malaysia** | Official prayer times data |
| **AlQuran Cloud API** | Quran text, translation, and audio |
| **Hadeeth Encyclopedia API** | Authentic hadith with Malay translation |
| **Supabase** | Database & authentication |
| **Vercel / Netlify** | App hosting |
| **All NIYYAH users** | Support, feedback, and duas |

---

## 💌 Developer's Doa

> *"Ya Allah, jadikan aplikasi NIYYAH ini sebagai saham akhirat untuk saya, untuk mama dan aboh saya, dan untuk semua yang menggunakannya. Jika ada kesilapan dalam content agama, ampunkanlah saya. Jika ada yang terbimbing kerana apps ini, hitunglah pahala untuk mereka yang terlibat. Aamiin Ya Rabbal 'Alamin."*

---

**⭐ If you find NIYYAH helpful, please give a star on GitHub!**

---

© 2025 Muhammad Irfan Rizal | NIYYAH – Ummah Enlightened
```

---

## 📋 CARA BUAT FILE README.md

### Option 1: Terus dalam GitHub (lepas create repository)

1. Lepas create repository, GitHub akan tunjuk halaman kosong
2. Klik **"Add a README"** atau **"Create README.md"**
3. Copy semua teks di atas dan paste
4. Klik **"Commit changes"**

### Option 2: Buat dalam komputer anda (sebelum push)

```bash
# Dalam folder projek NIYYAH
touch README.md

# Buka README.md dengan text editor
# Copy dan paste semua teks di atas

# Kemudian add, commit, push
git add README.md
git commit -m "Add README.md"
git push
```

---

## ✅ CHECKLIST README

| Item | Status |
|------|--------|
| Project title & description | ✅ Ada |
| Features (with table) | ✅ Ada |
| Target users | ✅ Ada |
| Tech stack | ✅ Ada |
| Installation steps | ✅ Ada |
| Environment variables | ✅ Ada |
| Project structure | ✅ Ada |
| Database schema | ✅ Ada |
| Contributing guide | ✅ Ada |
| License | ✅ Ada |
| Developer info | ✅ Ada |
| Acknowledgements | ✅ Ada |
| Developer's doa | ✅ Ada |

---


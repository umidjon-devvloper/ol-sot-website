# 🌐 Marketplace Website (Next.js 15)

Telefon va aksessuarlar marketplace'ining web versiyasi.
**Next.js 15 + React 19 + TypeScript + Tailwind CSS**.

## ✨ Xususiyatlar

- ⚡ **SEO optimallashtirilgan** — Server Components, metadata, OpenGraph
- 🎨 **Professional dizayn** — Dark/Light mode, smooth animations, gradient orbs
- 🌍 **3 til** — O'zbek, Rus, Ingliz
- 📱 **To'liq responsive** — Mobile-first dizayn
- 🔐 **Auth** — Telefon + parol (JWT, cookie'da)
- 🏠 **Home** — Hero, kategoriyalar, featured, new arrivals, AI banner
- 🔍 **Search** — Filterlar (kategoriya, narx), sortirovka, paginatsiya
- 📦 **Product detail** — Image gallery, specs jadvali, similar products
- ❤️ **Favorites** — Sevimli mahsulotlarni saqlash
- 🤖 **AI Chat** — GPT bilan mahsulot tavsiyalari
- 👤 **Profile** — Til, mavzu, ism o'zgartirish
- 🚀 **ISR** — Incremental Static Regeneration (tezkor yuklanish)
- 🖼️ **Image Optimization** — Next/Image avtomatik

## 🛠 Texnologiyalar

| Texnologiya | Versiya |
|-------------|---------|
| Next.js | 15.0+ |
| React | 19.0+ |
| TypeScript | 5.6+ |
| Tailwind CSS | 3.4+ |
| TanStack Query | 5.59+ |
| Zustand | 5.0+ |
| Lucide Icons | 0.468+ |
| Framer Motion | 11.11+ |
| i18next | 24.0+ |
| Axios | 1.7+ |

## 📋 Talablar

- **Node.js >= 20.0**
- **npm >= 10** yoki **yarn 1.22+**
- **Backend ishlab turishi kerak** (port 5000)

## 🚀 O'rnatish

### 1. Paketlarni o'rnatish

```bash
cd website
npm install
```

### 2. Environment sozlash

```bash
cp .env.example .env
```

`.env` faylni tahrirlang:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Marketplace
```

### 3. Development server

```bash
npm run dev
```

Sayt `http://localhost:3000`'da ishga tushadi.

### 4. Production build

```bash
npm run build
npm start
```

## 📁 Loyiha strukturasi

```
website/
├── src/
│   ├── app/                          # App Router (Next.js 15)
│   │   ├── layout.tsx                # Root layout (Providers, Header, Footer)
│   │   ├── page.tsx                  # Home (Server Component + ISR)
│   │   ├── globals.css               # Tailwind + custom CSS
│   │   ├── not-found.tsx             # 404 page
│   │   ├── login/page.tsx            # Login
│   │   ├── register/page.tsx         # Registration
│   │   ├── search/page.tsx           # Search + filters (Server)
│   │   ├── product/[id]/page.tsx     # Product detail (with metadata)
│   │   ├── category/[id]/page.tsx    # Category (redirects to search)
│   │   ├── favorites/page.tsx        # Favorites (auth required)
│   │   ├── profile/page.tsx          # Profile settings (auth required)
│   │   └── ai/page.tsx               # AI chat
│   ├── components/
│   │   ├── HomeContent.tsx           # Home client component
│   │   ├── ProductDetail.tsx         # Product detail client
│   │   ├── SearchContent.tsx         # Search client
│   │   ├── Providers.tsx             # QueryClient + Toaster
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Sticky nav, search, profile
│   │   │   └── Footer.tsx
│   │   ├── product/
│   │   │   └── ProductCard.tsx       # Product card with favorite
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── index.tsx             # Skeleton, EmptyState, Badge
│   ├── services/
│   │   ├── api.ts                    # Client-side axios
│   │   ├── apiServer.ts              # Server-side fetch (RSC)
│   │   └── marketplaceApi.ts         # Auth, products, favorites, AI
│   ├── store/
│   │   ├── authStore.ts              # Zustand auth (cookie JWT)
│   │   └── uiStore.ts                # Theme + language
│   ├── hooks/
│   │   └── useT.ts                   # Translation hook
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   ├── locales/
│   │   ├── uz.ts
│   │   ├── ru.ts
│   │   └── en.ts
│   ├── utils/
│   │   └── format.ts                 # formatPrice, getML helpers
│   └── lib/
│       ├── cn.ts                     # Tailwind class merger
│       └── config.ts
├── public/                            # Static assets
├── next.config.mjs                   # Next.js config (image domains)
├── tailwind.config.js                # Brand colors, animations
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

## 🎨 Dizayn tizimi

### Ranglar
- **Brand**: `#FF6B35` (orange) — asosiy CTA, logo
- **Light**: `#FFFFFF` background, `#0A0A0F` text
- **Dark**: `#0A0A0F` background, `#FAFAFA` text
- **Surface**: `#13131A` (dark cards), `#F4F4F5` (light cards)

### Animatsiyalar
- `animate-fade-in` — opacity 0→1
- `animate-slide-up` — translateY(20px)→0
- `animate-scale-in` — scale 0.95→1
- `skeleton` — shimmer loading

### Komponentlar
- `card` — bg + border + rounded-2xl
- `btn-primary` — orange button
- `btn-secondary` — neutral button
- `input` — form input
- `container-page` — max-width container

## 🔌 Backend bilan integratsiya

Backend `http://localhost:5000` da ishlashi kerak. API endpoints:

- `GET /api/products` — mahsulotlar (filter, sort, pagination)
- `GET /api/products/:id` — bitta mahsulot
- `GET /api/categories` — kategoriyalar
- `POST /api/auth/login` — kirish
- `POST /api/auth/register` — ro'yxatdan o'tish
- `GET /api/auth/me` — joriy user
- `POST /api/favorites/:productId` — favorite toggle
- `POST /api/ai/ask` — AI chat

Backend CORS sozlamalarida `http://localhost:3000` ruxsat etilishi kerak.

## 🚀 Deploy

### Vercel (eng oson)

```bash
npm install -g vercel
vercel
```

Vercel'da environment variables qo'shing:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`

### Boshqa platformalar

```bash
npm run build
npm start
```

Yoki Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Tez-tez uchraydigan muammolar

### 1. "fetch failed" yoki API ishlamayapti

- Backend ishlayotganini tekshiring (`http://localhost:5000`)
- `.env` faylda `NEXT_PUBLIC_API_URL` to'g'ri yoki yo'qligini tekshiring
- Backend CORS sozlamasida website URL'i bormi tekshiring

### 2. Image yuklanmayapti

`next.config.mjs`'da rasm domeni qo'shilgan bo'lishi kerak:

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'sizning-cdn.com' }
  ]
}
```

### 3. "Module not found" xatolari

```bash
rm -rf node_modules package-lock.json .next
npm install
```

### 4. Hydration error

Server va client'da farq bo'lganda paydo bo'ladi. `'use client'` directive'ini to'g'ri qo'yganingizni tekshiring.

### 5. Cookie ishlamayapti

JWT token cookie'da saqlanadi. Browser'da:
- DevTools → Application → Cookies'ni tekshiring
- HTTPS production'da `secure: true` qo'shiladi

## 🎯 SEO Optimization

Loyiha quyidagilarni qo'llab-quvvatlaydi:

✅ **Server Components** — sahifalar server'da render qilinadi
✅ **Metadata API** — har bir sahifa uchun title, description, OG tags
✅ **generateMetadata** — dynamic metadata (mahsulot sahifalari)
✅ **Image Optimization** — Next/Image bilan
✅ **ISR (Incremental Static Regeneration)** — har 60s da yangilanadi
✅ **Semantic HTML** — to'g'ri tag ishlatilgan
✅ **Mobile responsive** — Google'da yaxshi reyting

## 📝 Litsenziya

Private

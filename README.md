# Taklifnoma

O'zbekiston uchun onlayn to'y taklifnomalari platformasi. To'y egasi shablon
tanlaydi, ma'lumotlarini kiritadi va unikal havola oladi (`/i/[slug]`);
mehmonlar shu havola yoki QR kod orqali taklifnomani ko'rib, "Boraman /
Bormayman" javobini beradi.

Hozircha barcha taklifnomalar **bepul va avtomatik faol** — to'lov
integratsiyasi qo'shilmagan.

## Imkoniyatlar

**To'y egasi uchun**
- Google yoki Telegram orqali kirish
- 5 bosqichli yaratish formasi: ismlar → tadbir → suratlar → musiqa → ko'rib chiqish
- RSVP statistikasi: kim javob berdi, necha kishi keladi, mehmonlar jadvali
  (kelin/kuyov tomoni, javob holati bo'yicha filtr, ism bo'yicha qidiruv)
- Sozlamalar: tahrirlash, tadbir qo'shish/o'chirish, surat va musiqa almashtirish,
  taklifnomani o'chirish
- QR kod (PNG) va chop etish uchun PDF (taklifnoma dizayni + QR bir varaqda)
- Havolani Telegram/WhatsApp orqali ulashish

**Mehmon uchun**
- Animatsiyali taklifnoma sahifasi: tadbirgacha countdown, foto galereya,
  fon musiqasi, xarita
- RSVP formasi va tilaklar bo'limi
- Telegram bot orqali ham javob berish (`t.me/<bot>?start=<slug>`)

**Platforma egasi uchun (admin)**
- Umumiy statistika va grafiklar (30 kunlik tendensiya, tadbir turlari)
- Foydalanuvchilar, taklifnomalar, shablonlar boshqaruvi

## Stack

| Qism | Texnologiya |
|---|---|
| Frontend + backend | Next.js 14 (App Router, TypeScript), Tailwind CSS |
| Ma'lumotlar bazasi | PostgreSQL + Prisma 7 (`prisma-client` generatori, `@prisma/adapter-pg`) |
| Auth | NextAuth v4 — Google OAuth + Telegram Login Widget |
| Fayl saqlash | Cloudflare R2 (S3-compatible) yoki lokal papka |
| Telegram bot | grammY (webhook) |
| Grafiklar | Recharts |
| QR va PDF | `qrcode`, `@react-pdf/renderer` |
| Animatsiya | Framer Motion |

## Ishga tushirish

```bash
npm install
cp .env.example .env        # kamida DATABASE_URL va NEXTAUTH_SECRET
npx prisma migrate deploy   # jadvallarni yaratadi
npm run db:seed             # shablonlar katalogini bazaga yozadi
npm run db:demo             # namuna taklifnoma (ixtiyoriy)
npm run dev                 # http://localhost:3000
```

`npm run db:demo` — kirishsiz ham to'ldirilgan taklifnomani ko'rish uchun:
suratlar, ikkita tadbir, mehmon javoblari va tilaklar bilan namuna yaratadi.
So'ng <http://localhost:3000/i/namuna> ni oching. Buyruqni qayta ishga
tushirsa, namuna yangilanadi.

### Kirish usullari

Asosiysi — **email va parol**: `/register` da hisob yaratiladi, `/login` da
kiriladi. Parol bcrypt bilan hashlanadi (`bcryptjs`, 12 raund).
Google va Telegram kalitlari qo'shilsa, ular ham login sahifasida paydo bo'ladi.

### Kalitlarsiz kirish (faqat lokal)

Google/Telegram kalitlari hali yo'q bo'lsa, `.env` ga qo'shing:

```
ALLOW_DEV_LOGIN="true"
```

`npm run dev` da `/login` sahifasida "Lokal test kirishi" formasi paydo bo'ladi —
ism yozib (xohlasangiz "Admin huquqi bilan" belgilab) kirasiz va dashboard,
sozlamalar hamda admin panelni ko'rasiz. Bu forma **production build'da umuman
qo'shilmaydi** (`NODE_ENV=production` bo'lsa provider ro'yxatga kirmaydi).

Birinchi adminni belgilash (bir marta, kirgandan keyin):

```sql
update users set role = 'ADMIN' where email = 'siz@example.com';
```

### Muhit o'zgaruvchilari

| O'zgaruvchi | Kerakmi | Vazifasi |
|---|---|---|
| `DATABASE_URL` | ha | PostgreSQL ulanishi |
| `NEXTAUTH_SECRET` | ha | Sessiya imzosi (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ha (prod) | Saytning to'liq manzili |
| `APP_URL` | tavsiya | Server tomonda havola quriladi (QR, PDF, bot) |
| `NEXT_PUBLIC_APP_URL` | tavsiya | Brauzer kodidagi havola (build vaqtida joylashadi) |
| `ALLOW_DEV_LOGIN` | yo'q | Faqat lokal: kalitlarsiz kirish formasi |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | yo'q | Bo'lmasa Google tugmasi ko'rinmaydi |
| `TELEGRAM_BOT_TOKEN` | yo'q | Telegram login, bot va eslatmalar uchun |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | yo'q | Login widget uchun bot nomi |
| `TELEGRAM_WEBHOOK_SECRET` | tavsiya | Webhook'ni himoyalaydi |
| `CRON_SECRET` | tavsiya | Eslatma cron endpointini himoyalaydi |
| `R2_*` | yo'q | Bo'lmasa fayllar lokal papkaga tushadi |
| `SHADOW_DATABASE_URL` | faqat dev | Migration yaratish uchun bo'sh baza |

### Skriptlar

| Skript | Vazifasi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build va ishga tushirish |
| `npm run typecheck` / `npm run lint` | TypeScript va ESLint tekshiruvi |
| `npm run db:migrate` | Migration yaratish/qo'llash (interaktiv) |
| `npm run db:seed` | Shablonlarni seed qilish |
| `npm run db:demo` | Namuna taklifnoma yaratish (`/i/namuna`) |
| `npm run db:studio` | Prisma Studio |
| `./scripts/create-migration.sh <nom>` | Interaktiv bo'lmagan muhitda migration yaratish |

Uchidan-uchiga tekshiruv uchun `e2e/README.md` ga qarang.

## Route tuzilishi

| Route | Kim uchun | Tavsif |
|---|---|---|
| `/` | hamma | Asosiy sahifa |
| `/templates` | hamma | Shablonlar katalogi (bazadan) |
| `/templates/[templateId]/preview` | hamma | Shablonni namuna ma'lumot bilan ko'rish |
| `/login` | hamma | Google / Telegram orqali kirish |
| `/create/[templateId]` | kirgan | Bosqichma-bosqich yaratish formasi |
| `/my-invitations` | kirgan | Taklifnomalar kartochkalari |
| `/dashboard/[invitationId]` | egasi | RSVP statistikasi, mehmonlar, QR/PDF |
| `/dashboard/[invitationId]/settings` | egasi | Tahrirlash va o'chirish |
| `/admin`, `/admin/users`, `/admin/invitations`, `/admin/templates` | admin | Platforma boshqaruvi |
| `/i/[slug]` | mehmon | Taklifnoma sahifasi |
| `/i/[slug]/rsvp` | mehmon | "Boraman / Bormayman" formasi |

API: `/api/auth/*` (NextAuth), `/api/upload`, `/api/files/*`,
`/api/invitations/[id]/qr`, `/api/invitations/[id]/pdf`,
`/api/telegram/webhook`, `/api/cron/reminders`.

## Papkalar

```
prisma/schema.prisma          # DB modellari
prisma/migrations/            # Migration tarixi
prisma/seed.ts                # Shablonlar seed'i
src/app/(site)/               # Header/footer bilan sahifalar
src/app/i/[slug]/             # Mehmon sahifasi (layoutsiz)
src/app/api/                  # API route'lar
src/app/actions/              # Server action'lar
src/components/templates/     # Shablon komponentlari + registry
src/components/invitation/    # Galereya, countdown, musiqa, xarita, tilaklar
src/lib/                      # prisma, auth, storage, slug, qr, telegram-bot
e2e/                          # Uchidan-uchiga tekshiruv skripti
```

## Yangi shablon qo'shish

1. `src/components/templates/` ichida komponent yozing (`TemplateProps` qabul qiladi).
2. `src/components/templates/index.ts` dagi `TEMPLATE_COMPONENTS` ga
   `code -> komponent` qatorini qo'shing.
3. `src/data/templates.ts` ga meta ma'lumot qo'shing.
4. Admin panelda (`/admin/templates`) shu kod bilan shablon yarating —
   yoki `npm run db:seed` ni ishga tushiring.

## Telegram bot

1. [@BotFather](https://t.me/BotFather) da bot yarating, tokenni
   `TELEGRAM_BOT_TOKEN` ga yozing.
2. Login widget uchun BotFather'da `/setdomain` bilan domenni bog'lang va
   bot nomini `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` ga yozing.
3. Webhook'ni ulang:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domen>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

Bot buyruqlari: `/start <slug>` (mehmon RSVP), `/yaratish`, `/mening`, `/bekor`.

## Deploy (Vercel + Neon/Railway)

1. Postgres yarating (Neon yoki Railway), `DATABASE_URL` ni oling.
2. Vercel'ga import qiling va muhit o'zgaruvchilarini kiriting
   (yuqoridagi jadval). `NEXT_PUBLIC_*` build vaqtida kerak.
3. Migration'larni qo'llang: `npx prisma migrate deploy` (lokal terminalda
   production `DATABASE_URL` bilan yoki deploy hook orqali).
4. `npm run db:seed` bilan shablonlarni yozing.
5. **Fayl saqlash uchun R2 sozlang** — Vercel'da fayl tizimi read-only,
   lokal rejim u yerda ishlamaydi.
6. Eslatma croni `vercel.json` da (har kuni 09:00 UTC) — `CRON_SECRET` ni
   qo'shishni unutmang.

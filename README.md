# Taklifnoma

O'zbekiston uchun onlayn to'y taklifnomalari platformasi. Foydalanuvchi shablon
tanlaydi, ma'lumotlarini kiritadi va unikal havola oladi
(`/i/[slug]`), mehmonlar esa shu havola orqali javob (RSVP) beradi.

## Stack

- **Next.js 14** (App Router, TypeScript) + Tailwind CSS
- **PostgreSQL + Prisma 7** (`prisma-client` generatori, `@prisma/adapter-pg`)
- **nanoid** — unikal slug generatsiyasi

Keyingi bosqichlarda: NextAuth (Telegram login), Cloudflare R2 (foto/musiqa),
Payme/Click to'lovlari, Telegram bot (grammY), QR kod va PDF chop etish.

## Ishga tushirish

```bash
npm install
cp .env.example .env       # DATABASE_URL ni to'ldiring
npx prisma migrate dev     # jadvallarni yaratadi
npm run db:seed            # shablonlar katalogini bazaga yozadi
npm run dev                # http://localhost:3000
```

### Foydali skriptlar

| Skript | Vazifasi |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript tekshiruvi |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Yangi migration yaratish/qo'llash |
| `npm run db:push` | Schema'ni bazaga majburan yozish |
| `npm run db:seed` | Shablonlarni seed qilish |
| `npm run db:studio` | Prisma Studio |

## Route tuzilishi

| Route | Tavsif |
|---|---|
| `/` | Asosiy sahifa |
| `/templates` | Shablonlar katalogi |
| `/templates/[templateId]/preview` | Shablonni namuna ma'lumot bilan ko'rish |
| `/create/[templateId]` | Taklifnoma yaratish formasi |
| `/my-invitations` | Foydalanuvchining taklifnomalari |
| `/dashboard/[invitationId]` | RSVP statistikasi, mehmonlar ro'yxati, havola |
| `/i/[slug]` | Mehmon ko'radigan taklifnoma (public) |
| `/i/[slug]/rsvp` | "Boraman / Bormayman" formasi |

## Papkalar

```
prisma/schema.prisma          # DB modellari (User, Invitation, Event, Photo,
                              # Guest, Template, Payment)
prisma/seed.ts                # Shablonlar seed'i
src/app/                      # Route'lar (App Router)
src/app/actions/              # Server action'lar (yaratish, RSVP)
src/components/templates/     # Shablon komponentlari + registry
src/components/ui/            # Nusxalash va ulashish tugmalari
src/data/templates.ts         # Shablonlar katalogi (code -> komponent)
src/lib/prisma.ts             # Prisma client (pg adapter bilan)
src/lib/slug.ts               # slugify + unikal slug (collision tekshiruvi)
src/lib/auth.ts               # TODO: NextAuth; hozircha demo foydalanuvchi
src/lib/format.ts             # Sana/vaqt va enum matnlari (o'zbekcha)
```

## Yangi shablon qo'shish

1. `src/components/templates/` ichida komponent yozing —
   `TemplateProps` ni qabul qiladi (`src/components/templates/types.ts`).
2. `src/components/templates/index.ts` dagi `TEMPLATE_COMPONENTS` ga
   `code -> komponent` qatorini qo'shing.
3. `src/data/templates.ts` dagi `TEMPLATES` ro'yxatiga meta ma'lumot qo'shing.
4. `npm run db:seed` — shablon bazaga yoziladi.

## Hozircha qilinmagan (keyingi bosqichlar)

- Autentifikatsiya: `src/lib/auth.ts` demo foydalanuvchi qaytaradi
- Foto/musiqa yuklash (Cloudflare R2) — `Photo` modeli va maydonlar tayyor
- To'lov (Payme/Click) — `Payment` modeli tayyor, webhook `is_active` ni yoqadi
- QR kod + PDF chop etish, Telegram bot, eslatma cron
- `Vendor` / `Booking` jadvallari — `Event.vendor_id` nullable maydoni joy qoldirgan

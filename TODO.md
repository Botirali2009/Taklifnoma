# TODO — hal qilinmagan va keyingi ishlar

## API kalitlari kerak (kod tayyor, sozlash yetishmaydi)

| Nima | Nima kerak | Bo'lmasa nima bo'ladi |
|---|---|---|
| Google login | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Login sahifasida Google tugmasi o'rniga eslatma chiqadi |
| Telegram login va bot | `TELEGRAM_BOT_TOKEN`, `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`, BotFather'da `/setdomain` | Telegram tugmasi ko'rinmaydi, webhook 503 qaytaradi |
| Fayl saqlash (R2) | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` | Fayllar lokal `.uploads` papkasiga tushadi — **Vercel'da ishlamaydi** |
| Eslatma croni | `CRON_SECRET` | Endpoint himoyasiz qoladi (kod ishlaydi) |
| Google Maps | API kaliti | Hozircha xarita OpenStreetMap embed bilan, joylashuv qo'lda lat/lng kiritiladi |

## Qurilmagan (keyingi bosqichlar)

- **To'lov (Payme/Click)** — `Payment` modeli va `Invitation.is_active`
  maydoni tayyor. Hozir `is_active` default `true`. To'lov qo'shilganda:
  default'ni `false` qilish, checkout sahifasi va webhook yozish
  (webhook `is_active = true` qiladi).
- **Bosqich 3: vendor marketplace** — to'yxona/fotograf/restoran katalogi,
  booking va komissiya tizimi. Schema'da joy qoldirilgan:
  `Event.vendor_id` (nullable). Keyin `Vendor` va `Booking` jadvallari
  migration bilan qo'shiladi.

## Texnik qarzlar va yaxshilashlar

- **Shablonlar**: hozircha bitta ("Klassik"). Yana 4-7 ta kerak
  (zamonaviy, lux, minimalist, milliy).
- **Rasm optimizatsiyasi**: yuklangan suratlar siqilmaydi. `sharp` bilan
  resize/webp qilish kerak (hozir 8 MB gacha original saqlanadi).
- **`next/image`** ishlatilmayapti (oddiy `<img>`), chunki R2/lokal
  manzillar dinamik. R2 domeni aniq bo'lgach `next.config.mjs` ga
  `images.remotePatterns` qo'shib almashtirish mumkin.
- **Mehmonlar ro'yxatini oldindan kiritish**: hozir Guest yozuvlari faqat
  RSVP javobidan yaratiladi. Egasi ro'yxatni oldindan yuklab (CSV),
  har biriga shaxsiy havola yuborishi foydali bo'lardi.
- **Tilaklar moderatsiyasi**: `Wish.is_visible` maydoni bor, lekin
  dashboardda yashirish tugmasi yo'q.
- **Eslatma faqat Telegram orqali**: telefon raqami bor, lekin SMS yo'q.
- **Sessiya strategiyasi**: JWT. Har so'rovda rol bazadan o'qiladi —
  trafik o'sganda keshlash kerak bo'lishi mumkin.
- **Ko'rishlar hisoblagichi** oddiy: egasi hisoblanmaydi, lekin bir mehmon
  bir necha marta ochsa har safar sanaladi (unikal ko'rish emas).
- **Testlar**: `e2e/full-flow.js` bor (asosiy oqim), unit testlar yo'q.
  Playwright `package.json` ga qo'shilmagan — alohida o'rnatiladi.
- **i18n**: interfeys faqat o'zbekcha (lotin). Rus/ingliz tili kerak bo'lsa
  matnlarni ajratib olish kerak.

## Ma'lum cheklovlar

- `ALLOW_DEV_LOGIN=true` faqat lokal ishlab chiqish uchun. Production build'da
  provider ro'yxatga qo'shilmaydi, lekin baribir bu o'zgaruvchini production
  muhitiga yozmang.
- Neon kabi "scale to zero" bazalar uzoq turgach uyquga ketadi — birinchi
  so'rov sekin bo'ladi yoki bir marta xato berishi mumkin (sahifani yangilang).

- Lokal fayl saqlash faqat dev uchun — production'da R2 shart.
- Telegram bot webhook rejimida ishlaydi (polling emas), ya'ni domen
  HTTPS bo'lishi kerak.
- `prisma migrate dev` interaktiv muhit talab qiladi; CI/cloud uchun
  `./scripts/create-migration.sh` yozilgan.

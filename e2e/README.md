# Uchidan-uchiga (e2e) tekshiruv

`full-flow.js` — butun oqimni haqiqiy brauzerda tekshiradigan skript:
kirish → wizard bilan taklifnoma yaratish (surat va musiqa yuklash bilan) →
mehmon sahifasi (galereya, xarita, musiqa, tilak) → RSVP → dashboard va
filtrlar → QR/PDF yuklash → sozlamalarni tahrirlash → admin panel huquqlari.

## Talablar

Playwright `package.json` ga qo'shilmagan (brauzer yuklab olish og'ir),
shuning uchun alohida o'rnatiladi:

```bash
npm install --no-save playwright
npx playwright install chromium
```

## Ishga tushirish

Test **build qilingan** ilovaga va **alohida test bazasiga** qarshi ishlaydi —
u ma'lumot yozadi, shuning uchun production bazasiga qaratmang.

```bash
# 1. Test bazasini tayyorlang
DATABASE_URL="postgresql://.../taklifnoma_test" npx prisma migrate deploy
DATABASE_URL="postgresql://.../taklifnoma_test" npm run db:seed

# 2. Ilovani ishga tushiring (Telegram tokeni test uchun ixtiyoriy satr bo'lishi mumkin)
TELEGRAM_BOT_TOKEN=test-bot-token \
NEXTAUTH_URL=http://localhost:3111 \
APP_URL=http://localhost:3111 \
DATABASE_URL="postgresql://.../taklifnoma_test" \
npm run build && npx next start -p 3111

# 3. Testni ishga tushiring
BASE_URL=http://localhost:3111 TELEGRAM_BOT_TOKEN=test-bot-token node e2e/full-flow.js
```

Skript Telegram Login Widget imzosini o'sha token bilan o'zi yasaydi —
haqiqiy Telegram hisobi kerak emas.

Tayyor Chromium bo'lsa, `CHROMIUM_PATH` orqali ko'rsatish mumkin.

`ADMIN_SQL` o'zgaruvchisi berilsa (masalan
`ADMIN_SQL="psql $DATABASE_URL -c"`), admin roli tekshiruvi ham bajariladi.

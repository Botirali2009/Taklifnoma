/**
 * Uchidan-uchiga tekshiruv — batafsil ma'lumot uchun e2e/README.md ga qarang.
 *
 * Ishlatish:
 *   BASE_URL=http://localhost:3111 TELEGRAM_BOT_TOKEN=test-bot-token \
 *   node e2e/full-flow.js
 */
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "test-bot-token";
const ADMIN_SQL = process.env.ADMIN_SQL;

const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "OK  " : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
}

/** Telegram Login Widget imzosi (server aynan shu tarzda tekshiradi) */
function signTelegram(fields) {
  const dataCheckString = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  return crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
}

async function login(context, user = {}) {
  const fields = {
    id: user.id || "111222333",
    first_name: user.firstName || "Dilshod",
    username: user.username || "dilshod",
    auth_date: String(Math.floor(Date.now() / 1000)),
  };

  const { csrfToken } = await (await context.request.get(`${BASE}/api/auth/csrf`)).json();

  const response = await context.request.post(`${BASE}/api/auth/callback/telegram`, {
    form: { ...fields, hash: signTelegram(fields), csrfToken, json: "true" },
  });

  return response.status();
}

/** Test uchun kichik PNG va MP3 fayllari yasaydi */
function makeFixtures() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "taklifnoma-e2e-"));

  const png = (name, rgb) => {
    const chunk = (type, data) => {
      const body = Buffer.concat([Buffer.from(type), data]);
      const length = Buffer.alloc(4);
      length.writeUInt32BE(data.length);
      const crc = Buffer.alloc(4);
      crc.writeUInt32BE(crc32(body) >>> 0);
      return Buffer.concat([length, body, crc]);
    };

    const width = 200;
    const height = 260;
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header[8] = 8;
    header[9] = 2;

    const row = Buffer.concat([
      Buffer.from([0]),
      Buffer.concat(Array.from({ length: width }, () => Buffer.from(rgb))),
    ]);
    const raw = Buffer.concat(Array.from({ length: height }, () => row));

    const file = path.join(dir, name);
    fs.writeFileSync(
      file,
      Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk("IHDR", header),
        chunk("IDAT", require("zlib").deflateSync(raw)),
        chunk("IEND", Buffer.alloc(0)),
      ]),
    );
    return file;
  };

  const mp3 = path.join(dir, "music.mp3");
  fs.writeFileSync(
    mp3,
    Buffer.concat([
      Buffer.from("ID3\x03\x00\x00\x00\x00\x00\x00", "binary"),
      Buffer.concat(
        Array.from({ length: 20 }, () =>
          Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x64]), Buffer.alloc(400)]),
        ),
      ),
    ]),
  );

  return { photos: [png("photo1.png", [200, 170, 120]), png("photo2.png", [150, 180, 200])], music: mp3 };
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc;
}

(async () => {
  const fixtures = makeFixtures();
  // CHROMIUM_PATH — tayyor brauzer bo'lsa (masalan CI konteynerida)
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  const consoleErrors = [];

  // 1. Public sahifalar va himoya
  const anon = await browser.newContext();
  const anonPage = await anon.newPage();

  for (const route of ["/", "/templates", "/login", "/templates/classic/preview"]) {
    const response = await anonPage.goto(BASE + route);
    check(`public ${route}`, response.status() === 200, `status ${response.status()}`);
  }

  for (const route of ["/my-invitations", "/create/classic", "/admin"]) {
    await anonPage.goto(BASE + route);
    check(`himoya ${route}`, anonPage.url().includes("/login"));
  }

  // 2. Kirish va wizard
  const context = await browser.newContext();
  check("Telegram login", (await login(context)) === 200);

  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(`${BASE}/create/classic`);
  await page.getByPlaceholder("Malika").fill("Sevara");
  await page.getByPlaceholder("Aziz").fill("Doniyor");
  await page.getByRole("button", { name: "Keyingisi" }).click();

  await page.locator('input[type="date"]').fill("2026-12-05");
  await page.locator('input[type="time"]').fill("18:00");
  await page.getByPlaceholder("Oq Saroy to'yxonasi").fill("Registon to'yxonasi");
  await page.getByPlaceholder("41.2995").fill("39.6547");
  await page.getByPlaceholder("69.2401").fill("66.9758");
  await page.getByRole("button", { name: "Keyingisi" }).click();

  await page.locator('input[type="file"]').setInputFiles(fixtures.photos);
  await page.waitForFunction(() => document.querySelectorAll('img[alt=""]').length === 2, null, {
    timeout: 20000,
  });
  await page.getByRole("button", { name: "Keyingisi" }).click();

  await page.locator('input[type="file"]').setInputFiles(fixtures.music);
  await page.waitForSelector("audio", { timeout: 20000 });
  await page.getByRole("button", { name: "Keyingisi" }).click();

  await page.waitForSelector("text=Tadbir dasturi");
  await page.getByRole("button", { name: "Taklifnomani yaratish" }).click();
  await page.waitForURL(/\/dashboard\//, { timeout: 30000 });

  const invitationId = page.url().split("/dashboard/")[1].split("?")[0];
  const slug = (await page.locator("code").first().innerText()).split("/i/")[1];
  check("wizard taklifnoma yaratdi", Boolean(slug), slug);

  // 3. Mehmon oqimi
  const guestContext = await browser.newContext();
  const guest = await guestContext.newPage();

  await guest.goto(`${BASE}/i/${slug}`);
  check("galereya suratlari", (await guest.locator("img").count()) === 2);
  check("xarita", (await guest.locator("iframe").count()) === 1);
  check("musiqa tugmasi", (await guest.locator('button[aria-label*="Musiqa"]').count()) === 1);

  await guest.getByPlaceholder("Ismingiz").fill("Kamola");
  await guest.getByPlaceholder("Tilagingizni yozing...").fill("Baxtli bo'linglar!");
  await guest.getByRole("button", { name: "Tilak qoldirish" }).click();
  await guest.waitForSelector("text=Tilagingiz uchun rahmat!", { timeout: 15000 });
  check("tilak yozildi", true);

  for (const [name, answer, count, side] of [
    ["Aziza", "Boraman", "2", "KELIN"],
    ["Bekzod", "Boraman", "3", "KUYOV"],
    ["Sardor", "Bormayman", "1", "KUYOV"],
  ]) {
    await guest.goto(`${BASE}/i/${slug}/rsvp`);
    await guest.getByPlaceholder("Aziza Karimova").fill(name);
    await guest.locator('select[name="side"]').selectOption(side);
    await guest.getByText(answer, { exact: true }).click();
    await guest.locator('input[name="guestCount"]').fill(count);
    await guest.getByRole("button", { name: "Javobni yuborish" }).click();
    await guest.waitForSelector("text=Rahmat!", { timeout: 15000 });
  }
  check("RSVP javoblari yozildi", true);

  // 4. Dashboard, filtrlar, QR va PDF
  await page.goto(`${BASE}/dashboard/${invitationId}`);
  check("mehmonlar jadvali", (await page.locator("tbody tr").count()) === 3);

  await page.locator("select").first().selectOption("KELIN");
  await page.waitForTimeout(1500);
  check("kelin tomoni filtri", (await page.locator("tbody tr").count()) === 1);

  const qr = await context.request.get(`${BASE}/api/invitations/${invitationId}/qr`);
  check("QR yuklandi", qr.status() === 200 && (await qr.body()).length > 1000);

  const pdf = await context.request.get(`${BASE}/api/invitations/${invitationId}/pdf`);
  check("PDF yuklandi", pdf.status() === 200 && (await pdf.body()).subarray(0, 4).toString() === "%PDF");

  const foreign = await browser.newContext();
  await login(foreign, { id: "777000222", firstName: "Boshqa", username: "boshqa" });
  const foreignQr = await foreign.request.get(`${BASE}/api/invitations/${invitationId}/qr`);
  check("begona foydalanuvchi QR ololmaydi", foreignQr.status() === 404);

  // 5. Sozlamalar
  await page.goto(`${BASE}/dashboard/${invitationId}/settings`);
  await page.locator("input").first().fill("Sevinch");
  await page.getByRole("button", { name: "Saqlash" }).click();
  await page.waitForSelector("text=Saqlandi.", { timeout: 15000 });

  await guest.goto(`${BASE}/i/${slug}`);
  check("tahrir public sahifada ko'rindi", (await guest.locator("h1").first().innerText()).includes("Sevinch"));

  // 6. Admin huquqlari
  await page.goto(`${BASE}/admin`);
  check("oddiy foydalanuvchi /admin ga kira olmaydi", !page.url().includes("/admin"));

  if (ADMIN_SQL) {
    require("child_process").execSync(
      `${ADMIN_SQL} "update users set role='ADMIN' where telegram_id='111222333';"`,
      { stdio: "ignore" },
    );

    const adminContext = await browser.newContext();
    await login(adminContext);
    const adminPage = await adminContext.newPage();
    await adminPage.goto(`${BASE}/admin`);
    check("admin /admin ga kiradi", adminPage.url().includes("/admin"));
    await adminPage.waitForSelector(".recharts-surface", { timeout: 15000 });
    check("admin grafiklari chizildi", (await adminPage.locator(".recharts-surface").count()) > 0);
  }

  await browser.close();

  const passed = results.filter((result) => result.ok).length;
  console.log(`\nXULOSA: ${passed} / ${results.length} muvaffaqiyatli`);

  if (consoleErrors.length > 0) {
    console.log("Brauzer konsol xatolari:", [...new Set(consoleErrors)].slice(0, 5));
  }

  process.exit(passed === results.length ? 0 : 1);
})().catch((error) => {
  console.error("FAIL", error.message);
  process.exit(1);
});

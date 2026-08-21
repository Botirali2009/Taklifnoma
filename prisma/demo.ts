/**
 * Namuna ma'lumot yaratadi — Google/Telegram kalitisiz ham
 * to'ldirilgan taklifnomani ko'rish uchun.
 *
 *   npm run db:demo
 *
 * So'ng: http://localhost:3000/i/namuna
 */
import "dotenv/config";
import { deflateSync } from "zlib";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TEMPLATES } from "../src/data/templates";
import { saveFile } from "../src/lib/storage";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_SLUG = "namuna";
const DEMO_PHONE = "+998900000000";

function crc32(buffer: Buffer): number {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc;
}

/** Kichik gradient PNG yasaydi (haqiqiy surat o'rniga namuna) */
function gradientPng(
  width: number,
  height: number,
  from: [number, number, number],
  to: [number, number, number],
): Buffer {
  const chunk = (type: string, data: Buffer) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([length, body, crc]);
  };

  const rows: Buffer[] = [];
  for (let y = 0; y < height; y++) {
    const ratio = y / (height - 1);
    const pixel = Buffer.from([
      Math.round(from[0] + (to[0] - from[0]) * ratio),
      Math.round(from[1] + (to[1] - from[1]) * ratio),
      Math.round(from[2] + (to[2] - from[2]) * ratio),
    ]);
    rows.push(
      Buffer.concat([Buffer.from([0]), Buffer.concat(Array(width).fill(pixel))]),
    );
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // truecolor

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

async function savePhoto(
  name: string,
  from: [number, number, number],
  to: [number, number, number],
): Promise<string> {
  const png = gradientPng(600, 800, from, to);
  const file = new File([new Uint8Array(png)], name, { type: "image/png" });
  return saveFile(file, "photos");
}

async function main() {
  const meta = TEMPLATES[0];

  const template = await prisma.template.upsert({
    where: { code: meta.code },
    update: {},
    create: { code: meta.code, name: meta.name, category: meta.category },
  });

  const user = await prisma.user.upsert({
    where: { phone: DEMO_PHONE },
    update: {},
    create: { phone: DEMO_PHONE, name: "Namuna foydalanuvchi" },
  });

  // Eski namunani tozalaymiz — buyruqni qayta ishga tushirsa bo'ladi
  await prisma.invitation.deleteMany({ where: { slug: DEMO_SLUG } });

  const startsAt = new Date();
  startsAt.setMonth(startsAt.getMonth() + 3);
  startsAt.setHours(18, 0, 0, 0);

  const fotosessiya = new Date(startsAt);
  fotosessiya.setDate(startsAt.getDate() - 1);
  fotosessiya.setHours(11, 0, 0, 0);

  const [photo1, photo2, photo3] = await Promise.all([
    savePhoto("namuna-1.png", [214, 186, 140], [246, 238, 224]),
    savePhoto("namuna-2.png", [154, 176, 194], [232, 238, 242]),
    savePhoto("namuna-3.png", [186, 164, 176], [244, 236, 240]),
  ]);

  const invitation = await prisma.invitation.create({
    data: {
      userId: user.id,
      templateId: template.id,
      slug: DEMO_SLUG,
      brideName: "Malika",
      groomName: "Aziz",
      eventType: "TOY",
      greeting:
        "Hurmatli mehmon!\nSizni oilamizning eng quvonchli kunida ko'rishdan mamnun bo'lamiz.",
      cardNumber: "8600 1234 5678 9012",
      cardHolder: "AZIZ RAHIMOV",
      viewCount: 42,
      events: {
        create: [
          {
            title: "Fotosessiya",
            startsAt: fotosessiya,
            locationName: "Anhor bo'yi",
            address: "Toshkent sh., Anhor kanali",
            order: 0,
          },
          {
            title: "To'y marosimi",
            startsAt,
            locationName: "Oq Saroy to'yxonasi",
            address: "Toshkent sh., Chilonzor tumani, 12-mavze",
            lat: 41.2995,
            lng: 69.2401,
            order: 1,
          },
        ],
      },
      photos: {
        create: [
          { url: photo1, order: 0 },
          { url: photo2, order: 1 },
          { url: photo3, order: 2 },
        ],
      },
      guests: {
        create: [
          {
            name: "Aziza Karimova",
            side: "KELIN",
            groupName: "Oila",
            rsvpStatus: "KELADI",
            guestCount: 2,
            respondedAt: new Date(),
          },
          {
            name: "Bekzod Tursunov",
            side: "KUYOV",
            groupName: "Do'stlar",
            rsvpStatus: "KELADI",
            guestCount: 3,
            respondedAt: new Date(),
          },
          {
            name: "Sardor Aliyev",
            side: "KUYOV",
            groupName: "Ish",
            rsvpStatus: "KELMAYDI",
            guestCount: 0,
            note: "Safarda bo'laman, tabriklayman!",
            respondedAt: new Date(),
          },
          {
            name: "Nilufar Yo'ldosheva",
            side: "KELIN",
            groupName: "Qo'shnilar",
            rsvpStatus: "KUTILMOQDA",
            guestCount: 1,
          },
        ],
      },
      wishes: {
        create: [
          {
            authorName: "Kamola",
            message: "Baxtli bo'linglar! Umringiz uzoq, dasturxoningiz to'kin bo'lsin.",
          },
          {
            authorName: "Jasur aka",
            message: "Yosh oilaga tinchlik va farovonlik tilaymiz!",
          },
        ],
      },
    },
  });

  const base = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  console.log("Namuna taklifnoma tayyor:");
  console.log(`  Mehmon sahifasi:  ${base}/i/${invitation.slug}`);
  console.log(`  Boshqaruv paneli: ${base}/dashboard/${invitation.id}`);
  console.log("  (Boshqaruv paneli uchun kirish kerak — README dagi auth bo'limiga qarang.)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

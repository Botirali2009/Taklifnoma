import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

/** Lokal rejimda fayllar shu papkaga tushadi (git'ga kirmaydi) */
export const LOCAL_UPLOAD_DIR = path.join(
  process.cwd(),
  process.env.UPLOAD_DIR ?? ".uploads",
);

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_AUDIO_BYTES = 15 * 1024 * 1024; // 15 MB

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/mp3", "audio/ogg"];

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
};

function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_URL,
  );
}

/**
 * Faylni saqlaydi va public URL qaytaradi.
 *
 * R2 kalitlari bo'lsa — Cloudflare R2 (S3-compatible) ga yuklaydi.
 * Bo'lmasa — lokal papkaga yozadi va `/api/files/...` orqali beradi
 * (Next.js `public/` ga build'dan keyin qo'shilgan fayllarni ko'rmaydi).
 *
 * DIQQAT: lokal rejim Vercel'da ishlamaydi (fayl tizimi read-only) —
 * production uchun R2 kalitlarini sozlang.
 */
export async function saveFile(
  file: File,
  folder: "photos" | "music",
): Promise<string> {
  const extension = EXTENSIONS[file.type] ?? "bin";
  const key = `${folder}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (r2Configured()) {
    // Dinamik import — R2 ishlatilmasa AWS SDK yuklanmaydi
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    );

    return `${process.env.R2_PUBLIC_URL!.replace(/\/$/, "")}/${key}`;
  }

  await mkdir(path.join(LOCAL_UPLOAD_DIR, folder), { recursive: true });
  await writeFile(path.join(LOCAL_UPLOAD_DIR, key), buffer);

  return `/api/files/${key}`;
}

export function validateFile(
  file: File,
  kind: "photo" | "music",
): string | null {
  const allowed = kind === "photo" ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;
  const maxBytes = kind === "photo" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;

  if (!allowed.includes(file.type)) {
    return kind === "photo"
      ? "Faqat JPG, PNG yoki WEBP rasm yuklash mumkin."
      : "Faqat MP3 yoki OGG musiqa yuklash mumkin.";
  }

  if (file.size > maxBytes) {
    return `Fayl juda katta (maksimum ${Math.round(maxBytes / 1024 / 1024)} MB).`;
  }

  return null;
}

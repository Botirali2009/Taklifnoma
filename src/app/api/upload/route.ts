import { NextResponse } from "next/server";
import { saveFile, validateFile } from "@/lib/storage";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";

/** Foto va musiqa yuklash (faqat kirgan foydalanuvchi uchun) */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Avval tizimga kiring." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind") === "music" ? "music" : "photo";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fayl topilmadi." }, { status: 400 });
  }

  const error = validateFile(file, kind);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  try {
    const url = await saveFile(file, kind === "music" ? "music" : "photos");
    return NextResponse.json({ url });
  } catch (cause) {
    console.error("Fayl yuklashda xatolik:", cause);
    return NextResponse.json(
      { error: "Faylni saqlab bo'lmadi. Keyinroq urinib ko'ring." },
      { status: 500 },
    );
  }
}

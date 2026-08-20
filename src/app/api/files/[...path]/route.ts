import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import type { ReadableOptions } from "stream";
import { LOCAL_UPLOAD_DIR } from "@/lib/storage";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
};

function toWebStream(filePath: string, options?: ReadableOptions) {
  const nodeStream = createReadStream(filePath, options);

  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) =>
        controller.enqueue(new Uint8Array(chunk as Buffer)),
      );
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (error) => controller.error(error));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

/**
 * Lokal saqlangan fayllarni beradi (R2 ishlatilmaganda).
 * Next.js `public/` papkasiga build'dan keyin qo'shilgan fayllarni
 * ko'rmaydi, shuning uchun alohida route kerak.
 */
export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } },
) {
  const relative = params.path.join("/");

  // Papkadan chiqib ketishga yo'l qo'ymaymiz (../ hujumi)
  const filePath = path.resolve(LOCAL_UPLOAD_DIR, relative);
  if (!filePath.startsWith(path.resolve(LOCAL_UPLOAD_DIR) + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return new NextResponse("Not found", { status: 404 });

    const contentType =
      CONTENT_TYPES[path.extname(filePath).toLowerCase()] ??
      "application/octet-stream";

    return new NextResponse(toWebStream(filePath), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

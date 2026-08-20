import QRCode from "qrcode";

const OPTIONS = {
  errorCorrectionLevel: "M" as const,
  margin: 2,
  width: 600,
  color: { dark: "#3d3529", light: "#ffffff" },
};

/** Havoladan QR kod PNG (Buffer) yasaydi — yuklab olish uchun */
export async function generateQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, { ...OPTIONS, type: "png" });
}

/** QR kodni data URL ko'rinishida qaytaradi — PDF ichiga qo'yish uchun */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, OPTIONS);
}

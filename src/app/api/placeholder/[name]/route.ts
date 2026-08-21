import { NextResponse } from "next/server";

/**
 * Namuna suratlar — shablon preview sahifasi uchun.
 * Haqiqiy fayl saqlamaslik uchun SVG gradient generatsiya qilinadi.
 */
const PALETTES: Array<[string, string]> = [
  ["#d8c3a5", "#f4ece1"],
  ["#a8bccd", "#e8eef3"],
  ["#c7b0bd", "#f2e9ee"],
  ["#b9c6ae", "#eaf0e6"],
];

export async function GET(
  _request: Request,
  { params }: { params: { name: string } },
) {
  const index = Number(params.name.match(/(\d+)/)?.[1] ?? 1) - 1;
  const [from, to] = PALETTES[Math.abs(index) % PALETTES.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="800" fill="url(#g)"/>
  <text x="300" y="410" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="rgba(0,0,0,.28)">namuna surat</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

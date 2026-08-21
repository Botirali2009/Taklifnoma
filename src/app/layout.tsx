import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taklifnoma — onlayn to'y taklifnomalari",
  description:
    "To'y, nikoh, sunnat va beshik to'y uchun chiroyli onlayn taklifnoma. Mehmonlar javobini (RSVP) yig'ing, QR kod bilan ulashing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        {/* Shriftlar brauzer tomonidan yuklanadi — build internetga bog'liq bo'lmasin */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Root layout — barcha sahifalarga tegishli, shuning uchun qoida bu yerda o'rinli emas */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        {/* JavaScript o'chirilgan bo'lsa animatsiyali bloklar ko'rinib tursin */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

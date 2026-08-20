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
      <body className="antialiased">
        {/* JavaScript o'chirilgan bo'lsa animatsiyali bloklar ko'rinib tursin */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}

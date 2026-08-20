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
      <body className="antialiased">{children}</body>
    </html>
  );
}

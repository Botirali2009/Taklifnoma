import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Platforma sahifalari uchun layout. Mehmon sahifasi (/i/[slug]) bunga kirmaydi. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

import Link from "next/link";

const FEATURES = [
  {
    title: "Mehmonlar javobi (RSVP)",
    text: "Kim keladi, necha kishi bilan — hammasi bitta jadvalda.",
  },
  {
    title: "QR kodli qog'oz taklifnoma",
    text: "Chop etiladigan taklifnomaga QR kod — mehmon skanerlab javob beradi.",
  },
  {
    title: "Bir nechta tadbir",
    text: "Nikoh, fotosessiya, kechki to'y — har biri o'z sanasi va manzili bilan.",
  },
  {
    title: "Telegram bot",
    text: "Eslatmalar va RSVP javoblari to'g'ridan-to'g'ri Telegram orqali.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-24 text-center">
        <h1 className="text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
          To&apos;yingiz uchun onlayn taklifnoma
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600">
          5 daqiqada chiroyli taklifnoma yarating, havolani mehmonlarga
          yuboring va kim kelishini oldindan biling.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/templates"
            className="rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-700"
          >
            Shablon tanlash
          </Link>
          <Link
            href="/my-invitations"
            className="rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Mening taklifnomalarim
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-neutral-200 p-6"
            >
              <h2 className="font-medium text-neutral-900">{feature.title}</h2>
              <p className="mt-2 text-sm text-neutral-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

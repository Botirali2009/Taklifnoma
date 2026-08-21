import Link from "next/link";

const STEPS = [
  {
    title: "Shablon tanlang",
    text: "Katalogdan yoqqanini tanlaysiz — har birini avval namunada ko'rish mumkin.",
  },
  {
    title: "Ma'lumotni kiriting",
    text: "Ismlar, sana, to'yxona manzili, suratlar va musiqa — bosqichma-bosqich.",
  },
  {
    title: "Havolani ulashing",
    text: "Telegram yoki WhatsApp orqali yuborasiz, qog'oz taklifnomaga QR kod bosasiz.",
  },
];

const FEATURES = [
  {
    title: "Mehmonlar javobi",
    text: "Kim keladi, necha kishi bilan — hammasi bitta jadvalda, kelin/kuyov tomoni bo'yicha ajratilgan.",
    icon: (
      <path d="M4 19c0-3 2.7-4.5 6-4.5s6 1.5 6 4.5M10 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 14.5c1.8.5 3 1.8 3 4.5" />
    ),
  },
  {
    title: "QR kodli qog'oz taklifnoma",
    text: "Chop etish uchun PDF: taklifnoma dizayni va QR kod bir varaqda. Mehmon skanerlab javob beradi.",
    icon: (
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h3m0 0v3m0-3h3m-6-3h6" />
    ),
  },
  {
    title: "Bir nechta tadbir",
    text: "Nikoh, fotosessiya, kechki to'y — har biri o'z sanasi, vaqti va manzili bilan ko'rsatiladi.",
    icon: (
      <path d="M7 3v3m10-3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
    ),
  },
  {
    title: "Telegram bot",
    text: "Mehmon botda ham javob bera oladi, tadbirdan bir kun oldin esa avtomatik eslatma keladi.",
    icon: <path d="M21 5 3 11l6 2.5M21 5l-3 14-6-5.5M21 5 9 13.5m0 0V19l3-2.5" />,
  },
  {
    title: "Suratlar va musiqa",
    text: "Foto galereya lightbox bilan ochiladi, fon musiqasi mehmon xohlasa ijro etiladi.",
    icon: (
      <path d="M4 16.5 8.5 12l3 3L15 11l5 5.5M4 6h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm5.5 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" />
    ),
  },
  {
    title: "Statistika",
    text: "Necha kishi taklifnomani ochdi, javob foizi qancha — boshqaruv panelida ko'rinib turadi.",
    icon: <path d="M5 19V10m7 9V5m7 14v-6M3 21h18" />,
  },
];

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Bosh sahifadagi kichik taklifnoma maketi */
function InvitationMock() {
  return (
    <div className="relative mx-auto w-full max-w-[19rem]">
      <div className="absolute -inset-4 -rotate-3 rounded-[1.6rem] border border-line bg-paper-sunk/70" />

      <div className="relative rounded-[1.4rem] border border-line bg-[#fdfbf7] p-7 text-center shadow-lift">
        <p className="text-[10px] uppercase tracking-[0.32em] text-brass">
          To&apos;y taklifnomasi
        </p>

        <p className="mt-6 font-display text-3xl leading-tight text-[#3d3529]">
          Malika
          <span className="mx-2 text-brass">&amp;</span>
          Aziz
        </p>

        <div className="mx-auto mt-5 h-px w-16 bg-brass/50" />

        <p className="mt-5 font-display text-lg text-brass">
          12-sentabr, shanba · 18:00
        </p>

        <p className="mt-3 text-xs leading-relaxed text-[#6b6053]">
          Oq Saroy to&apos;yxonasi
          <br />
          Toshkent sh., Chilonzor
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <span className="rounded-lg bg-brass py-2 text-[11px] font-semibold text-white">
            Boraman
          </span>
          <span className="rounded-lg border border-line-strong py-2 text-[11px] font-semibold text-[#6b6053]">
            Bormayman
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-14 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:pb-24 lg:pt-24">
        <div>
          <p className="eyebrow">To&apos;y · nikoh · sunnat · beshik to&apos;y</p>

          <h1 className="mt-5 font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Taklifnomangiz bitta havolada
          </h1>

          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
            Chiroyli onlayn taklifnoma yarating, mehmonlarga yuboring va kim
            kelishini oldindan biling. Qog&apos;oz taklifnomaga QR kod bosasiz —
            mehmon skanerlab javob beradi.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/templates" className="btn-brass">
              Shablon tanlash
            </Link>
            <Link href="/templates/classic/preview" className="btn-ghost">
              Namunani ko&apos;rish
            </Link>
          </div>

          <p className="mt-6 text-sm text-ink-faint">
            Hozircha bepul — to&apos;lov tizimi keyinroq qo&apos;shiladi.
          </p>
        </div>

        <InvitationMock />
      </section>

      {/* Qadamlar — haqiqiy ketma-ketlik */}
      <section className="border-y border-line bg-paper-sunk/50">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="section-title text-center">Uch qadamda tayyor</h2>

          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative">
                <span className="font-display text-4xl leading-none text-brass/35">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Imkoniyatlar */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:py-24">
        <h2 className="section-title text-center">Nimalar bor</h2>
        <p className="mx-auto mt-3 max-w-prose text-center text-ink-soft">
          Taklifnomaning o&apos;zi bilan cheklanmaydi — mehmonlar javobidan
          eslatmagacha.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="card-pad">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brass-soft text-brass-deep">
                <FeatureIcon>{feature.icon}</FeatureIcon>
              </span>

              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Yakuniy chaqiruv */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-9 sm:grid-cols-[1.2fr_auto] sm:items-center sm:p-12">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Bugun boshlang
              </h2>
              <p className="mt-3 max-w-prose text-ink-soft">
                Shablon tanlab, ma&apos;lumotlaringizni kiriting — havola bir
                necha daqiqada tayyor bo&apos;ladi.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/templates" className="btn-brass">
                Boshlash
              </Link>
              <Link href="/login" className="btn-ghost">
                Kirish
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

type Props = {
  url: string;
  text: string;
};

export function ShareButtons({ url, text }: Props) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        // Foydalanuvchi bekor qildi
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noreferrer"
      >
        Telegram
      </a>
      <a
        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleNativeShare}
        className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
      >
        Ulashish
      </button>
    </div>
  );
}

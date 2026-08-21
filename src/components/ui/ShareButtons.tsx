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
        className="btn btn-sm bg-[#2AABEE] text-white hover:bg-[#1e97d4]"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noreferrer"
      >
        Telegram
      </a>
      <a
        className="btn btn-sm bg-[#25D366] text-white hover:bg-[#1eb85a]"
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={handleNativeShare}
        className="btn-ghost btn-sm"
      >
        Ulashish
      </button>
    </div>
  );
}

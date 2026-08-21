type Props = {
  lat: number;
  lng: number;
  title: string;
};

/**
 * Xarita. OpenStreetMap embed ishlatiladi — API kalit talab qilmaydi.
 * TODO: Google Maps kaliti bo'lganda o'sha embedga almashtirish mumkin.
 */
export function MapEmbed({ lat, lng, title }: Props) {
  const delta = 0.004;
  const bbox = [lng - delta, lat - delta / 2, lng + delta, lat + delta / 2].join(",");

  return (
    <div
      className="overflow-hidden"
      style={{
        border: "1px solid var(--tpl-line)",
        borderRadius: "var(--tpl-radius)",
      }}
    >
      <iframe
        title={`${title} — xarita`}
        className="h-56 w-full"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
      />
    </div>
  );
}

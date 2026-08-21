import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Taklifnoma — onlayn to'y taklifnomalari";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Sayt havolasi ulashilganda ko'rinadigan karta */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf7f1",
          color: "#211d18",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            borderRadius: 999,
            border: "3px solid #d8bd8a",
            color: "#a9762c",
            fontSize: 44,
          }}
        >
          T
        </div>

        <div style={{ marginTop: 40, fontSize: 74, letterSpacing: -1 }}>
          Taklifnoma
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#5f574a",
            textAlign: "center",
          }}
        >
          Onlayn to&apos;y taklifnomasi — mehmonlar javobi bilan
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a9762c",
          }}
        >
          to&apos;y · nikoh · sunnat · beshik to&apos;y
        </div>
      </div>
    ),
    size,
  );
}

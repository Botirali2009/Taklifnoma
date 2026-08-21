import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Brauzer yorlig'idagi belgi — jez rangdagi "T" monogrammasi */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf7f1",
          color: "#a9762c",
          fontSize: 44,
          fontWeight: 600,
          borderRadius: 14,
          border: "3px solid #e6decf",
        }}
      >
        T
      </div>
    ),
    size,
  );
}

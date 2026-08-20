import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

export type InvitationPdfData = {
  brideName: string;
  groomName: string;
  eventTypeLabel: string;
  greeting: string | null;
  events: Array<{
    title: string;
    dateLabel: string;
    timeLabel: string;
    locationName: string;
    address: string | null;
  }>;
  qrDataUrl: string;
  publicUrl: string;
};

const GOLD = "#b98a3f";
const INK = "#3d3529";
const MUTED = "#6b6053";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fdfbf7",
    color: INK,
    paddingVertical: 56,
    paddingHorizontal: 48,
    fontSize: 12,
  },
  frame: {
    borderWidth: 1,
    borderColor: GOLD,
    borderStyle: "solid",
    paddingVertical: 40,
    paddingHorizontal: 32,
    height: "100%",
  },
  kicker: {
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 3,
    color: GOLD,
    textTransform: "uppercase",
  },
  names: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 30,
  },
  rule: {
    marginTop: 20,
    marginHorizontal: "auto",
    width: 90,
    height: 1,
    backgroundColor: GOLD,
  },
  greeting: {
    marginTop: 22,
    textAlign: "center",
    color: MUTED,
    lineHeight: 1.6,
  },
  event: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e8dcc6",
    borderTopStyle: "solid",
    textAlign: "center",
  },
  eventTitle: { fontSize: 14 },
  eventMeta: { marginTop: 6, color: MUTED },
  eventPlace: { marginTop: 6 },
  qrBlock: { marginTop: 30, alignItems: "center" },
  qr: { width: 130, height: 130 },
  qrHint: {
    marginTop: 10,
    fontSize: 9,
    color: MUTED,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 1.5,
  },
  url: { marginTop: 6, fontSize: 8, color: GOLD, textAlign: "center" },
});

/** Chop etish uchun taklifnoma: dizayn + QR kod bir varaqda */
export function InvitationPdf({ data }: { data: InvitationPdfData }) {
  return (
    <Document
      title={`${data.brideName} & ${data.groomName} — taklifnoma`}
      author="Taklifnoma"
    >
      <Page size="A5" style={styles.page}>
        <View style={styles.frame}>
          <Text style={styles.kicker}>{data.eventTypeLabel} taklifnomasi</Text>

          <Text style={styles.names}>
            {data.brideName} & {data.groomName}
          </Text>

          <View style={styles.rule} />

          <Text style={styles.greeting}>
            {data.greeting ??
              "Sizni oilamizning quvonchli kunida ko'rishdan mamnun bo'lamiz."}
          </Text>

          {data.events.map((event, index) => (
            <View key={index} style={styles.event}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventMeta}>
                {event.dateLabel} · {event.timeLabel}
              </Text>
              <Text style={styles.eventPlace}>{event.locationName}</Text>
              {event.address && (
                <Text style={styles.eventMeta}>{event.address}</Text>
              )}
            </View>
          ))}

          <View style={styles.qrBlock}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={data.qrDataUrl} style={styles.qr} />
            <Text style={styles.qrHint}>
              QR kodni telefon kamerasi bilan skanerlang — taklifnomani oching
              va &quot;Boraman / Bormayman&quot; javobini bering.
            </Text>
            <Text style={styles.url}>{data.publicUrl}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

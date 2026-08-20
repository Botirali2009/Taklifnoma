import type { EventType } from "@/generated/prisma/enums";

export type InvitationEventView = {
  id: string;
  title: string;
  startsAt: Date;
  locationName: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
};

export type InvitationPhotoView = {
  id: string;
  url: string;
};

/** Shablon komponentlari qabul qiladigan umumiy ma'lumot */
export type InvitationView = {
  slug: string;
  brideName: string;
  groomName: string;
  eventType: EventType;
  greeting: string | null;
  cardNumber: string | null;
  cardHolder: string | null;
  musicUrl: string | null;
  events: InvitationEventView[];
  photos: InvitationPhotoView[];
};

export type TemplateProps = {
  invitation: InvitationView;
  /** Preview rejimida RSVP tugmasi ishlamaydi */
  preview?: boolean;
};

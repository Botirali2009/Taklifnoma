import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { verifyTelegramAuth } from "@/lib/telegram-auth";
import type { Role } from "@/generated/prisma/enums";

const providers: NextAuthOptions["providers"] = [];

// Google — kalitlar bo'lsagina yoqiladi (aks holda login sahifasi ishlayveradi)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

// Telegram Login Widget — widget qaytargan ma'lumot imzosi tekshiriladi
providers.push(
  CredentialsProvider({
    id: "telegram",
    name: "Telegram",
    credentials: {
      id: { label: "id", type: "text" },
      first_name: { label: "first_name", type: "text" },
      last_name: { label: "last_name", type: "text" },
      username: { label: "username", type: "text" },
      photo_url: { label: "photo_url", type: "text" },
      auth_date: { label: "auth_date", type: "text" },
      hash: { label: "hash", type: "text" },
    },
    async authorize(credentials) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      if (!botToken || !credentials?.id || !credentials.hash) return null;

      const ok = verifyTelegramAuth(
        {
          id: credentials.id,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          username: credentials.username,
          photo_url: credentials.photo_url,
          auth_date: credentials.auth_date ?? "",
          hash: credentials.hash,
        },
        botToken,
      );

      if (!ok) return null;

      const name =
        [credentials.first_name, credentials.last_name]
          .filter(Boolean)
          .join(" ") || credentials.username || "Telegram foydalanuvchi";

      const user = await prisma.user.upsert({
        where: { telegramId: credentials.id },
        update: {
          name,
          telegramUsername: credentials.username || null,
          image: credentials.photo_url || null,
        },
        create: {
          telegramId: credentials.id,
          telegramUsername: credentials.username || null,
          name,
          image: credentials.photo_url || null,
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
);

export const authOptions: NextAuthOptions = {
  // Prisma 7 generatsiya qilgan client adapter tipidan farq qiladi — runtime bir xil
  adapter: PrismaAdapter(prisma as never),
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id;

      // Rolni har safar bazadan olamiz — admin berilganda darhol kuchga kiradi
      if (token.uid) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.uid as string },
          select: { role: true },
        });
        if (dbUser) token.role = dbUser.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.uid as string) ?? "";
        session.user.role = (token.role as Role) ?? "USER";
      }
      return session;
    },
  },
};

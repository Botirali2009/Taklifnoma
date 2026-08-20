import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import type { UserModel } from "@/generated/prisma/models";

/** Sessiyadagi foydalanuvchi (kirmagan bo'lsa null) */
export async function getCurrentUser(): Promise<UserModel | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({ where: { id: session.user.id } });
}

/** Kirish talab qilinadigan sahifalar uchun */
export async function requireUser(): Promise<UserModel> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Faqat admin uchun */
export async function requireAdmin(): Promise<UserModel> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

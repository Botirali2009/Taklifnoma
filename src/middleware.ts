import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

/**
 * Himoyalangan route'lar:
 * - /create, /my-invitations, /dashboard — kirgan foydalanuvchi
 * - /admin — faqat role=ADMIN
 * Public: /, /templates, /i/[slug], /login, /api/*
 */
export default withAuth(
  function middleware(request) {
    // Kirgan, lekin admin bo'lmagan foydalanuvchini bosh sahifaga qaytaramiz.
    // (Aks holda /login -> /admin -> /login redirect halqasi hosil bo'ladi.)
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextauth.token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  },
  {
    callbacks: {
      // Kirmagan foydalanuvchi /login ga yo'naltiriladi
      authorized: ({ token }) => Boolean(token),
    },
    pages: { signIn: "/login" },
  },
);

export const config = {
  matcher: [
    "/create/:path*",
    "/my-invitations/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

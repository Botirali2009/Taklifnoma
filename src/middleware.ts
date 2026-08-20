import { withAuth } from "next-auth/middleware";

/**
 * Himoyalangan route'lar:
 * - /create, /my-invitations, /dashboard — kirgan foydalanuvchi
 * - /admin — faqat role=ADMIN
 * Public: /, /templates, /i/[slug], /login, /api/*
 */
export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;

      if (req.nextUrl.pathname.startsWith("/admin")) {
        return token.role === "ADMIN";
      }

      return true;
    },
  },
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/create/:path*",
    "/my-invitations/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

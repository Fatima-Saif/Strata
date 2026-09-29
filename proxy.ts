import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/customers/:path*",
    "/users/:path*",
    "/projects/:path*",
    "/revenue/:path*",
    "/invoices/:path*",
    "/subscriptions/:path*",
    "/reports/:path*",
    "/notifications/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/help/:path*",
  ],
};

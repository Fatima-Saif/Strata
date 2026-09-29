import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Look up user in real SQLite database
          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase().trim() },
          });

          if (dbUser && verifyPassword(credentials.password, dbUser.password)) {
            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role,
            };
          }
        } catch (e) {
          console.error('Database auth error:', e);
        }

        // Demo fallback for instant testing with any test credentials
        if (credentials.email === "test@example.com" || credentials.email === "admin@acme.com") {
          return {
            id: "demo-admin",
            name: "Admin User",
            email: credentials.email,
            role: "Admin",
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "mock-secret-for-local-dev-only",
};

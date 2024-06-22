import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { CustomPrismaAdapter } from "../../../../lib/CustomPrismaAdapter";
import prisma from "../../../../lib/prisma";
import { Role } from "@prisma/client";
import { AuthOptions } from "next-auth";

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: CustomPrismaAdapter,
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        // Fetch user role from the database
        const dbUser = await prisma.person.findUnique({
          where: { id: Number(user.id) },
          select: { role: true }, // Assuming 'role' is a field in your user model
        });
        token.role = dbUser?.role || "user"; // Default to 'user' if role is not found
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role; // Add role to session
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      const userByEmail = await prisma.person.findUnique({
        where: { email: user.email },
      });

      if (!userByEmail && user && user.email && user.name && user.image) {
        await prisma.person.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            accounts: {
              create: {
                provider: account!.provider,
                providerAccountId: account!.providerAccountId,
                refresh_token: account!.refresh_token,
                access_token: account!.access_token,
                expires_at: account!.expires_at,
                token_type: account!.token_type,
                scope: account!.scope,
                id_token: account!.id_token,
                session_state: account!.session_state,
                type: account!.type || "oauth",
              },
            },
          },
        });
      } else {
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
            },
          },
        });

        if (!existingAccount && userByEmail) {
          await prisma.account.create({
            data: {
              provider: account!.provider,
              providerAccountId: account!.providerAccountId,
              refresh_token: account!.refresh_token,
              access_token: account!.access_token,
              expires_at: account!.expires_at,
              token_type: account!.token_type,
              scope: account!.scope,
              id_token: account!.id_token,
              session_state: account!.session_state,
              userId: userByEmail.id,
              type: account!.type || "oauth",
            },
          });
        }
      }
      return true;
    },
  },
};

//DO NOT CHANGE THIS
const handler = NextAuth(options);

export { handler as GET, handler as POST };
import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getUser } from "../thirdweb-auth/[...thirdweb]";
import { Cronos, Polygon } from "@thirdweb-dev/chains";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  secret: process.env.AUTH_SECRET || "",

  providers: [
    DiscordProvider({
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.SECRET_KEY as string, //Discord Bot 1 time reset thing
    }),
  ],

  // When the user signs in, get their token
  callbacks: {
    async jwt({ token, account }) {
      // Persist the user ID to the token right after signin
      if (account) {
        console.log(account);
        token.userId = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token, user }) {
      // @ts-ignore
      session.userId = token.userId;
      return session;
    },
  },
};

export default NextAuth(authOptions);

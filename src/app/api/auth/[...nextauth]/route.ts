import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth";

export const config = {
  runtime: 'edge',
}

const authConfig: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub // add user ID to session
      return session
    },
  },
}

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }

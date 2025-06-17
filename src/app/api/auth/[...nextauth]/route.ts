import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { AuthOptions } from "next-auth"

const config: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    }
  }
}

const handler = NextAuth(config)

export const GET = handler
export const POST = handler

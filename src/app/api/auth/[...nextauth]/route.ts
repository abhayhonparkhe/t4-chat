import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type { AuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
}

interface ExtendedSession {
  user?: SessionUser;
  openRouterKey?: string;
  expires: string;
}

const config: AuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }: { session: ExtendedSession; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Add OpenRouter API key to session
        session.openRouterKey = process.env.OPENROUTER_API_KEY;
      }
      return session;
    }
  }
}

const handler = NextAuth(config)

export const GET = handler
export const POST = handler

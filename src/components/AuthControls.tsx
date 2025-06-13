"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function AuthControls() {
  const { data: session } = useSession()

  return session ? (
    <div>
      <Image src={session?.user?.image!} alt={session?.user?.name!} width={50} height={50}></Image>
      <p>Welcome {session?.user?.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  ) : (
    <button onClick={() => signIn("github")}>Sign In with GitHub</button>
  )
}

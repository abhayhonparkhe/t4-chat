"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function AuthControls() {
  const { data: session } = useSession()
  const displayName = session?.user ? session.user.name : '';
  const imageUrl = session?.user ? session.user.image : '';

  return session ? (
    <div className="bg-[#202020] border-b-black border-t-[#565353] border-b border-t text-white">
      <Image className="rounded-full" src={imageUrl!} alt={displayName!} width={50} height={50}></Image>
      <p>Welcome {displayName}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  ) : (
    <button onClick={() => signIn("github")}>Sign In with GitHub</button>
  )
}

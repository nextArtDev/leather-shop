import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Hero from '@/components/home/hero/hero'
export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="w-full h-full items-center justify-items-center min-h-screen p-1  ">
      <Hero />
      <Link
        href={'/sign-in'}
        className={buttonVariants({ variant: 'destructive' })}
      >
        Sign In
      </Link>
      <p>{session?.session.userAgent}</p>
      <p>{session?.session.ipAddress}</p>
      <p>{session?.session.token}</p>
      <p>{session?.user.name}</p>
      <p>{session?.user.phoneNumber}</p>
    </div>
  )
}

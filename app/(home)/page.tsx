import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Hero from '@/components/home/hero/hero'
import BannerText from '@/components/home/navbar/BannerText'
import FadeMenu from '@/components/home/shared/fade-menu'
export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen">
      {/* <div className="sticky w-full h-full top-0 z-20 ">
        <BannerText />
      </div> */}
      {/* <div className=" ">
        <FadeMenu />
      </div> */}
      <Hero />
      <div className="h-screen"></div>
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

import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import Hero from '@/components/home/hero/hero'
import BannerText from '@/components/home/navbar/BannerText'
import FadeMenu from '@/components/home/shared/fade-menu'
import SlideOpacity from '@/components/product/main-page-carousel'
import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import ProductCardCarousel from '@/components/product/product-card-Carousel'
import MainPageCarousel from '@/components/product/main-page-carousel'
import ProductCard from '@/components/product/product-card'
import ProductGrid from '@/components/product/ProductGrid'
import ProductPage from '@/components/product/product-detail/ProductDetails'
export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // #eceae8

  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen">
      {/* <div className="sticky w-full h-full top-0 z-20 ">
        <BannerText />
      </div> */}
      {/* <div className=" ">
        <FadeMenu />
      </div> */}
      <Hero />
      <MainPageCarousel />
      <ProductGrid />
      {/* <ProductDetailCarousel /> */}
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

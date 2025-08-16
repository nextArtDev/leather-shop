import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'
import Hero from '@/components/home/hero/hero'
import Commitments from '@/components/home/shared/Commitments'
import StoreStatement from '@/components/home/shared/StoreStatement'
import WorkVideo from '@/components/home/shared/WorkVideo'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import MainPageCarousel from '@/components/product/main-page-carousel'
import { buttonVariants } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import {
  getCategoriesWithStats,
  getHomepageProducts,
  getSubCategories,
} from '@/lib/home/queries/products'
import { Link } from 'lucide-react'
import { headers } from 'next/headers'
// import { auth } from '@/lib/auth'
// import { headers } from 'next/headers'

const bestSellersItems = [
  {
    id: '1',
    title: 'small handbag in grained leather',
    imageSrc: '/images/bag.webp',
    category: 'Juliette',
    link: '/products/1',
    price: 750,
  },
  {
    id: '2',
    title: 'medium handbag with double flap in grained leather',
    imageSrc: '/images/bag-2.webp',
    category: 'Emilie',
    link: '/products/1',
    price: 690,
  },
  {
    id: '3',
    title: 'Louise small tote bag in grained leather',
    imageSrc: '/images/bag-3.webp',
    category: 'Louise',
    link: '/products/1',
    price: 570,
  },
  {
    id: '4',
    title: 'medium-sized handbag in grained leather',
    imageSrc: '/images/bag-4.webp',
    category: 'Emilie',
    link: '/products/1',
    price: 580,
  },
  {
    id: '5',
    title: 'medium handbag in smooth leather and nubuck',
    imageSrc: '/images/bag-5.webp',
    category: 'Juliette',
    link: '/products/1',
    price: 670,
  },
]
const CollectionItems = [
  {
    id: '1',
    title: 'medium handbag in smooth leather and nubuck',
    imageSrc: '/images/bag-5.webp',
    category: 'Juliette',
    link: '/products/1',
    price: 670,
  },
  {
    id: '2',
    title: 'medium-sized handbag in grained leather',
    imageSrc: '/images/bag-4.webp',
    category: 'Emilie',
    link: '/products/1',
    price: 580,
  },
  {
    id: '3',
    title: 'Louise small tote bag in grained leather',
    imageSrc: '/images/bag-3.webp',
    category: 'Louise',
    link: '/products/1',
    price: 570,
  },

  {
    id: '4',
    title: 'medium handbag with double flap in grained leather',
    imageSrc: '/images/bag-2.webp',
    category: 'Emilie',
    link: '/products/1',
    price: 690,
  },
  {
    id: '5',
    title: 'small handbag in grained leather',
    imageSrc: '/images/bag.webp',
    category: 'Juliette',
    link: '/products/1',
    price: 750,
  },
]
export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const products = await getHomepageProducts()
  const categories = await getCategoriesWithStats()
  const subCategories = await getSubCategories()
  console.log(subCategories)
  // #eceae8

  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen mx-auto">
      {/* <div className="sticky w-full h-full top-0 z-20 ">
        <BannerText />
      </div> */}
      {/* <div className=" ">
        <FadeMenu />
      </div> */}
      <Hero subCategories={subCategories} />
      <StoreStatement />
      <section className="flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase">
          پرفروش‌ترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase">جدیدترینها</h2>
        <MainPageCarousel items={products} />
      </section>
      <section>
        <WorkVideo />
      </section>
      <section className="flex flex-col items-center gap-6 text-3xl text-left">
        <h2 className="uppercase adad">Our commitments 54654654654</h2>
        <Commitments />
      </section>
      <section className="flex flex-col w-full gap-6 text-3xl text-center py-12 ">
        <h2 className="uppercase">Discover more</h2>
        <DiscoverMoreCarousel />
      </section>
      <TestimonialCarousel />

      {/* <ProductDetailCarousel /> */}
      {/* <div className="h-screen"></div> */}

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

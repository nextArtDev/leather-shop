import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'

import Commitments from '@/components/home/shared/Commitments'
import StoreStatement from '@/components/home/shared/StoreStatement'
import WorkVideo from '@/components/home/shared/WorkVideo'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import MainPageCarousel from '@/components/product/main-page-carousel'
import {
  getCategoriesWithStats,
  getHomepageProducts,
  //   getSubCategories,
} from '@/lib/home/queries/products'
import Hero from './components/Hero'

export default async function Home() {
  const products = await getHomepageProducts()
  const categories = await getCategoriesWithStats()
  //   const subCategories = await getSubCategories()

  // #eceae8

  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen mx-auto">
      {/* <div className="sticky w-full h-full top-0 z-20 ">
        <BannerText />
      </div> */}
      {/* <div className=" ">
        <FadeMenu />
      </div> */}
      <Hero />
      <StoreStatement />
      <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase">
          پرفروش‌ترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase">جدیدترینها</h2>
        <MainPageCarousel items={products} />
      </section>
      <section>
        <WorkVideo />
      </section>
      <section className="flex flex-col items-center gap-6 text-3xl text-left">
        <h2 className="uppercase adad">Our commitments </h2>
        <Commitments />
      </section>
      <section className="flex flex-col w-full h-full gap-6 text-3xl text-center py-12 ">
        <h2 className="uppercase">بیشتر </h2>
        <DiscoverMoreCarousel categories={categories} />
      </section>
      <TestimonialCarousel />

      {/* <Link
        href={'/sign-in'}
        className={buttonVariants({ variant: 'destructive' })}
      >
        Sign In
      </Link> */}
      {/* <p>{session?.session.userAgent}</p>
      <p>{session?.session.ipAddress}</p>
      <p>{session?.session.token}</p>
      <p>{session?.user.name}</p>
      <p>{session?.user.phoneNumber}</p> */}
    </div>
  )
}

import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'
import Hero from '@/components/home/hero/hero'
import Commitments from '@/components/home/shared/Commitments'
import StoreStatement from '@/components/home/shared/StoreStatement'
import WorkVideo from '@/components/home/shared/WorkVideo'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import MainPageCarousel from '@/components/product/main-page-carousel'

import {
  // getCategoriesWithStats,
  getHomepageProducts,
  getSubCategories,
} from '@/lib/home/queries/products'
// import { auth } from '@/lib/auth'
// import { headers } from 'next/headers'

export default async function Home() {
  // await new Promise((resolve) => setTimeout(resolve, 10000))

  const products = await getHomepageProducts()
  // const categories = await getCategoriesWithStats()
  const subCategories = await getSubCategories()
  // #eceae8

  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen mx-auto">
      {/* <div className="sticky w-full h-full top-0 z-20 ">
        <BannerText />
      </div> */}
      {/* <div className=" ">
        <FadeMenu />
      </div> */}
      {/* <Loader variant="magnetic-dots" size={72} /> */}
      <Hero subCategories={subCategories} />
      <div className="py-16">
        <StoreStatement />
      </div>
      <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
          پرفروش‌ترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
          جدیدترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="py-12">
        <WorkVideo />
      </section>
      <section className="flex flex-col items-center gap-6 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center  py-8">
          تعهدات ما
        </h2>
        <Commitments />
      </section>
      <section className="flex flex-col w-full h-full gap-6  text-center py-12 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8  ">
          بیشتر{' '}
        </h2>
        <DiscoverMoreCarousel subCategories={subCategories} />
      </section>
      <TestimonialCarousel />
    </div>
  )
}

import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'

import Commitments from '@/components/home/shared/Commitments'
import WorkVideo from '@/components/home/shared/WorkVideo'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'

import {
  getCategoriesWithStats,
  getHomepageProducts,
  //   getSubCategories,
} from '@/lib/home/queries/products'
import Hero from './components/Hero'
import StoreStatement from './components/StareStatement'
import MainPageCarousel from './components/MainPageCarousel'
import VideoPin from './components/VideoPin'

export default async function Home() {
  const products = await getHomepageProducts()
  const categories = await getCategoriesWithStats()
  //   const subCategories = await getSubCategories()

  // #eceae8

  return (
    <div className="relative  overflow-hidden bg-[#87431b] w-full h-full items-center justify-items-center min-h-screen mx-auto">
      {/* <div className="sticky w-full h-full top-0 z-20 ">
        <BannerText />
      </div> */}
      {/* <div className=" ">
        <FadeMenu />
      </div> */}
      <Hero />
      <StoreStatement />
      <section className="relative w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <div
          className="isolate  absolute inset-0  !rounded-lg flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
            backgroundImage: 'url(/images/whiteleather.svg)',
            backgroundRepeat: 'repeat',
            // backgroundSize: '280px 450px',
            backgroundBlendMode: 'multiply',
            backgroundColor: '#7e4a28',
            filter: 'drop-shadow(0 0 0.15rem #44291755)',
            boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
          }}
        />
        <h2
          style={{
            textShadow:
              '1px 1px 1px #352e29, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
          }}
          className="isolate text-center text-2xl md:text-3xl font-bold uppercase"
        >
          پرفروش‌ترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="relative w-full h-full flex flex-col gap-8 pt-8 px-3 ">
        <div
          className="  absolute inset-0  !rounded-lg flex flex-col md:flex-row gap-4 mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
            backgroundImage: 'url(/images/whiteleather.svg)',
            backgroundRepeat: 'repeat',
            // backgroundSize: '280px 450px',
            backgroundBlendMode: 'multiply',
            backgroundColor: '#7e4a28',
            filter: 'drop-shadow(0 0 0.15rem #44291755)',
            boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
          }}
        />
        <h2
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #302721, 0 0 0.2px #d3d3d3',
          }}
          className="isolate text-center text-2xl md:text-3xl font-bold uppercase"
        >
          جدیدترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="relative overflow-hidden">
        {/* <WorkVideo /> */}
        <VideoPin />
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

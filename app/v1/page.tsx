// import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'

import TestimonialCarousel from '@/components/home/testemonial/Testemonial'

import // getCategoriesWithStats,
// getHomepageProducts,
//   getSubCategories,
'@/lib/home/queries/products'
// import Hero from './components/Hero'
import StoreStatement from './components/StareStatement'
import MainPageCarousel from './components/MainPageCarousel'
import Commitments from './components/Commitments'
import FixedVideoPlay from './components/FixedMotionVideo'
// import SlideTop from './components/SlideTo'
import SideUp from './components/SideUp'
import HeroLeather from './components/HeroLeather'

// const bestSellersItems = [
//   {
//     id: '1',
//     name: 'small handbag in grained leather',
//     images: '/images/bag.webp',
//     category: 'Juliette',
//     link: '/products/1',
//     price: 750,
//   },
//   {
//     id: '2',
//     name: 'medium handbag with double flap in grained leather',
//     images: '/images/bag-2.webp',
//     category: 'Emilie',
//     link: '/products/1',
//     price: 690,
//   },
//   {
//     id: '3',
//     name: 'Louise small tote bag in grained leather',
//     images: '/images/bag-3.webp',
//     category: 'Louise',
//     link: '/products/1',
//     price: 570,
//   },
//   {
//     id: '4',
//     name: 'medium-sized handbag in grained leather',
//     images: '/images/bag-4.webp',
//     category: 'Emilie',
//     link: '/products/1',
//     price: 580,
//   },
//   {
//     id: '5',
//     name: 'medium handbag in smooth leather and nubuck',
//     images: '/images/bag-5.webp',
//     category: 'Juliette',
//     link: '/products/1',
//     price: 670,
//   },
// ]
export const CollectionItems = [
  {
    id: '1',
    name: 'medium handbag in smooth leather and nubuck',
    images: ['/images/bag-5.webp'],
    category: 'Juliette',
    link: '/',
    price: 670,
    description: 'A medium handbag crafted from smooth leather and nubuck.',
    slug: 'medium-handbag-smooth-leather-nubuck',
    // rating: 4.5,
    // reviewsCount: 12,
    // stock: 10,
    // tags: ['handbag', 'leather', 'nubuck'],
    // isBestSeller: false,
    // isNewArrival: true,
    // isFeatured: false,
    // isSale: false,
    // saleEndDate: null,
    // images: ['/images/bag-5.webp'],
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'medium-sized handbag in grained leather',
    images: ['/images/bag-4.webp'],
    category: 'Emilie',
    link: '/',
    price: 580,

    description: 'A medium-sized handbag made from grained leather.',
    slug: 'medium-sized-handbag-grained-leather',
    // rating: 4.2,
    // reviewsCount: 8,
    // stock: 7,
    // tags: ['handbag', 'grained leather'],
    // isBestSeller: false,
    // isNewArrival: true,
    // isFeatured: false,
    // isSale: false,
    // saleEndDate: null,
    // images: ['/images/bag-4.webp'],
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Louise small tote bag in grained leather',
    images: ['/images/bag-3.webp'],
    category: 'Louise',
    link: '/',
    price: 570,

    description: 'Small tote bag in grained leather from Louise collection.',
    slug: 'louise-small-tote-grained-leather',
    // rating: 4.7,
    // reviewsCount: 15,
    // stock: 5,
    // tags: ['tote', 'grained leather', 'louise'],
    // isBestSeller: false,
    // isNewArrival: true,
    // isFeatured: false,
    // isSale: false,
    // saleEndDate: null,
    // images: ['/images/bag-3.webp'],
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'medium handbag with double flap in grained leather',
    images: ['/images/bag-2.webp'],
    category: 'Emilie',
    link: '/',
    price: 690,
    description: 'Medium handbag with double flap in grained leather.',
    slug: 'medium-handbag-double-flap-grained-leather',
    // rating: 4.3,
    // reviewsCount: 10,
    // stock: 8,
    // tags: ['handbag', 'double flap', 'grained leather'],
    // isBestSeller: false,
    // isNewArrival: true,
    // isFeatured: false,
    // isSale: false,
    // saleEndDate: null,
    // images: ['/images/bag-2.webp'],
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'small handbag in grained leather',
    images: ['/images/bag.webp'],
    category: 'Juliette',
    link: '/',
    price: 750,
    description: 'Small handbag in grained leather from Juliette collection.',
    slug: 'small-handbag-grained-leather',
    // rating: 4.8,
    // reviewsCount: 20,
    // stock: 3,
    // tags: ['handbag', 'grained leather', 'juliette'],
    // isBestSeller: false,
    // isNewArrival: true,
    // isFeatured: false,
    // isSale: false,
    // saleEndDate: null,
    // images: ['/images/bag.webp'],
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  },
]
export default async function Home() {
  // const products = await getHomepageProducts()
  // const categories = await getCategoriesWithStats()
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
      {/* <Hero /> */}
      <HeroLeather />
      <StoreStatement />
      <section className="relative w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <div
          className="isolate   absolute inset-0  !rounded-lg flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b]  outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
            backgroundImage: 'url(/images/whiteleather.svg)',
            backgroundRepeat: 'repeat',
            // backgroundSize: '280px 450px',
            backgroundBlendMode: 'multiply',
            backgroundColor: '#8A3B1D',
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
        <MainPageCarousel items={CollectionItems} />
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
        <MainPageCarousel items={CollectionItems} />
      </section>
      {/* <section className="relative overflow-hidden">
 
        <VideoPin />
      </section> */}

      <FixedVideoPlay
        className="relative h-full w-full min-h-[65vh] flex items-center justify-center "
        videoUrl="/videos/Bags And Small Leather Goods For Women - Le Tanneur.webm"
      >
        <h2
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
          className="text-white w-[60vw] px-4 max-w-sm text-center md:max-w-md mx-auto  text-xl md:text-3xl xl:text-4xl uppercase tracking-[10px] font-light rounded-md"
        >
          loyal Lorem dolor sit ame.
        </h2>
      </FixedVideoPlay>

      <section className="relative pb-4 flex flex-col items-center gap-6 text-3xl text-left">
        <div
          className="isolate  absolute inset-0  !rounded-lg flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
            backgroundImage: 'url(/images/whiteleather.svg)',
            backgroundRepeat: 'repeat',
            // backgroundSize: '280px 450px',
            backgroundBlendMode: 'multiply',
            backgroundColor: '#8A3B1D',
            filter: 'drop-shadow(0 0 0.15rem #44291755)',
            boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
          }}
        />
        <h2
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #302721, 0 0 0.2px #d3d3d3',
          }}
          className="isolate pt-2 adad"
        >
          تعهدات ما{' '}
        </h2>
        <Commitments />
      </section>
      <section className="relative  flex flex-col w-full h-full gap-6 text-3xl text-center py-12 ">
        <div
          className="isolate  absolute inset-0  !rounded-lg flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
          style={{
            textShadow:
              '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
            backgroundImage: 'url(/images/whiteleather.svg)',
            backgroundRepeat: 'repeat',
            // backgroundSize: '280px 450px',
            backgroundBlendMode: 'multiply',
            backgroundColor: '#8A3B1D',
            filter: 'drop-shadow(0 0 0.15rem #44291755)',
            boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
          }}
        />
        <h2 className="uppercase ">بیشتر </h2>
        {/* <DiscoverMoreCarousel categories={categories} /> */}
        <div dir="ltr" className="relative w-full h-full  ">
          {/* <SlideTop /> */}
          <SideUp />
        </div>
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

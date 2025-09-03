'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
// import { HomepageProduct } from '@/lib/types/home'
import Steel from './Steel'
// import Autoplay from 'embla-carousel-autoplay'

export type item = {
  id: string
  name: string
  images: string[]
  category: string
  link: string
  price: number
  description: string
  slug: string
}

type MainPageCarousel = {
  // items: HomepageProduct[]
  items: item[]
}

export default function MainPageCarousel({ items }: MainPageCarousel) {
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        loop: true,
      }}
      // plugins={[
      //   Autoplay({
      //     delay: 3000,
      //   }),
      // ]}
      dir="rtl"
      className="w-full"
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="py-4 pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5" /* Responsive padding and basis */
          >
            <Link
              href={`/products/${item.slug}`}
              className="relative flex flex-col border-none rounded-none bg-transparent gap-2" /* Switched to flex-col for consistent height; moved gap here */
            >
              <div
                className="  absolute inset-0   !rounded-[1.5rem] flex flex-col md:flex-row gap-4 max-w-xl mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
                style={{
                  textShadow:
                    '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
                  backgroundImage: 'url(/images/whiteleather.svg)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '280px 450px',
                  backgroundBlendMode: 'multiply',
                  backgroundColor: '#7e4a28',
                  filter: 'drop-shadow(0 0 0.15rem #44291755)',
                  boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
                }}
              />
              <Steel className="relative w-[90%] h-full pt-2 md:pt-4 mx-auto aspect-square">
                <Image
                  unoptimized
                  // src={item.images.map((img) => img.url)[0]}
                  src={item.images?.[0]}
                  fill
                  alt={item.name}
                  className="object-contain mix-blend-darken  " // Uncommented; remove if not needed
                />
              </Steel>
              {/* <article className="isolate flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base"> */}
              <article
                style={{
                  textShadow:
                    '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
                }}
                className="isolate px-auto  w-full flex flex-col gap-1 justify-evenly py-3  text-white md:text-lg lg:text-base text-base  mx-10"
              >
                {/* <p className="font-semibold  ">{item.subCategory.name}</p> */}
                <p className="font-semibold  ">{item.category}</p>
                <p className="font-bold">{item.name}</p>
                <p>
                  {/* {item.sizes.map((size) =>
                    size.discount ? size.price * size.discount : size.price
                  )} */}
                  {item.price}
                </p>
              </article>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}

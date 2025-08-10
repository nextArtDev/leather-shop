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
import Bag from '../../public/images/bag1.webp'
import Link from 'next/link'

const items = [
  {
    id: '1',
    title: 'First Category',
    link: '/',
    url: '/images/best-femme-us-3jpg.webp',
  },
  {
    id: '2',
    title: 'Second Category',
    link: '/',
    url: '/images/nouvelle-co-hp.webp',
  },
  {
    id: '2',
    title: 'Second Category',
    link: '/',
    url: '/images/discover-women-hp.webp',
  },
  {
    id: '3',
    title: 'Third Category',
    link: '/',
    url: '/images/nouvelle-co-hp.webp',
  },
]
export default function DiscoverMoreCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
      }}
      dir="rtl"
      className="w-full "
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-1/2 md:basis-1/4 xl:basis-1/6 pl-4 mx-auto"
          >
            <div className="w-full min-h-[40vh] h-full aspect-square border-none rounded-none grid grid-rows-1  bg-transparent  ">
              <figure className="relative border-none row-span-5 w-full h-full bg-[#eceae8]  ">
                <Image
                  src={item.url}
                  fill
                  alt=""
                  // className="object-cover mix-blend-darken"
                  className="object-cover"
                />
                <article className="absolute inset-0  z-10 text-2xl font-semibold bg-gradient-to-b from-secondary/5 to-secondary/20 h-full w-full flex  text-center justify-center py-3 items-center px-2 flex-col gap-5 ">
                  {item.title}
                  <Link
                    href={item.link}
                    className="bg-gradient-to-b from-secondary/5 to-secondary/30 backdrop-blur-[2px] border border-none rounded-none  px-1.5 py-1 text-center "
                  >
                    DISCOVER
                  </Link>
                </article>
              </figure>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center max-w-md:hidden cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />{' '}
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2  right-4 " />
    </Carousel>
  )
}

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

export type item = {
  id: string
  link: string
  category: string
  title: string
  price: number
  imageSrc: string
}

type MainPageCarousel = {
  items: item[]
}

export default function MainPageCarousel({ items }: MainPageCarousel) {
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        loop: true, // Added for infinite looping; remove if not wanted
      }}
      dir="rtl"
      className="w-full"
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {/* /* Negative margin to offset item padding   */}
        {items.map((item) => (
          <CarouselItem
            key={item.id} // Changed to item.id for unique keys (item.title might not be unique)
            className="pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5" /* Responsive padding and basis */
          >
            <Link
              href={item.link}
              className="flex flex-col border-none rounded-none bg-transparent gap-4" /* Switched to flex-col for consistent height; moved gap here */
            >
              <figure className="relative w-full aspect-square bg-[#eceae8] border-none rounded-none">
                {' '}
                {/* Fixed aspect-square for uniform image height */}
                <Image
                  src={item.imageSrc}
                  fill
                  alt={item.title}
                  className="object-cover mix-blend-darken" // Uncommented; remove if not needed
                />
              </figure>
              <article className="flex flex-col gap-1 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base">
                <p className="font-semibold">{item.category}</p>
                <p className="font-bold">{item.title}</p>
                <p>${item.price}</p>
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

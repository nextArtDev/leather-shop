'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React from 'react'
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
        loop: true, // Added for infinite looping; remove if not wanted
      }}
      dir="rtl"
      className="w-full"
    >
      <CarouselContent className=" ">
        {/* Consistent negative margin to offset padding */}
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pr-1 basis-1/2 md:basis-1/3 xl:basis-1/4 w-full mx-auto" // Removed mx-auto to avoid centering issues
          >
            <div className="w-full aspect-square bg-transparent">
              {/* Enforces square shape */}
              <figure className="relative w-full h-full bg-[#eceae8] border-none rounded-none">
                <Image
                  src={item.url}
                  fill
                  alt={item.title}
                  className="object-cover " // Uncommented; remove if not needed
                />
                <article className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-secondary/5 to-secondary/20 px-2 py-3 text-center text-2xl font-semibold text-background">
                  {item.title}
                  <Link
                    href={item.link}
                    className="bg-gradient-to-b from-secondary/5 to-secondary/30 border-none rounded-none px-1.5 py-1 text-center text-sm backdrop-blur-[2px]"
                  >
                    DISCOVER
                  </Link>
                </article>
              </figure>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

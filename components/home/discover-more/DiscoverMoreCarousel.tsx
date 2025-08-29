'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
// import { CategoryWithStats } from '@/lib/types/home'
import Autoplay from 'embla-carousel-autoplay'
// import { SubCategory } from '@/lib/generated/prisma'
import { SubCategoryForHomePage } from '@/lib/types/home'

// const items = [
//   {
//     id: '1',
//     title: 'First Category',
//     link: '/',
//     url: '/images/best-femme-us-3jpg.webp',
//   },
//   {
//     id: '2',
//     title: 'Second Category',
//     link: '/',
//     url: '/images/nouvelle-co-hp.webp',
//   },
//   {
//     id: '2',
//     title: 'Second Category',
//     link: '/',
//     url: '/images/discover-women-hp.webp',
//   },
//   {
//     id: '3',
//     title: 'Third Category',
//     link: '/',
//     url: '/images/nouvelle-co-hp.webp',
//   },
// ]

export default function DiscoverMoreCarousel({
  subCategories,
}: {
  subCategories: SubCategoryForHomePage[]
}) {
  return (
    <section className="w-full h-full">
      <Carousel
        opts={{
          align: 'start',
          direction: 'rtl',
          loop: true, // Added for infinite looping; remove if not wanted
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        dir="rtl"
        className="w-full"
      >
        <CarouselContent className=" ">
          {subCategories.map((item) => (
            <CarouselItem
              key={item.id}
              className="pr-1 basis-1/2 md:basis-1/3 xl:basis-1/4 w-full mx-auto" // Removed mx-auto to avoid centering issues
            >
              <div className="w-full aspect-square bg-transparent">
                {/* Enforces square shape */}
                <figure className="relative w-full h-full bg-[#eceae8] border-none rounded-none">
                  <Image
                    src={item.images.map((img) => img.url)[0]}
                    fill
                    alt={item.name}
                    className="object-cover " // Uncommented; remove if not needed
                  />
                  <article className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-secondary/5 to-secondary/20 px-2 py-3 text-center text-2xl font-semibold text-background">
                    {item.name}
                    <Link
                      href={`/sub-categories/${item.url}`}
                      className="bg-gradient-to-b from-secondary/5 to-secondary/30 border rounded-none px-1.5 py-1 text-center text-base  backdrop-blur-[2px]"
                    >
                      دیدن {item.name}
                    </Link>
                  </article>
                </figure>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}

'use client' // Added if not present in parent; required for client components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import React from 'react'

const items = [
  {
    id: '1',
    title: 'Full-grain leather',
    description:
      'At Le Tanneur, we passionately source the finest materials and use full-grain leather, the noblest part, perfected over 125 years. Our leather is 100% certified by the Leather Working Group (LWG), and we aim for all our products to be certified by 2025.',
    url: '/images/commit1.webp',
  },
  {
    id: '2',
    title: 'An ethical production',
    description:
      'Le Tanneur’s partner workshops in Europe, North Africa, and Asia follow our Ethical Charter. Each season, we prioritize production in our French workshops and offer collections like Sans Couture, Louise, and Madeleine, all crafted in France.',
    url: '/images/commit2.webp',
  },
  {
    id: '3',
    title: 'Our engagements',
    description:
      'Le Tanneur uses recycled materials with full-grain leather for durable pieces. Leather scraps are repurposed for watch and jewelry boxes, mostly made from recycled leather. All packaging is made from recycled and recyclable materials, using FSC and PEFC certified paper and solvent-free vegetable-based inks, ensuring sustainability.',
    url: '/images/commit3.jpg',
  },
]

export default function Commitments() {
  return (
    <Carousel
      opts={{
        align: 'start',
        // loop: true, // Added for infinite looping; remove if not wanted
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-1 md:-ml-2 xl:-ml-4">
        {/* Responsive negative margin to offset item padding */}
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-1 basis-1/2 md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5"
            /* Adjusted basis for better fit (e.g., 2 on mobile, 3 on md, 4 on lg, 5 on xl); made padding responsive */
          >
            <div className="flex flex-col border-none rounded-none gap-4">
              {/* Moved gap-4 here to space image and text */}
              <figure className="relative w-full aspect-square bg-[#eceae8] border-none rounded-none">
                {/* Changed to figure for semantic; simplified, removed min-h to let aspect-square handle */}
                <Image
                  src={item.url}
                  fill
                  alt={item.title}
                  className="object-cover mix-blend-darken" // Uncommented; remove if not needed
                />
              </figure>
              <article className="flex flex-col gap-3 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base">
                <p className="font-bold text-lg text-left">{item.title}</p>
                <p className="text-sm">{item.description}</p>
              </article>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 right-4" />
    </Carousel>
  )
}

'use client' // Added if not present in parent; required for client components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
// import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import React from 'react'
import Steel from './Steel'

const items = [
  {
    id: '1',
    title: 'Full-grain leather',
    description:
      'At Le Tanneur, we passionately source the finest materials and use full-grain leather.',
    url: '/images/commit1.webp',
  },
  {
    id: '2',
    title: 'An ethical production',
    description:
      'Le Tanneur’s partner workshops in Europe, North Africa, and Asia follow our Ethical Charter. ',
    url: '/images/commit2.webp',
  },
  {
    id: '3',
    title: 'Our engagements',
    description:
      'Le Tanneur uses recycled materials with full-grain leather for durable pieces. Leather scraps.',
    url: '/images/commit3.jpg',
  },
]

export default function Commitments() {
  return (
    <Carousel
      opts={{
        align: 'start',
        direction: 'rtl',
        // loop: true, // Added for infinite looping; remove if not wanted
      }}
      // plugins={[
      //   Autoplay({
      //     delay: 3000,
      //   }),
      // ]}
      dir="rtl"
      className="w-full "
    >
      <CarouselContent className=" ">
        {/* Responsive negative margin to offset item padding */}
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pr-1 mx-auto basis    md:pl-2 md:basis-1/3 lg:basis-1/4 xl:pl-4 xl:basis-1/5"
          >
            <div className="relative flex flex-col border-none rounded-none gap-4">
              <div
                className="  absolute inset-0   !rounded-lg flex flex-col md:flex-row gap-4 max-w-xl mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
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
              {/* Moved gap-4 here to space image and text */}
              <Steel className="relative w-[90%] h-full pt-2 md:pt-4 mx-auto aspect-square px-1">
                <Image
                  src={item.url}
                  fill
                  alt={item.title}
                  className="object-contain mix-blend-darken  " // Uncommented; remove if not needed
                />
              </Steel>
              <article
                style={{
                  textShadow:
                    '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
                }}
                className="isolate ml-2 text-white flex flex-col gap-3 justify-evenly py-3 px-2 text-pretty text-base md:text-lg lg:text-xl"
              >
                <p className="font-bold   text-left">{item.title}</p>
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

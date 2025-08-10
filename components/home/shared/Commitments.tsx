import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
        direction: 'rtl',
      }}
      dir="rtl"
      className="w-full "
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-1/2 md:basis-1/4 xl:basis-1/6 pl-0.5 gap-4 mx-auto"
          >
            <div className=" border-none rounded-none">
              <article className="relative border-none min-h-[20vh] md:min-h-[30vh] aspect-square row-span-5 w-full h-full bg-[#eceae8]  ">
                <Image
                  src={item.url}
                  fill
                  alt=""
                  // className="object-cover mix-blend-darken"
                  className="object-cover "
                />
              </article>
              <article className="  h-full w-full flex flex-col gap-3 justify-evenly py-3 px-2 text-pretty text-xs md:text-sm lg:text-base">
                <p className="font-bold text-lg text-left">{item.title}</p>

                <p className="text-sm">{item.description}</p>
              </article>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center max-w-md:hidden cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />{' '}
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2  right-4 " />
    </Carousel>
  )
}

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
      }}
      dir="rtl"
      className="w-full "
    >
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.title}
            className="basis-1/2 md:basis-1/4 xl:basis-1/6 pl-0.5 mx-auto"
          >
            <Link
              href={item.link}
              className=" border-none rounded-none grid grid-rows-7 place-content-center bg-transparent  "
            >
              <article className="place-content-center border-none relative row-span-5 w-full h-full bg-[#eceae8]  ">
                <Image
                  src={item.imageSrc}
                  fill
                  alt=""
                  // className="object-cover mix-blend-darken"
                  className="object-cover "
                />
              </article>
              <article className="row-span-2 min-h-[100px] sm:min-h-[120px] md:h-[150] xl:min-h-[150px] h-full w-full flex flex-col gap-1 justify-evenly py-3 items-start px-2 text-pretty text-xs md:text-sm lg:text-base">
                <p className="font-semibold">{item.category}</p>

                <p className="font-bold">{item.title}</p>
                <p>${item.price}</p>
              </article>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center max-w-md:hidden cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />{' '}
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2  right-4 " />
    </Carousel>
  )
}

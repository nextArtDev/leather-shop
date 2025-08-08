import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import React from 'react'

export default function CarouselWithMultipleSlides() {
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
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 md:basis-1/3 lg:basis-1/4 "
          >
            <div className="p-0">
              <Card className="rounded-none ">
                <CardContent className="flex aspect-square items-center justify-center bg-red-500 ">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex items-center justify-center max-w-md:hidden cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2 left-2" />{' '}
      <CarouselNext className="hidden lg:flex items-center justify-center cursor-pointer size-12 bg-background/30 backdrop-blur-sm border-none top-1/2 -translate-y-1/2  right-4 " />
    </Carousel>
  )
}

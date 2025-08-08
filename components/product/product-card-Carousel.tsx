'use client'
import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'

const ProductCardCarousel = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap()) // Use 0-based index for simplicity

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    // We add a relative class to this parent div to position the indicators
    <div className="relative w-full">
      <Carousel
        setApi={setApi} // Pass the setApi function to the Carousel
        opts={{
          align: 'start',
          loop: true, // often a good idea for product carousels
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="-pl-1  ">
              <div className="p-1">
                <Card className="rounded-none">
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicator Container */}
      <div className="absolute bottom-1 left-2 flex w-[96%] mx-auto items-center gap-x-0.5">
        {/* Note: gap-x-0.5 is typically 2px in Tailwind's default config */}
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-0.25 flex-1 rounded-full', // flex-1 is the key for full-width
              current === index ? 'bg-muted-foreground' : '', // Active/inactive colors
              'transition-colors duration-200 ease-in-out' // Smooth color transition
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductCardCarousel

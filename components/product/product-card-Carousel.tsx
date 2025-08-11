'use client'
import * as React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const ProductCardCarousel = ({ urls }: { urls: string[] }) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        className=" w-full"
      >
        <CarouselContent>
          {urls.map((url, index) => (
            <CarouselItem
              key={index}
              className="flex items-center justify-center pl-1 "
            >
              <figure className="relative h-full w-full bg-[#eceae8]">
                {' '}
                {/* Fixed aspect ratio for consistent height */}
                <Image
                  src={url}
                  width={352}
                  height={320}
                  alt={`Product image ${index + 1}`}
                  className="object-cover mix-blend-darken" // Uncommented; remove if not needed
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute -bottom-2.5 sm:bottom-0 left-2 flex w-[96%] mx-auto items-center gap-x-0.5">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'h-0.25 flex-1 rounded-full',
              current === index ? 'bg-muted-foreground' : '',
              'transition-colors duration-200 ease-in-out'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductCardCarousel

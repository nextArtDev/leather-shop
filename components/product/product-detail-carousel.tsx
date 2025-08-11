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
import Autoplay from 'embla-carousel-autoplay'

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[]
}

const ProductDetailCarousel = ({ images }: Props) => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])
  return (
    <section className="relative w-fit   mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: true }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        orientation="vertical"
        className="relative w-full mx-auto"
      >
        <CarouselContent className="-mt-1 h-[348px] md:h-[60vh]  mx-auto ">
          {images.map((image) => (
            <CarouselItem
              key={image.id}
              className="flex items-center justify-center min-w-[94vw] h-full   "
            >
              <article className=" border-none relative w-full mx-auto h-full bg-[#eceae8]  ">
                <Image
                  src={image.url}
                  fill
                  alt=""
                  // className="object-cover mix-blend-darken"
                  className="object-cover "
                />
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> <CarouselNext /> */}
        <div className="absolute top-1/3 left-3  w-fit mt-4  flex flex-col items-center justify-between gap-2">
          {' '}
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn('h-0.5 w-0.5 bg-foreground/40', {
                'h-1 w-1 bg-foreground': current === index + 1,
              })}
            />
          ))}{' '}
        </div>
      </Carousel>
    </section>
  )
}

export default ProductDetailCarousel

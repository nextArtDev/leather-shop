'use client'
import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
type Props = {}

const ProductDetailCarousel = (props: Props) => {
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
    <section className="relative w-fit min-w-xs  mx-auto">
      <Carousel
        setApi={setApi}
        opts={{ align: 'start' }}
        orientation="vertical"
        className=" w-full max-w-xs aspect-square "
      >
        <CarouselContent className="-mt-1 h-[300px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 !h-[300px] ">
              <div className="p-1">
                <Card className="rounded-none">
                  <CardContent className="!h-[235px] flex items-center justify-center p-0">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious /> <CarouselNext /> */}
      </Carousel>
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
    </section>
  )
}

export default ProductDetailCarousel

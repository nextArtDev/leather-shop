'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel' // Adjusted path
import { cn } from '@/lib/utils'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'

// Using the detailed product type you provided
type Product = {
  id: string
  name: string
  slug: string
  brand: string
  rating: number
  sales: number
  numReviews: number
  isSale: boolean
  saleEndDate: string | null
  images: { url: string }[]
  variantImages: { url: string }[]
  sizes: {
    size: string
    quantity: number
    price: number
    discount: number
  }[]
  colors: { name: string }[]
  category: { name: string; url: string }
  subCategory: { name: string; url: string }
}

type Props = {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  const imageUrls = React.useMemo(
    () => [
      ...(product.images?.map((img) => img.url) || []),
      ...(product.variantImages?.map((img) => img.url) || []),
    ],
    [product.images, product.variantImages]
  )

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <section>
      <div className="w-full aspect-square relative">
        {!imageUrls || imageUrls.length === 0 ? (
          <div className="w-full h-full bg-[#eceae8] flex items-center justify-center">
            <p className="text-gray-500 text-xs">بدون عکس</p>
          </div>
        ) : (
          <Link href={`/products/${product.slug}`} className="my-6">
            <Carousel
              opts={{
                align: 'start',
                direction: 'rtl',
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              dir="rtl"
              setApi={setApi}
              className="w-full h-full"
            >
              <CarouselContent className="">
                {imageUrls.map((url) => (
                  <CarouselItem key={url}>
                    <Card className="h-full w-full border-none rounded-none bg-[#eceae8] p-0">
                      <CardContent className="relative flex aspect-square items-center justify-center p-0 h-full">
                        <Image
                          src={url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {count > 1 && (
              <div className="absolute -bottom-[1px] left-0.25 right-0.25 flex items-center gap-x-0.5 z-10">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={cn(
                      'h-0.25 md:h-[1.5px] flex-1 rounded-full',
                      current === index
                        ? 'bg-muted-foreground'
                        : 'bg-muted-foreground/30',
                      'transition-colors duration-200 ease-in-out'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </Link>
        )}
      </div>

      {/* The rest of your card details */}
      <div className="pt-2 pb-4">
        <div className="flex flex-col gap-1 items-start px-2 text-pretty text-xs md:text-sm">
          <p className="font-semibold">{product.category.name}</p>
          <p className="font-bold">{product.name}</p>
          <p>تومان {product.sizes[0]?.price}</p>
          <div className="flex gap-0.5 items-center">
            {product.colors?.map((clr) => (
              <span
                style={{ background: clr.name }}
                key={clr.name}
                className="size-3 border" // Added border for light colors
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductCard

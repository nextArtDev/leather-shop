import React from 'react'
import { Card, CardContent } from '../ui/card'
import ProductCardCarousel from './product-card-Carousel'

type Props = {}

const ProductCard = (props: Props) => {
  return (
    <div>
      <div className=" border-none rounded-none grid grid-rows-7 place-content-center bg-transparent gap-1 ">
        <article className=" row-span-5 w-full h-full bg-[#eceae8]  ">
          <ProductCardCarousel />
        </article>
        <article className="row-span-2  h-full w-full flex flex-col gap-1 justify-evenly  items-start px-2 text-pretty text-xs md:text-sm lg:text-base">
          <p className="font-semibold">Emilie</p>

          <p className="font-bold">
            Emilie medium-sized handbag in grained leather
          </p>
          <p>$690.00</p>
          <div className="flex gap-0.5 items-center justify-center">
            <span className="size-3 bg-amber-800"></span>
            <span className="size-3 bg-black"></span>
            <span className="size-3 bg-orange-950"></span>
          </div>
        </article>
      </div>
    </div>
  )
}

export default ProductCard

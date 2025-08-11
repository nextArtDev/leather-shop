import React from 'react'
import ProductCardCarousel from './product-card-Carousel'

type Props = {
  item: {
    id: string
    title: string
    imageSrc: string[]
    category: string
    link: string
    price: number
    colors: string[]
  }
}

const ProductCard = ({ item }: Props) => {
  return (
    <div>
      <div className=" border-none rounded-none grid grid-rows-7   place-content-center bg-transparent ">
        <article className=" row-span-5 w-full h-full bg-[#eceae8]  ">
          <ProductCardCarousel urls={item.imageSrc} />
        </article>
        <article className="row-span-2  h-full w-full flex flex-col gap-1 justify-evenly  items-start px-2 text-pretty text-xs md:text-sm lg:text-base">
          <p className="font-semibold">{item.category}</p>

          <p className="font-bold">{item.title}</p>
          <p>${item.price}</p>
          <div className="flex gap-0.5 items-center justify-center">
            {item.colors?.map((clr) => (
              <span
                style={{ background: clr }}
                key={clr}
                className="size-3 "
              ></span>
            ))}
            {/* <span className="size-3 bg-black"></span>
            <span className="size-3 bg-orange-950"></span> */}
          </div>
        </article>
      </div>
    </div>
  )
}

export default ProductCard

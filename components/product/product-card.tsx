import React from 'react'
import ProductCardCarousel from './product-card-Carousel'

type Props = {
  // item: {
  //   id: string
  //   title: string
  //   imageSrc: string[]
  //   category: string
  //   link: string
  //   price: number
  //   colors: string[]
  // }
  product: {
    id: string
    name: string
    slug: string
    brand: string
    rating: number
    sales: number
    numReviews: number
    isSale: boolean
    saleEndDate: string | null
    images: {
      url: string
    }[]
    variantImages: {
      url: string
    }[]
    sizes: {
      size: string
      quantity: number
      price: number
      discount: number
    }[]
    colors: {
      name: string
    }[]
    category: {
      name: string
      url: string
    }
    subCategory: {
      name: string
      url: string
    }
  }
}

const ProductCard = ({ product }: Props) => {
  console.log('itemitem', { product })
  const imageUrls = [
    ...product?.variantImages.map((img) => img.url),
    ...product?.images.map((img) => img.url),
  ]
  return (
    <div>
      <div className=" border-none rounded-none grid grid-rows-7   place-content-center bg-transparent ">
        <article className=" row-span-5 w-full h-full bg-[#eceae8]  ">
          <ProductCardCarousel urls={imageUrls} />
        </article>
        <article className="row-span-2  h-full w-full flex flex-col gap-1 justify-evenly  items-start px-2 text-pretty text-xs md:text-sm lg:text-base">
          <p className="font-semibold">{product.category.name}</p>

          <p className="font-bold">{product.name}</p>
          <p>تومان{product.sizes.map((s) => s.price)[0]}</p>
          <div className="flex gap-0.5 items-center justify-center">
            {product.colors?.map((clr) => (
              <span
                style={{ background: clr.name }}
                key={clr.name}
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

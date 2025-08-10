import React from 'react'
import bag from '../../../public/images/bag.webp'
import bag2 from '../../../public/images/bag1.webp'
import bag3 from '../../../public/images/hero-image.jpg'
import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import ProductDetails from '@/components/product/product-detail/ProductDetails'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'
import ProductDescriptions from '@/components/product/product-detail/ProductDescriptions'

type Props = {}

const images = [
  { id: '1', url: bag },
  { id: '2', url: bag2 },
  { id: '3', url: bag3 },
]
const ProductPage = (props: Props) => {
  return (
    <section className="max-w-2xl md:mx-auto pb-24 w-full h-full flex flex-col gap-4">
      <ProductDetailCarousel images={images} />
      <ProductDetails />
      <AddToCardBtn />
      <span className="text-green-600 flex gap-1 text-sm items-center">
        <span className="w-2 h-2 animate-pulse rounded-full bg-green-600"></span>{' '}
        In Stuck
      </span>
      <ProductDescriptions />
    </section>
  )
}

export default ProductPage

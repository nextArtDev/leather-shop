import React from 'react'
import bag from '../../../../public/images/bag.webp'
import bag2 from '../../../../public/images/bag1.webp'
import bag3 from '../../../../public/images/hero-image.jpg'
import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import ProductDetails from '@/components/product/product-detail/ProductDetails'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'
import ProductDescriptions from '@/components/product/product-detail/ProductStatemeents'

import { Separator } from '@/components/ui/separator'
// import MainPageCarousel from '@/components/product/main-page-carousel'

const images = [
  { id: '1', url: bag },
  { id: '2', url: bag2 },
  { id: '3', url: bag3 },
]
// const bestSellersItems = [
//   {
//     id: '1',
//     title: 'small handbag in grained leather',
//     imageSrc: '/images/bag.webp',
//     category: 'Juliette',
//     link: '/products',
//     price: 750,
//   },
//   {
//     id: '2',
//     title: 'medium handbag with double flap in grained leather',
//     imageSrc: '/images/bag-2.webp',
//     category: 'Emilie',
//     link: '/products',
//     price: 690,
//   },
//   {
//     id: '3',
//     title: 'Louise small tote bag in grained leather',
//     imageSrc: '/images/bag-3.webp',
//     category: 'Louise',
//     link: '/products',
//     price: 570,
//   },
//   {
//     id: '4',
//     title: 'medium-sized handbag in grained leather',
//     imageSrc: '/images/bag-4.webp',
//     category: 'Emilie',
//     link: '/products',
//     price: 580,
//   },
//   {
//     id: '5',
//     title: 'medium handbag in smooth leather and nubuck',
//     imageSrc: '/images/bag-5.webp',
//     category: 'Juliette',
//     link: '/products',
//     price: 670,
//   },
// ]
const ProductPage = () => {
  return (
    <section className="pb-24 w-full h-full">
      <div className="max-w-2xl px-4 mx-auto  flex flex-col gap-4">
        <ProductDetailCarousel images={images} />
        <ProductDetails />
        <AddToCardBtn />
        <span className="text-green-600 flex gap-1 text-sm items-center">
          <span className="w-2 h-2 animate-pulse rounded-full bg-green-600"></span>{' '}
          In Stuck
        </span>
        <ProductDescriptions />
        <Separator />
      </div>
      <section className="  flex gap-6 flex-col justify-center items-center py-8">
        <h2 className="font-bold text-2xl ">You may also like</h2>
        {/* <MainPageCarousel items={bestSellersItems} /> */}
      </section>
    </section>
  )
}

export default ProductPage

import React from 'react'
import MainPageCarousel from './main-page-carousel'

type Props = {}

const RelatedProducts = (props: Props) => {
  return (
    <section className="container flex gap-6 flex-col items-start">
      <h2 className="font-bold text-2xl ">You may also like</h2>
      <MainPageCarousel />
    </section>
  )
}

export default RelatedProducts

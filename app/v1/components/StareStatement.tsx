import React from 'react'
import ScrollText from './ScrollText'

const StoreStatement = () => {
  const scrollText = {
    eyebrow: 'French Savoir-faire since 1898',
    text: ' Since 1898, we have been dreaming up, designing and crafting premium and essential bags and accessories that have stood the test of the years, with their truly timeless design.',
  }
  return (
    <section className=" relative w-full mx-auto">
      <ScrollText scrollText={scrollText} />
    </section>
  )
}

export default StoreStatement

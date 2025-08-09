import React from 'react'
import ProductCard from './product-card'

type Props = {}

function ProductGrid({}: Props) {
  return (
    <div className="w-full h-full grid grid-cols-2">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  )
}

export default ProductGrid

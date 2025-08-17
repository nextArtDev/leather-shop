import { getProductDetails } from '@/lib/home/queries/products'
import { notFound } from 'next/navigation'
import React from 'react'
import ProductPage from '../components/ProductPage'

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params

  const product = await getProductDetails(slug)
  if (!product) notFound()
  // console.log(product)
  return (
    <div>
      <ProductPage data={product} />
    </div>
  )
}

export default ProductDetailsPage

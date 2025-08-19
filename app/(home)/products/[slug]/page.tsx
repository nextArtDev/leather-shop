import { getProductDetails } from '@/lib/home/queries/products'
import { notFound } from 'next/navigation'
import React from 'react'
import ProductPage from '../components/ProductPage'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params

  const product = await getProductDetails(slug)
  if (!product) notFound()
  const user = await currentUser()

  const userReview = await prisma.review.findFirst({
    where: {
      productId: product.id,
      userId: user?.id,
    },
  })
  // console.log(product)
  return (
    <div>
      <ProductPage
        data={product}
        reviews={product.reviews}
        numReviews={product.numReviews}
        userId={!!user?.id ? user.id : null}
        userReview={userReview}
      />
    </div>
  )
}

export default ProductDetailsPage

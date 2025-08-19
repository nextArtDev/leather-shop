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

  const productAverageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true,
    where: { productId: product.id, isPending: false },
  })

  // console.log(productAverageRating)
  return (
    <div>
      <ProductPage
        data={product}
        productAverageRating={
          !!productAverageRating._avg.rating && !!productAverageRating._count
            ? {
                rating: productAverageRating._avg.rating,
                count: productAverageRating._count,
              }
            : null
        }
        reviews={product.reviews}
        userId={!!user?.id ? user.id : null}
        userReview={userReview}
      />
    </div>
  )
}

export default ProductDetailsPage

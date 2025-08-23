import { getProductDetails } from '@/lib/home/queries/products'
import { notFound } from 'next/navigation'
import React from 'react'
import ProductPage from '../components/ProductPage'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ProductDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    sizeId: string
    page: string
    // sort: string
    // rating: string
  }>
}) => {
  // const page = Number((await searchParams).page) || 1
  // const pageSize = 4

  const slug = (await params).slug
  const searchParamsSizeId = (await searchParams).sizeId

  const product = await getProductDetails(slug)
  if (!product) notFound()

  const sizeId =
    product.sizes.find((s) => s.id === searchParamsSizeId)?.id ||
    product.sizes?.[0].id ||
    searchParamsSizeId

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
        sizeId={sizeId}
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

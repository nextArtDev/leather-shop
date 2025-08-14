import prisma from '@/lib/prisma'

import { notFound } from 'next/navigation'
import ProductForm from '../components/product-details'
import { getAllOfferTags, getCategoryList } from '../../../lib/queries'

export default async function SellerNewProductPage({
  params,
}: // searchParams,
{
  params: Promise<{ productId: string }>
  // searchParams: Promise<{ categoryId: string }>
}) {
  const productId = (await params).productId
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      images: { select: { url: true } },
      specs: { select: { name: true, value: true, id: true } },
      questions: { select: { question: true, answer: true, id: true } },
      category: { select: { name: true, id: true } },
      freeShipping: {
        select: {
          eligibleCities: true,
          id: true,
        },
      },
    },
  })
  if (!product) return notFound()
  const categories = await getCategoryList()
  // console.log({ categories })

  const offerTags = await getAllOfferTags()
  const provinces = await prisma.province.findMany({
    orderBy: {
      name: 'asc',
    },
  })
  // Convert null fields to undefined for compatibility with ProductWithVariantType
  // const productWithUndefined = {
  //   ...product,
  //   offerTagId: product.offerTagId ?? undefined,
  //   // Add similar lines for other possibly-null fields if needed
  // }
  // console.log({ productWithUndefined })
  return (
    <div className="w-full">
      <ProductForm
        categories={categories}
        offerTags={offerTags}
        data={product}
        provinces={provinces}
      />
    </div>
  )
}

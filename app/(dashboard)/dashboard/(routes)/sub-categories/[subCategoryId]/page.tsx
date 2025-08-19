import { notFound } from 'next/navigation'
import SubCategoryDetails from '../components/sub-category-details'
import prisma from '@/lib/prisma'

export default async function EditSubCategoryPage({
  params,
}: {
  params: Promise<{ subcategoryId: string }>
}) {
  const subcategoryId = (await params).subcategoryId

  const subcategory = await prisma.subCategory.findFirst({
    where: {
      id: subcategoryId,
    },
    include: {
      images: true,
      category: true,
    },
  })
  const categories = await prisma.category.findMany({})

  if (!subcategory) return notFound()
  return (
    <div>
      <SubCategoryDetails categories={categories} initialData={subcategory} />
    </div>
  )
}

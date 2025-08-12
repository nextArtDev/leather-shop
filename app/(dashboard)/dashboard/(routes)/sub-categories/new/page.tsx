// import { prisma } from '@/lib/prisma'
// import { notFound } from 'next/navigation'

import SubCategoryDetails from '../components/sub-category-details'

export default async function AdminNewSubCategoryPage() {
  // const categories = await prisma.category.findMany({
  //   where: {},
  //   select: {
  //     name: true,
  //     id: true,
  //   },
  // })
  // if (!categories) return notFound()
  return (
    <div className="w-full">
      <SubCategoryDetails />
    </div>
  )
}

import { Plus } from 'lucide-react'
import DataTable from '../../components/data-table'
import { getAllSubCategories } from '../../lib/queries'
import SubCategoryDetails from './components/sub-category-details'

import prisma from '@/lib/prisma'
import { columns } from './components/columns'
import { Suspense } from 'react'
export default async function AdminSubCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const asyncPage = (await searchParams).page
  const page = asyncPage ? +asyncPage : 1

  const subCategoriesResponse = await getAllSubCategories({ page })
  const categories = await prisma.category.findMany({
    where: {},
    select: {
      name: true,
      id: true,
    },
  })

  if (!subCategoriesResponse.subCategories) return null
  // const columns = getColumns(categories)
  const dataWithCategories = subCategoriesResponse.subCategories.map(
    (subCategory) => ({
      ...subCategory,
      categories,
    })
  )
  return (
    <section className="px-1">
      <Suspense>
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              ایجاد زیردسته‌بندی
            </>
          }
          modalChildren={<SubCategoryDetails categories={categories} />}
          newTabLink="/dashboard/sub-categories/new"
          filterValue="name"
          data={dataWithCategories}
          searchPlaceholder="جست و جوی زیردسته‌ها با نام "
          columns={columns}
        />
      </Suspense>
    </section>
  )
}

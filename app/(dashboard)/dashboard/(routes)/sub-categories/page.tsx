import { Plus } from 'lucide-react'
import { getAllSubCategories } from '@/lib/queries/dashboard'
import DataTable from '../../components/data-table'
// import { prisma } from '@/lib/prisma'
export default async function AdminSubCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const asyncPage = (await searchParams).page
  const page = asyncPage ? +asyncPage : 1

  // Fetching stores data from the database
  const subCategoriesResponse = await getAllSubCategories({ page })
  // const categories = await prisma.category.findMany({})
  // console.log(subCategoriesResponse.subCategories)

  // Checking if no categories are found
  if (!subCategoriesResponse.subCategories) return null // If no categories found, return null

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create category
        </>
      }
      modalChildren={<SubCategoryDetails />}
      newTabLink="/dashboard/admin/sub-categories/new"
      filterValue="name"
      data={subCategoriesResponse.subCategories}
      searchPlaceholder="Search sub category name..."
      columns={columns}
    />
  )
}

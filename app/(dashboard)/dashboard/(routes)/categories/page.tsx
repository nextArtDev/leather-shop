import { Plus } from 'lucide-react'
import { columns } from './components/columns'
import DataTable from '../../components/data-table'
import CategoryDetails from './components/category-details'
import { getAllCategories } from '../../lib/queries'
import { Suspense } from 'react'

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const asyncPage = (await searchParams).page
  const page = asyncPage ? +asyncPage : 1

  // Fetching stores data from the database
  const categoriesResponse = await getAllCategories({ page })
  // console.log(categoriesResponse.categories)

  // Checking if no categories are found
  if (!categoriesResponse.categories) return null // If no categories found, return null

  return (
    <Suspense>
      <div className="px-1">
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              ایجاد دسته‌بندی
            </>
          }
          modalChildren={<CategoryDetails />}
          newTabLink="/dashboard/categories/new"
          filterValue="name"
          data={categoriesResponse.categories}
          searchPlaceholder="جست‌وجو..."
          columns={columns}
        />
      </div>
    </Suspense>
  )
}

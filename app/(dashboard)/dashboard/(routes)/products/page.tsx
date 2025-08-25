import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import DataTable from '../../components/data-table'
import {
  getAllOfferTags,
  getAllProductsList,
  getCategoryList,
} from '../../lib/queries'
import { columns } from './components/columns'
import ProductDetails from './components/product-details'
import { Suspense } from 'react'

export default async function ProductsPage() {
  const products = await getAllProductsList()
  if (!products) return notFound()

  const categories = await getCategoryList()
  const offerTags = await getAllOfferTags()

  return (
    <div className="w-full px-1">
      <Suspense>
        <DataTable
          actionButtonText={
            <>
              <Plus size={15} />
              ایجاد محصول
            </>
          }
          modalChildren={
            <ProductDetails categories={categories} offerTags={offerTags} />
          }
          newTabLink={`/dashboard/products/new`}
          filterValue="name"
          data={products}
          columns={columns}
          searchPlaceholder="جست‌وجوی نام محصول..."
        />
      </Suspense>
    </div>
  )
}

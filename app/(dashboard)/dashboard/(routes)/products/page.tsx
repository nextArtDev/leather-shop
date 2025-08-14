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

export default async function ProductsPage() {
  // Fetching products data from the database for the active store
  const products = await getAllProductsList()
  if (!products) return notFound()
  //   // console.log({ products })

  const categories = await getCategoryList()
  const offerTags = await getAllOfferTags()

  return (
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
  )
}

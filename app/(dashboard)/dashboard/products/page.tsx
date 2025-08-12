import { Prisma } from '@/lib/generated/prisma'
import { Plus } from 'lucide-react'

import { notFound } from 'next/navigation'
import DataTable from '../components/data-table'

export default async function SellerProductsPage({
  params,
}: {
  params: Promise<{ storeUrl: string }>
}) {
  const storeUrl = (await params).storeUrl
  // Fetching products data from the database for the active store
  //   const products = await getAllStoreProducts(storeUrl)
  //   if (!products) return notFound()
  //   // console.log({ products })

  //   const categories = await getAllCategories({})
  //   const offerTags = await getAllOfferTags()

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Create product
        </>
      }
      modalChildren={
        <ProductDetails
          categories={categories.categories}
          offerTags={offerTags}
          storeUrl={storeUrl}
          countries={countries}
        />
      }
      newTabLink={`/dashboard/seller/stores/${storeUrl}/products/new`}
      filterValue="name"
      data={products}
      columns={columns}
      searchPlaceholder="Search product name..."
    />
  )
}

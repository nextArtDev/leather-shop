import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns-jalali'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DataTable } from '../../components/shared/DataTable'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { Heading } from '../../components/shared/Heading'
import { getAllProductsList } from '../../lib/queries'
import { columns, ProductColumn } from './components/columns'

function ProductDataTable({
  formattedProduct,
  page,
  pageSize,
  isNext,
}: {
  formattedProduct: ProductColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="name"
      columns={columns}
      data={formattedProduct}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const products = await getAllProductsList({ page, pageSize })
  if (!products) return notFound()

  const formattedProduct: ProductColumn[] = products.products?.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    subCategory: item.subCategory,
    offerTag: item?.offerTag,
    colors: item.colors,
    sizes: item.sizes,
    images: item.images,
    category: item.category,
    featured: item.isFeatured,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`محصولات (${formattedProduct?.length})`}
          description="محصولات را مدیریت کنید."
        />
        <Link href={`/dashboard/products/new`} className={cn(buttonVariants())}>
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!products.products?.length && !!formattedProduct && (
            <ProductDataTable
              formattedProduct={formattedProduct}
              page={page}
              pageSize={pageSize}
              isNext={products?.isNext}
            />
          )}
        </Suspense>
      </div>
    </div>
    // <div className="w-full px-1">
    //   <Suspense>
    //     <DataTable
    //       actionButtonText={
    //         <>
    //           <Plus size={15} />
    //           ایجاد محصول
    //         </>
    //       }
    //       modalChildren={
    //         <ProductDetails categories={categories} offerTags={offerTags} />
    //       }
    //       newTabLink={`/dashboard/products/new`}
    //       filterValue="name"
    //       data={products}
    //       columns={columns}
    //       searchPlaceholder="جست‌وجوی نام محصول..."
    //     />
    //   </Suspense>
    // </div>
  )
}

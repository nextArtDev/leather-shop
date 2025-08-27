import { Suspense } from 'react'
import ProductCard from '@/components/product/product-card'
import { Card, CardContent } from '@/components/ui/card'

import { Skeleton } from '@/components/ui/skeleton'
import { SearchProduct } from '@/lib/types/home'

interface ProductGridProps {
  products: SearchProduct[]
  loading?: boolean
}

export default function ProductGrid({
  products,
  loading = false,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-lg font-medium mb-2">محصولی یافت نشد</div>
          <div className="text-muted-foreground">
            لطفاً فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
          <ProductCard product={product} />
        </Suspense>
      ))}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  )
}

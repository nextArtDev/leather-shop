'use client'

import { SearchProductsResult, SearchFilters } from '@/lib/types/home'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ProductCard from '@/components/product/product-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SearchResultsProps {
  results: SearchProductsResult
  currentFilters: SearchFilters
  onPageChange: (page: number) => void
}

export default function SearchResults({
  results,
  currentFilters,
  onPageChange,
}: SearchResultsProps) {
  const { products, pagination } = results

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, pagination.current - delta);
      i <= Math.min(pagination.pages - 1, pagination.current + delta);
      i++
    ) {
      range.push(i)
    }

    if (pagination.current - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (pagination.current + delta < pagination.pages - 1) {
      rangeWithDots.push('...', pagination.pages)
    } else {
      rangeWithDots.push(pagination.pages)
    }

    return rangeWithDots
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">
          {pagination.total} محصول یافت شد
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {currentFilters.search && (
            <Badge variant="secondary">جستجو: {currentFilters.search}</Badge>
          )}
          {currentFilters.minPrice && (
            <Badge variant="secondary">
              حداقل قیمت: {currentFilters.minPrice.toLocaleString()}
            </Badge>
          )}
          {currentFilters.maxPrice && (
            <Badge variant="secondary">
              حداکثر قیمت: {currentFilters.maxPrice.toLocaleString()}
            </Badge>
          )}
          {currentFilters.colors?.map((color) => (
            <Badge key={color} variant="secondary">
              رنگ: {color}
            </Badge>
          ))}
          {currentFilters.sizes?.map((size) => (
            <Badge key={size} variant="secondary">
              سایز: {size}
            </Badge>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-lg font-medium">محصولی یافت نشد</div>
            <div className="text-muted-foreground mt-2">
              لطفاً فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.current - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronRight className="w-4 h-4" />
            قبلی
          </Button>

          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === pagination.current ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={typeof page !== 'number'}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.current + 1)}
            disabled={!pagination.hasNext}
          >
            بعدی
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

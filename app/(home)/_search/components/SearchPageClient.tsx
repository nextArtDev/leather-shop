'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Filter as FilterIcon, X } from 'lucide-react'
// import SortMenu from '@/components/filters/SortMenu'
// import { FilterSection } from '@/components/filters/FilterSection'
import ProductCard from '@/components/product/product-card'
import type {
  SearchProductsResult,
  FiltersData,
  SearchFilters,
} from '@/lib/types/home'
import SortMenu from './SortMenu'

const sortOptions = [
  { name: 'جدیدترین', value: 'newest' as const },
  { name: 'قدیمی‌ترین', value: 'oldest' as const },
  { name: 'ارزان‌ترین', value: 'price_asc' as const },
  { name: 'گران‌ترین', value: 'price_desc' as const },
  { name: 'بهترین امتیاز', value: 'rating' as const },
  { name: 'پرفروش‌ترین', value: 'sales' as const },
]

interface SearchPageClientProps {
  initialProducts: SearchProductsResult
  filtersData: FiltersData
  initialFilters: SearchFilters
}

export function SearchPageClient({
  initialProducts,
  filtersData,
  initialFilters,
}: SearchPageClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get current sort option
  const currentSort =
    sortOptions.find((opt) => opt.value === initialFilters.sortBy) ||
    sortOptions[0]

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      setLoading(true)

      const updatedFilters = { ...initialFilters, ...newFilters }

      // Build URL parameters
      const params = new URLSearchParams()

      if (updatedFilters.search) params.set('q', updatedFilters.search)
      if (updatedFilters.categoryId)
        params.set('category', updatedFilters.categoryId)
      if (updatedFilters.subCategoryId)
        params.set('subcategory', updatedFilters.subCategoryId)
      if (updatedFilters.minPrice)
        params.set('minPrice', updatedFilters.minPrice.toString())
      if (updatedFilters.maxPrice)
        params.set('maxPrice', updatedFilters.maxPrice.toString())
      if (updatedFilters.colors?.length)
        params.set('colors', updatedFilters.colors.join(','))
      if (updatedFilters.sizes?.length)
        params.set('sizes', updatedFilters.sizes.join(','))
      if (updatedFilters.sortBy) params.set('sort', updatedFilters.sortBy)

      // Always reset to first page when filters change (except when explicitly changing page)
      const page = newFilters.page || 1
      params.set('page', page.toString())

      router.push(`/search?${params.toString()}`)
    },
    [router, initialFilters]
  )

  const handleFilterChange = (filterUpdates: Partial<SearchFilters>) => {
    updateFilters(filterUpdates)
  }

  const handleSortChange = (sortOption: (typeof sortOptions)[0]) => {
    updateFilters({ sortBy: sortOption.value, page: 1 })
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    if (initialFilters.search) params.set('q', initialFilters.search)
    params.set('sort', 'newest')
    params.set('page', '1')
    router.push(`/search?${params.toString()}`)
  }

  const removeFilter = (filterType: keyof SearchFilters, value?: string) => {
    const updates: Partial<SearchFilters> = { page: 1 }

    if (filterType === 'colors' && value) {
      const currentColors = initialFilters.colors || []
      const newColors = currentColors.filter((c) => c !== value)
      updates.colors = newColors.length ? newColors : undefined
    } else if (filterType === 'sizes' && value) {
      const currentSizes = initialFilters.sizes || []
      const newSizes = currentSizes.filter((s) => s !== value)
      updates.sizes = newSizes.length ? newSizes : undefined
    } else if (filterType === 'minPrice') {
      updates.minPrice = undefined
    } else if (filterType === 'maxPrice') {
      updates.maxPrice = undefined
    } else if (filterType === 'categoryId') {
      updates.categoryId = undefined
      updates.subCategoryId = undefined // Also clear subcategory
    } else if (filterType === 'subCategoryId') {
      updates.subCategoryId = undefined
    }

    updateFilters(updates)
  }

  // Count active filters
  const activeFilterCount =
    (initialFilters.categoryId ? 1 : 0) +
    (initialFilters.subCategoryId ? 1 : 0) +
    (initialFilters.minPrice || initialFilters.maxPrice ? 1 : 0) +
    (initialFilters.colors?.length || 0) +
    (initialFilters.sizes?.length || 0)

  return (
    <div className="space-y-6">
      {/* Header with filters and sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            فیلترها
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearAllFilters} size="sm">
              پاک کردن همه فیلترها
            </Button>
          )}
        </div>

        <SortMenu
          options={sortOptions}
          selectedOption={currentSort}
          onSelectionChange={handleSortChange}
        />
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {initialFilters.categoryId && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              دسته‌بندی انتخاب شده
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('categoryId')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {initialFilters.minPrice && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              حداقل: {initialFilters.minPrice.toLocaleString('fa-IR')} تومان
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('minPrice')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {initialFilters.maxPrice && (
            <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
              حداکثر: {initialFilters.maxPrice.toLocaleString('fa-IR')} تومان
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('maxPrice')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {initialFilters.colors?.map((color) => (
            <div
              key={color}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              رنگ: {color}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('colors', color)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {initialFilters.sizes?.map((size) => (
            <div
              key={size}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              سایز: {size}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter('sizes', size)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {isFilterOpen && (
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="sticky top-6 border rounded-lg p-4">
              <FilterSection
                filtersData={filtersData}
                selectedFilters={initialFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {initialProducts.pagination.total} محصول یافت شد
              {initialFilters.search && ` برای "${initialFilters.search}"`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <>
              {initialProducts.products.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <p className="text-muted-foreground text-lg">
                    محصولی یافت نشد
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    لطفاً فیلترهای خود را تغییر دهید
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {initialProducts.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {initialProducts.pagination.pages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2 items-center">
                    {/* Previous Button */}
                    {initialProducts.pagination.hasPrev && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateFilters({
                            page: initialProducts.pagination.current - 1,
                          })
                        }
                      >
                        قبلی
                      </Button>
                    )}

                    {/* Page Numbers */}
                    {Array.from(
                      { length: Math.min(initialProducts.pagination.pages, 7) },
                      (_, i) => {
                        const currentPage = initialProducts.pagination.current
                        const totalPages = initialProducts.pagination.pages

                        let pageNumber: number
                        if (totalPages <= 7) {
                          pageNumber = i + 1
                        } else if (currentPage <= 4) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 3) {
                          pageNumber = totalPages - 6 + i
                        } else {
                          pageNumber = currentPage - 3 + i
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={
                              pageNumber === currentPage ? 'default' : 'outline'
                            }
                            onClick={() => updateFilters({ page: pageNumber })}
                            className="min-w-[40px]"
                          >
                            {pageNumber}
                          </Button>
                        )
                      }
                    )}

                    {/* Next Button */}
                    {initialProducts.pagination.hasNext && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateFilters({
                            page: initialProducts.pagination.current + 1,
                          })
                        }
                      >
                        بعدی
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

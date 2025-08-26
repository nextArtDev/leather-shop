import { getAllCategories, searchProducts } from '@/lib/home/queries/products'
import { getFiltersData } from '@/lib/home/queries/products' // Add this function
// import { getAllCategories } from '@/app/(dashboard)/dashboard/lib/queries'
import { SearchFilters } from '@/lib/types/home'
import SearchPageContent from './components/SearchPageContent'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    categoryId?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
    colors?: string | string[]
    sizes?: string | string[]
  }>
}

const sortOptions = [
  { name: 'جدیدترین', value: 'newest' as const },
  { name: 'قدیمی‌ترین', value: 'oldest' as const },
  { name: 'ارزانترین', value: 'price_asc' as const },
  { name: 'گرانترین', value: 'price_desc' as const },
  { name: 'بهترین امتیاز', value: 'rating' as const },
  { name: 'پرفروش‌ترین', value: 'sales' as const },
]

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const currentFilters: SearchFilters = {
    search: params.q || undefined,
    categoryId: params.categoryId || undefined,
    minPrice: params.minPrice ? parseInt(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
    sortBy: (params.sortBy as SearchFilters['sortBy']) || 'newest',
    page: params.page ? parseInt(params.page) : 1,
    colors: Array.isArray(params.colors)
      ? params.colors
      : params.colors
      ? [params.colors]
      : undefined,
    sizes: Array.isArray(params.sizes)
      ? params.sizes
      : params.sizes
      ? [params.sizes]
      : undefined,
  }

  // Fetch data in parallel
  const [searchResults, filtersData, categoriesData] = await Promise.all([
    searchProducts(currentFilters),
    getFiltersData(currentFilters.categoryId),
    getAllCategories({}),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchPageContent
        searchResults={searchResults}
        filtersData={filtersData}
        categories={categoriesData.categories}
        currentFilters={currentFilters}
        sortOptions={sortOptions}
      />
    </div>
  )
}

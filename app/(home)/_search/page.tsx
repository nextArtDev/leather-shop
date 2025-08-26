import { searchProducts, getFiltersData } from '@/lib/home/queries/products'
import { SearchFilters } from '@/lib/types/home'
import { SearchPageClient } from './components/SearchPageClient'
// import { SearchPageClient } from './components/SearchPageClient'
// import type { SearchFilters } from '@/types/product-types'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    subcategory?: string
    minPrice?: string
    maxPrice?: string
    colors?: string
    sizes?: string
    sort?: string
    page?: string
  }>
}

export async function generateMetadata(props: SearchPageProps) {
  const searchParams = await props.searchParams
  const {
    q = '',
    category,
    minPrice,
    maxPrice,
    colors,
    sizes,
    sort = 'newest',
  } = searchParams

  const hasFilters = category || minPrice || maxPrice || colors || sizes
  const title = q
    ? `جست‌وجو برای "${q}"${hasFilters ? ' با فیلتر' : ''}`
    : hasFilters
    ? 'محصولات فیلتر شده'
    : 'جست‌وجوی محصولات'

  return { title }
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams
  const {
    q = '',
    category,
    subcategory,
    minPrice,
    maxPrice,
    colors,
    sizes,
    sort = 'newest',
    page = '1',
  } = searchParams

  // Parse search parameters into SearchFilters type
  const filters: SearchFilters = {
    search: q || undefined,
    categoryId: category || undefined,
    subCategoryId: subcategory || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    colors: colors ? colors.split(',') : undefined,
    sizes: sizes ? sizes.split(',') : undefined,
    sortBy: (sort as SearchFilters['sortBy']) || 'newest',
    page: parseInt(page),
  }

  // Fetch products and filter data in parallel
  const [products, filtersData] = await Promise.all([
    searchProducts(filters),
    getFiltersData(category, subcategory),
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {q ? `نتایج جست‌وجو برای "${q}"` : 'جست‌وجوی محصولات'}
          </h1>
          {q && (
            <p className="text-muted-foreground mt-2">
              {products.pagination.total} محصول یافت شد
            </p>
          )}
        </div>

        {/* Client Component for Interactive Features */}
        <SearchPageClient
          initialProducts={products}
          filtersData={filtersData}
          initialFilters={filters}
        />
      </div>
    </div>
  )
}

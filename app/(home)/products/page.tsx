import { getAllCategories, searchProducts } from '@/lib/home/queries/products'
import { getFiltersData } from '@/lib/home/queries/products' // Add this function

import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// import { generateSearchMetadata } from '@/lib/utils'
import { parseSearchParams } from '../search/components/utils'
import SearchPageClient from '../search/components/SearchPageClient'
import { STORE_NAME } from '@/constants/store'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    categoryId?: string
    subCategoryId?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
    colors?: string | string[]
    sizes?: string | string[]
  }>
}

// export async function generateMetadata({
//   searchParams,
// }: SearchPageProps): Promise<Metadata> {
//   const params = await searchParams
//   return generateSearchMetadata(params)
// }
export function generateSearchMetadata(params: {
  q?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  page?: string
  colors?: string | string[]
  sizes?: string | string[]
}): Metadata {
  const query = params.q || ''
  const page = Number(params.page) || 1
  const isSearch = !!query

  // Build dynamic title and description
  let title = ''
  let description = ''
  let keywords: string[] = []

  if (isSearch) {
    title = `"${query} نتایج جست‌وجوی"${
      page > 1 ? ` ${page} - صفحه ` : ''
    } | ${STORE_NAME}`
    description = `"${query}" پیدا کردن بهترین نتایج برای.`
    keywords = [
      query,
      'جست‌وجو',
      'محصولات',
      'فروشگاه چرم آنلاین',
      'فروشگاه چرم',
    ]
  } else {
    title = `Products${page > 1 ? ` - Page ${page}` : ''} | ${STORE_NAME}`
    description = 'جست‌وجوی محصولات کامل فروشگاه'
    // 'Discover our complete product collection. Filter by category, price, color, and size to find exactly what you need.'
    keywords = [
      'چرم طبیعی',
      'کیف چرمی',
      'خرید آنلاین',
      'فروشگاه چرم',
      'فروشگاه چرم',
    ]
  }

  // Add filter-based keywords
  if (params.colors) {
    const colors = Array.isArray(params.colors)
      ? params.colors
      : [params.colors]
    keywords.push(...colors.map((c) => `محصولات${c} `))
  }

  if (params.sizes) {
    const sizes = Array.isArray(params.sizes) ? params.sizes : [params.sizes]
    keywords.push(...sizes.map((s) => `  ${s}سایز`))
  }

  const currentUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/products`)
  Object.entries(params).forEach(([key, value]) => {
    if (value) currentUrl.searchParams.set(key, String(value))
  })

  return {
    title,
    description,
    keywords: keywords.join(', '),

    openGraph: {
      type: 'website',
      title: isSearch ? `${query}جست‌وجوی: ` : 'محصولات',
      description,
      url: currentUrl.toString(),
      siteName: `${STORE_NAME}`,
      images: ['/default-search-og.jpg'], // Add a default search page image
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/default-search-twitter.jpg'],
    },

    robots: {
      index: page === 1, // Only index page 1
      follow: true,
      googleBot: {
        index: page === 1,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: page === 1 ? currentUrl.toString() : undefined, // Only canonical for page 1
    },

    other: {
      'search-query': query || '',
      'page-number': page.toString(),
      'results-type': isSearch ? 'search' : 'catalog',
    },
  }
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const filters = parseSearchParams(params)
  try {
    // Fetch data in parallel for better performance
    const [searchResults, filtersData, categoriesData] = await Promise.all([
      searchProducts(filters),
      getFiltersData(filters.categoryId, filters.subCategoryId),
      getAllCategories({}),
    ])
    // console.log(searchResults.products)

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': params.q ? 'SearchResultsPage' : 'CollectionPage',
      name: params.q ? `"${params.q} نتایج جست‌وجو برای"` : 'همه محصولات',
      description: params.q
        ? ` "${params.q}" جست‌وجو برای - محصول پیدا نشد ${searchResults.products.length}`
        : `جست‌وجوی همه محصولات - محصول یافت شد. ${searchResults.products.length} `,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products${
        params.q ? `?q=${encodeURIComponent(params.q)}` : ''
      }`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: searchResults.products.length,
        itemListElement: searchResults.products
          .slice(0, 20)
          .map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: product.brand,
              image: product.images?.[0]?.url,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
              ...(product?.sizes?.[0]?.price && {
                offers: {
                  '@type': 'Offer',
                  price: product?.sizes?.[0]?.price,
                  priceCurrency: 'IRRI',
                  availability:
                    product.sizes?.[0].quantity > 0
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                },
              }),
            },
          })),
      },
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <SearchPageClient
          initialResults={searchResults}
          filtersData={filtersData}
          categories={categoriesData.categories}
          initialFilters={filters}
        />
      </>
    )
  } catch (error) {
    console.error('Search page error:', error)
    return <SearchError />
  }
}

function SearchError() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-lg font-medium mb-2">خطا در بارگذاری</div>
          <div className="text-muted-foreground">
            مشکلی در بارگذاری نتایج جستجو رخ داده است. لطفاً دوباره تلاش کنید.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto overflow-x-hidden py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-80 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  )
}

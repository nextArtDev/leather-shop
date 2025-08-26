import { SearchFilters } from '@/lib/types/home'

export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): SearchFilters {
  const getValue = (key: string): string | undefined => {
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const getArrayValue = (key: string): string[] | undefined => {
    const value = searchParams[key]
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',').filter(Boolean)
    return undefined
  }

  return {
    search: getValue('q') || undefined,
    categoryId: getValue('category') || undefined,
    subCategoryId: getValue('subcategory') || undefined,
    minPrice: getValue('minPrice')
      ? parseInt(getValue('minPrice')!)
      : undefined,
    maxPrice: getValue('maxPrice')
      ? parseInt(getValue('maxPrice')!)
      : undefined,
    colors: getArrayValue('colors'),
    sizes: getArrayValue('sizes'),
    sortBy: (getValue('sort') as SearchFilters['sortBy']) || 'newest',
    page: getValue('page') ? parseInt(getValue('page')!) : 1,
  }
}

export function buildSearchUrl(
  filters: SearchFilters,
  baseUrl: string = '/search'
): string {
  const params = new URLSearchParams()

  if (filters.search) params.set('q', filters.search)
  if (filters.categoryId) params.set('category', filters.categoryId)
  if (filters.subCategoryId) params.set('subcategory', filters.subCategoryId)
  if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
  if (filters.colors?.length) params.set('colors', filters.colors.join(','))
  if (filters.sizes?.length) params.set('sizes', filters.sizes.join(','))
  if (filters.sortBy && filters.sortBy !== 'newest')
    params.set('sort', filters.sortBy)
  if (filters.page && filters.page !== 1)
    params.set('page', filters.page.toString())

  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

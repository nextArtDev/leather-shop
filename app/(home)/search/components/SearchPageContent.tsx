'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

import {
  SearchFilters as SearchFiltersType,
  SearchProductsResult,
  FiltersData,
  CategoryData,
  SortOption,
} from '@/lib/types/home'
import SearchFilters from './SearchFilters'
import SortMenu from './SortMenu'
import SearchResults from './SearchResults'

interface SearchPageContentProps {
  searchResults: SearchProductsResult
  filtersData: FiltersData
  categories: CategoryData[]
  currentFilters: SearchFiltersType
  sortOptions: SortOption[]
}

export default function SearchPageContent({
  searchResults,
  filtersData,
  categories,
  currentFilters,
  sortOptions,
}: SearchPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateURL = useCallback(
    (newFilters: Partial<SearchFiltersType>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update params
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          params.delete(key)
        } else if (Array.isArray(value)) {
          params.delete(key)
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value.toString())
        }
      })

      // Reset page when filters change (except when page itself is being changed)
      if (!('page' in newFilters)) {
        params.set('page', '1')
      }

      router.push(`/search?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleFiltersChange = (filters: Partial<SearchFiltersType>) => {
    updateURL(filters)
  }

  const handleSortChange = (sortBy: SearchFiltersType['sortBy']) => {
    updateURL({ sortBy })
  }

  const handlePageChange = (page: number) => {
    updateURL({ page })
  }

  const handleClearFilters = () => {
    updateURL({
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      colors: undefined,
      sizes: undefined,
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="lg:w-1/4">
        <SearchFilters
          filtersData={filtersData}
          categories={categories}
          currentFilters={currentFilters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4">
        {/* Sort Menu */}
        <div className="mb-6 flex justify-end">
          <SortMenu
            options={sortOptions}
            selectedSort={currentFilters.sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Search Results */}
        <SearchResults
          results={searchResults}
          currentFilters={currentFilters}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

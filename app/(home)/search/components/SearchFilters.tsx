'use client'
import {
  SearchFilters as SearchFiltersType,
  FiltersData,
  CategoryData,
} from '@/lib/types/home'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'
import CategoryFilter from './CategoryFilter'
import PriceFilter from './PriceFilter'

import SizeFilter from './SizeFilter'
import ColorFilter from './ColorFilters'

interface SearchFiltersProps {
  filtersData: FiltersData
  categories: CategoryData[]
  currentFilters: SearchFiltersType
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void
  onClearFilters: () => void
}

export default function SearchFilters({
  filtersData,
  categories,
  currentFilters,
  onFiltersChange,
  onClearFilters,
}: SearchFiltersProps) {
  const hasActiveFilters = !!(
    currentFilters.categoryId ||
    currentFilters.minPrice ||
    currentFilters.maxPrice ||
    currentFilters.colors?.length ||
    currentFilters.sizes?.length
  )

  return (
    <Card className="sticky top-4">
      <CardContent className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">فیلترها</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              حذف همه
            </Button>
          )}
        </div>

        <Separator />

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={currentFilters.categoryId}
          onCategoryChange={(categoryId) => onFiltersChange({ categoryId })}
        />

        <Separator />

        {/* Price Filter */}
        <PriceFilter
          filtersData={filtersData}
          selectedMinPrice={currentFilters.minPrice}
          selectedMaxPrice={currentFilters.maxPrice}
          onPriceChange={(minPrice, maxPrice) =>
            onFiltersChange({ minPrice, maxPrice })
          }
        />

        <Separator />

        {/* Color Filter */}
        {filtersData.colors.length > 0 && (
          <>
            <ColorFilter
              colors={filtersData.colors}
              selectedColors={currentFilters.colors || []}
              onColorsChange={(colors) => onFiltersChange({ colors })}
            />
            <Separator />
          </>
        )}

        {/* Size Filter */}
        {filtersData.sizes.length > 0 && (
          <SizeFilter
            sizes={filtersData.sizes}
            selectedSizes={currentFilters.sizes || []}
            onSizesChange={(sizes) => onFiltersChange({ sizes })}
          />
        )}
      </CardContent>
    </Card>
  )
}

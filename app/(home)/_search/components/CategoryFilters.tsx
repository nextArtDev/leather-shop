'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Filter as FilterIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import FilterCheckboxGroup from './FilterCheckboxGroup'
import SortMenu from './SortMenu'
import { FilterCategory } from '../page'

import { Product } from '@/lib/generated/prisma'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/product-card'

// // --- Type Definitions ---

// type SelectedFilters = {
//   [key in FilterCategory['id']]?: string[]
// }

interface SortOption {
  name: string
  value: string
}

interface ProductFilterPage {
  sortOptions: SortOption[]
  filterData: FilterCategory[]
  products: {
    product: ({
      images: { url: string }[]
    } & Product)[]
    totalPages: number
  }
}
export default function ProductFilterPage({
  sortOptions,
  filterData,
  products,
}: ProductFilterPage) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // DERIVE state from URL search params instead of using useState
  const { selectedSortOption, selectedFilters } = useMemo(() => {
    const filters: Record<string, string[]> = {}
    filterData.forEach((cat) => {
      const values = searchParams.getAll(cat.id)
      if (values.length > 0) {
        filters[cat.id] = values
      }
    })

    const sort = searchParams.get('sort') || sortOptions[0]?.value
    const sortOption =
      sortOptions.find((o) => o.value === sort) || sortOptions[0]

    return { selectedSortOption: sortOption, selectedFilters: filters }
  }, [searchParams, filterData, sortOptions])

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  // Function to update URL search params
  const updateSearchParams = (
    key: string,
    value: string,
    isChecked: boolean
  ) => {
    const newParams = new URLSearchParams(searchParams.toString())
    const categoryInfo = filterData.find((cat) => cat.id === key)
    const isSingleSelect = categoryInfo?.selectionType === 'single'

    if (isSingleSelect) {
      // For single select, if it's checked, set it as the only value.
      // If it's unchecked, clear the value.
      if (isChecked) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    } else {
      // Logic for multi-select remains the same
      const currentValues = newParams.getAll(key)
      if (isChecked) {
        if (!currentValues.includes(value)) {
          newParams.append(key, value)
        }
      } else {
        const newValues = currentValues.filter((v) => v !== value)
        newParams.delete(key)
        if (newValues.length > 0) {
          newValues.forEach((v) => newParams.append(key, v))
        }
      }
    }

    // Always reset to the first page when a filter changes
    newParams.set('page', '1')
    router.push(`/search?${newParams.toString()}`)
  }

  const handleSortChange = (option: SortOption) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('sort', option.value)
    router.push(`/search?${newParams.toString()}`)
  }

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    filterData.forEach((cat) => newParams.delete(cat.id))
    newParams.set('page', '1')
    router.push(`/search?${newParams.toString()}`)
  }

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (count, values) => count + (values?.length || 0),
    0
  )

  // const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
  //   prices: ['All'],
  //   ratings: ['All'],
  // })
  // const [selectedSortOption, setSelectedSortOption] = useState<SortOption>(
  //   sortOptions[0]
  // )
  // const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)

  // const handleFilterChange = (
  //   categoryId: FilterCategory['id'],
  //   value: string,
  //   checked: boolean
  // ) => {
  //   setSelectedFilters((prev) => {
  //     const newValues = prev[categoryId] ? [...prev[categoryId]!] : []
  //     if (checked) {
  //       if (!newValues.includes(value)) {
  //         newValues.push(value)
  //       }
  //     } else {
  //       const index = newValues.indexOf(value)
  //       if (index > -1) {
  //         newValues.splice(index, 1)
  //       }
  //     }
  //     return { ...prev, [categoryId]: newValues }
  //   })
  // }

  // const clearAllFilters = () => {
  //   setSelectedFilters({})
  // }

  // const activeFilterCount = Object.values(selectedFilters).reduce(
  //   (count, values) => count + (values?.length || 0),
  //   0
  // )

  return (
    <div className=" ">
      {/* Filter Controls */}
      <div className="border-t border-b border-muted">
        <div className="mx-auto flex flex-col max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <div className="border-t flex items-center justify-center border-b border-muted">
            <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                >
                  <FilterIcon className="mr-2 h-5 w-5" />
                  فیلترها ({activeFilterCount})
                </Button>
                {activeFilterCount > 0 && (
                  <>
                    <div className="h-6 w-px bg-muted" />
                    <Button
                      variant="ghost"
                      onClick={clearAllFilters}
                      className="text-sm text-muted-foreground"
                    >
                      حذف همه
                    </Button>
                  </>
                )}
              </div>

              <SortMenu
                options={sortOptions}
                selectedOption={selectedSortOption}
                onSelectionChange={handleSortChange}
              />
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterPanelOpen && (
            <div className="border-b border-t flex items-center justify-center border-muted py-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Accordion type="multiple" defaultValue={['price', 'color']}>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
                    {filterData.map((category) => (
                      <AccordionItem key={category.id} value={category.id}>
                        <AccordionTrigger>
                          <span className="font-medium text-foreground">
                            {category.name}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <FilterCheckboxGroup
                            category={category}
                            selectedValues={selectedFilters[category.id] || []}
                            onValueChange={updateSearchParams}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                </Accordion>
              </div>
            </div>
          )}

          {/* Product Grid Placeholder */}

          {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.product.length === 0 && <div>محصولی پیدا نشد!</div>}
            {products.product.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  )
}

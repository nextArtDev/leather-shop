'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider' // Your existing slider
import { useState, useEffect } from 'react'
import { FiltersData } from '@/lib/types/home'

interface PriceFilterProps {
  filtersData: FiltersData
  selectedMinPrice?: number
  selectedMaxPrice?: number
  onPriceChange: (minPrice?: number, maxPrice?: number) => void
}

export default function PriceFilter({
  filtersData,
  selectedMinPrice,
  selectedMaxPrice,
  onPriceChange,
}: PriceFilterProps) {
  const [localMin, setLocalMin] = useState(
    selectedMinPrice || filtersData.priceRange.min
  )
  const [localMax, setLocalMax] = useState(
    selectedMaxPrice || filtersData.priceRange.max
  )

  useEffect(() => {
    setLocalMin(selectedMinPrice || filtersData.priceRange.min)
    setLocalMax(selectedMaxPrice || filtersData.priceRange.max)
  }, [selectedMinPrice, selectedMaxPrice, filtersData.priceRange])

  const handleSliderChange = (values: number[]) => {
    setLocalMin(values[0])
    setLocalMax(values[1])
  }

  const handleApplyPrice = () => {
    const minToApply =
      localMin === filtersData.priceRange.min ? undefined : localMin
    const maxToApply =
      localMax === filtersData.priceRange.max ? undefined : localMax
    onPriceChange(minToApply, maxToApply)
  }

  const handleResetPrice = () => {
    setLocalMin(filtersData.priceRange.min)
    setLocalMax(filtersData.priceRange.max)
    onPriceChange(undefined, undefined)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">قیمت</h3>

      <div className="px-2">
        <Slider
          value={[localMin, localMax]}
          onValueChange={handleSliderChange}
          max={filtersData.priceRange.max}
          min={filtersData.priceRange.min}
          step={1000}
          className="w-full"
        />
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{localMin.toLocaleString()} تومان</span>
        <span>{localMax.toLocaleString()} تومان</span>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleApplyPrice} className="flex-1">
          اعمال
        </Button>
        <Button size="sm" variant="outline" onClick={handleResetPrice}>
          ریست
        </Button>
      </div>
    </div>
  )
}

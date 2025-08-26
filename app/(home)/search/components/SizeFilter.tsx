'use client'

import { Badge } from '@/components/ui/badge'

interface SizeFilterProps {
  sizes: string[]
  selectedSizes: string[]
  onSizesChange: (sizes: string[]) => void
}

export default function SizeFilter({
  sizes,
  selectedSizes,
  onSizesChange,
}: SizeFilterProps) {
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter((s) => s !== size))
    } else {
      onSizesChange([...selectedSizes, size])
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-lg">سایز</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Badge
            key={size}
            variant={selectedSizes.includes(size) ? 'destructive' : 'outline'}
            className="cursor-pointer hover:bg-muted"
            onClick={() => toggleSize(size)}
          >
            {size}
          </Badge>
        ))}
      </div>
    </div>
  )
}

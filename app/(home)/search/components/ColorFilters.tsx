'use client'

import { Badge } from '@/components/ui/badge'

interface ColorFilterProps {
  colors: string[]
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
}

export default function ColorFilter({
  colors,
  selectedColors,
  onColorsChange,
}: ColorFilterProps) {
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter((c) => c !== color))
    } else {
      onColorsChange([...selectedColors, color])
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-lg">رنگ</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <Badge
            dir="ltr"
            key={color}
            variant={selectedColors.includes(color) ? 'destructive' : 'outline'}
            className="cursor-pointer hover:bg-muted"
            onClick={() => toggleColor(color)}
          >
            {color}
          </Badge>
        ))}
      </div>
    </div>
  )
}

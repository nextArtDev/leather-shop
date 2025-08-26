'use client'

import { Button } from '@/components/ui/button'
import { CategoryData } from '@/lib/types/home'

interface CategoryFilterProps {
  categories: CategoryData[]
  selectedCategory: string | undefined
  onCategoryChange: (categoryId: string | undefined) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-lg">دسته‌بندی</h3>
      <div className="space-y-1">
        <Button
          variant={!selectedCategory ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(undefined)}
          className="w-full justify-start"
        >
          همه دسته‌ها
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={
              selectedCategory === category.id ? 'destructive' : 'outline'
            }
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className="w-full justify-start"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'
import { FilterCategory } from '../page'

interface FilterCheckboxGroupProps {
  category: FilterCategory
  selectedValues: string[]
  onValueChange: (
    categoryId: FilterCategory['id'],
    value: string,
    checked: boolean
  ) => void
}

const FilterCheckboxGroup: React.FC<FilterCheckboxGroupProps> = ({
  category,
  selectedValues,
  onValueChange,
}) => {
  return (
    <div className="space-y-4 pt-4">
      {category.options.map((option) => (
        <div
          key={option.value}
          className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6"
        >
          <Checkbox
            id={`${category.id}-${option.value}`}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={(checked) =>
              onValueChange(category.id, option.value, !!checked)
            }
          />
          <label
            htmlFor={`${category.id}-${option.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export default FilterCheckboxGroup

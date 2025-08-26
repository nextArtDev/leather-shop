'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { SortOption, SearchFilters } from '@/lib/types/home'

interface SortMenuProps {
  options: SortOption[]
  selectedSort: SearchFilters['sortBy']
  onSortChange: (sort: SearchFilters['sortBy']) => void
}

export default function SortMenu({
  options,
  selectedSort,
  onSortChange,
}: SortMenuProps) {
  const selectedOption =
    options.find((opt) => opt.value === selectedSort) || options[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm font-medium hover:text-muted-foreground"
        >
          مرتب کردن با: {selectedOption.name}
          <ChevronDown className="mr-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => onSortChange(option.value)}
            className={cn(
              option.value === selectedSort
                ? 'font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

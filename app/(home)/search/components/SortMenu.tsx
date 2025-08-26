import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

interface SortOption {
  name: string
  value: string
}

interface SortMenuProps {
  options: SortOption[]
  selectedOption: SortOption
  onSelectionChange: (option: SortOption) => void
}

const SortMenu: React.FC<SortMenuProps> = ({
  options,
  selectedOption,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium   hover:text-muted-foreground"
        >
          مرتب کردن با: {selectedOption.name}
          <ChevronDown className="mr-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem
              dir="rtl"
              key={option.value}
              onSelect={() => {
                onSelectionChange(option)
                setIsOpen(false)
              }}
              className={cn(
                option.value === selectedOption.value
                  ? 'font-semibold  '
                  : 'text-muted-foreground'
              )}
            >
              {option.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export default SortMenu

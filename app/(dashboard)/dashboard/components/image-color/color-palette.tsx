/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { FC, useState } from 'react'
import { FieldArrayWithId } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { getContrastColor, isValidHexColor } from './color-utils'

type YourMainFormSchemaType = any

interface ColorPaletteProps {
  extractedColors?: string[]
  mainVariantColors: FieldArrayWithId<YourMainFormSchemaType, 'colors', 'id'>[]
  addMainVariantColor: (colorValue: string) => void
}

const ColorPalette: FC<ColorPaletteProps> = ({
  extractedColors,
  mainVariantColors,
  addMainVariantColor,
}) => {
  const [activeColor, setActiveColor] = useState<string>('')

  const handleSelectExtractedColor = (colorToAdd: string) => {
    if (!colorToAdd || !addMainVariantColor || !isValidHexColor(colorToAdd)) {
      console.warn('Invalid color or missing handler:', colorToAdd)
      return
    }

    // Check if color is already added
    const isColorAlreadyAdded = mainVariantColors.some(
      (colorField) => (colorField as any).color === colorToAdd
    )

    if (isColorAlreadyAdded) {
      console.log('Color already added:', colorToAdd)
      return
    }

    try {
      addMainVariantColor(colorToAdd)
      console.log('Color added successfully:', colorToAdd)
    } catch (error) {
      console.error('Error adding color:', error)
    }
  }

  if (!extractedColors || extractedColors.length === 0) {
    return null
  }

  // Filter out invalid colors
  const validColors = extractedColors.filter(isValidHexColor)

  if (validColors.length === 0) {
    return null
  }

  return (
    <div className="p-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-md shadow-lg border border-white/20">
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 mb-1">
        Click to add color
      </div>
      <div className="flex items-center justify-center gap-1 mb-1">
        {validColors.map((color, index) => {
          const isAlreadyAdded = mainVariantColors.some(
            (colorField) => (colorField as any).color === color
          )
          const contrastColor = getContrastColor(color)

          return (
            <button
              key={`${color}-${index}`}
              type="button"
              title={`${
                isAlreadyAdded ? 'Already added' : 'Add color'
              } ${color}`}
              className={cn(
                'w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-150 ease-in-out hover:scale-125 focus:outline-none focus:ring-2 focus:ring-offset-1 relative',
                activeColor === color
                  ? 'ring-2 ring-blue-500 scale-110'
                  : 'ring-offset-transparent',
                isAlreadyAdded
                  ? 'border-green-400 cursor-not-allowed opacity-75'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              )}
              style={{ backgroundColor: color }}
              onMouseEnter={() => setActiveColor(color)}
              onMouseLeave={() => setActiveColor('')}
              onClick={() => handleSelectExtractedColor(color)}
              aria-label={`Select color ${color}`}
              disabled={isAlreadyAdded}
            >
              {isAlreadyAdded && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                  style={{ color: contrastColor }}
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
      {activeColor && (
        <div className="text-xs text-center font-medium">
          <div
            className="inline-block px-2 py-1 rounded"
            style={{
              backgroundColor: activeColor,
              color: getContrastColor(activeColor),
            }}
          >
            {activeColor.toUpperCase()}
          </div>
        </div>
      )}
      {mainVariantColors.length > 0 && (
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
          {mainVariantColors.length} color
          {mainVariantColors.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  )
}

export default ColorPalette

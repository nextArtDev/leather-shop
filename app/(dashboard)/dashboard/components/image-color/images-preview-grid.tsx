/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { FC, useEffect, useState } from 'react'
import NextImage from 'next/image'
import { Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FieldArrayWithId } from 'react-hook-form'
import ColorPalette from './color-palette'
import { getDominantColors, getGridClassName } from './color-utils'

type YourMainFormSchemaType = any

interface ImageData {
  id?: string
  url: string
  key?: string
  originalFile?: File
}

interface ImagesPreviewGridProps {
  images: ImageData[]
  onRemove: (url: string) => void
  mainVariantColors: FieldArrayWithId<YourMainFormSchemaType, 'colors', 'id'>[]
  addMainVariantColor: (colorValue: string) => void
  isEditMode?: boolean
}

const ImagesPreviewGrid: FC<ImagesPreviewGridProps> = ({
  images,
  onRemove,
  mainVariantColors,
  addMainVariantColor,
}) => {
  const imagesLength = images.length
  const GridClassName = getGridClassName(imagesLength)
  const [colorPalettes, setColorPalettes] = useState<string[][]>([])
  const [loadingColors, setLoadingColors] = useState<boolean[]>([])

  useEffect(() => {
    const fetchColors = async () => {
      if (imagesLength === 0) {
        setColorPalettes([])
        setLoadingColors([])
        return
      }

      setLoadingColors(new Array(imagesLength).fill(true))

      const palettes = await Promise.all(
        images.map(async (img, index) => {
          try {
            // Only extract colors for valid image URLs
            if (
              img.url &&
              (img.url.startsWith('blob:') || img.url.startsWith('http'))
            ) {
              const colors = await getDominantColors(img.url)
              return colors
            }
            return []
          } catch (error) {
            console.error(
              `Error fetching dominant colors for image ${index}:`,
              error
            )
            return []
          }
        })
      )

      setColorPalettes(palettes)
      setLoadingColors(new Array(imagesLength).fill(false))
    }

    fetchColors()
  }, [images, imagesLength])

  if (imagesLength === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No images selected.
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          'grid bg-white rounded-md overflow-hidden max-h-[600px] gap-2 p-2',
          GridClassName
        )}
      >
        {images.map((img, i) => {
          // Create a unique key for each image
          const imageKey = img.id || img.key || `image-${i}-${img.url}`

          return (
            <div
              key={imageKey}
              className={cn(
                'relative group h-full w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
                `grid_${imagesLength}_image_${i + 1}`,
                {
                  'min-h-[150px] max-h-[200px]': imagesLength > 1,
                  'min-h-[200px] max-h-[400px]': imagesLength === 1,
                }
              )}
              style={{ aspectRatio: '1 / 1' }}
            >
              {img.url ? (
                <NextImage
                  src={img.url}
                  alt={`Preview ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error('Image load error:', e)
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}

              {/* Overlay with color palette and remove button */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Color palette at the top */}
                <div className="w-full flex justify-center mt-2">
                  {loadingColors[i] ? (
                    <div className="text-white text-xs">Loading colors...</div>
                  ) : (
                    colorPalettes[i] &&
                    colorPalettes[i].length > 0 && (
                      <ColorPalette
                        extractedColors={colorPalettes[i]}
                        mainVariantColors={mainVariantColors}
                        addMainVariantColor={addMainVariantColor}
                      />
                    )
                  )}
                </div>

                {/* Remove button at the bottom right */}
                <div className="w-full flex justify-end">
                  <button
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onRemove(img.url)
                    }}
                    title="Remove image"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Display selected colors if any */}
      {mainVariantColors.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Selected Colors:</h4>
          <div className="flex flex-wrap gap-2">
            {mainVariantColors.map((colorField) => (
              <div
                key={colorField.id}
                className="flex items-center gap-2 bg-white dark:bg-gray-700 px-2 py-1 rounded-md border"
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: (colorField as any).color }}
                />
                <span className="text-xs">{(colorField as any).color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImagesPreviewGrid

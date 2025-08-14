/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Image } from '@/lib/generated/prisma'
import React, { useEffect, useState } from 'react'
import { FieldArrayWithId, Path, useFormContext } from 'react-hook-form'
import { FileInput, FileUploader } from '../file-input/file-input'
import ImagesPreviewGrid from './images-preview-grid'

// Define a more specific type for your form values if possible
type YourMainFormSchemaType = any // Replace with your actual Zod schema inferred type

const dropZoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4, // 4MB
  multiple: true,
  accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
}

interface ImageInputProps {
  name: string
  label: string
  initialDataImages?: Partial<Image>[] | null
  mainVariantColors: FieldArrayWithId<YourMainFormSchemaType, 'colors', 'id'>[]
  addMainVariantColor: (colorValue: string) => void
}

export function ImageInput({
  name,
  label,
  mainVariantColors,
  addMainVariantColor,
  initialDataImages,
}: ImageInputProps) {
  const { control, setValue, watch } = useFormContext<YourMainFormSchemaType>()
  const [isEditMode, setIsEditMode] = useState(false)

  // Watch the field value to track changes
  const fieldValue = watch(name as Path<YourMainFormSchemaType>)

  useEffect(() => {
    // Set initial images if in edit mode and no files are selected
    if (initialDataImages && initialDataImages.length > 0 && !fieldValue) {
      setValue(name as Path<YourMainFormSchemaType>, initialDataImages)
      setIsEditMode(true)
    }
  }, [initialDataImages, name, setValue, fieldValue])

  return (
    <div className="w-full">
      <FormField
        control={control}
        name={name as Path<YourMainFormSchemaType>}
        render={({ field }) => {
          const handleFileChange = (files: File[]) => {
            // When new files are selected, switch to file mode
            setIsEditMode(false)
            field.onChange(files)
          }

          const handleRemoveExistingImage = (urlToRemove: string) => {
            if (isEditMode && initialDataImages) {
              const updatedImages = initialDataImages.filter(
                (img) => img.url !== urlToRemove
              )
              field.onChange(updatedImages)

              // If no images left, prepare for new file uploads
              if (updatedImages.length === 0) {
                setIsEditMode(false)
                field.onChange([])
              }
            }
          }

          const handleRemoveFile = (fileToRemove: File) => {
            if (!isEditMode && Array.isArray(field.value)) {
              const files = field.value as File[]
              const updatedFiles = files.filter((file) => file !== fileToRemove)
              field.onChange(updatedFiles)
            }
          }

          // Determine what to display
          const hasFiles =
            !isEditMode && Array.isArray(field.value) && field.value.length > 0
          const hasExistingImages =
            isEditMode && Array.isArray(field.value) && field.value.length > 0

          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <FileUploader
                  value={
                    isEditMode
                      ? []
                      : Array.isArray(field.value)
                      ? field.value
                      : []
                  }
                  onValueChange={handleFileChange}
                  dropzoneOptions={dropZoneConfig}
                  className="relative rounded-lg border border-dashed bg-background p-2"
                >
                  {hasFiles || hasExistingImages ? (
                    isEditMode ? (
                      <ImagesPreviewGrid
                        images={field.value || []}
                        onRemove={handleRemoveExistingImage}
                        mainVariantColors={mainVariantColors}
                        addMainVariantColor={addMainVariantColor}
                        isEditMode={true}
                      />
                    ) : (
                      <ImagesPreviewGridForFiles
                        files={field.value || []}
                        onRemove={handleRemoveFile}
                        mainVariantColors={mainVariantColors}
                        addMainVariantColor={addMainVariantColor}
                      />
                    )
                  ) : (
                    <FileInput className="outline-none">
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <FileSvgDraw />
                      </div>
                    </FileInput>
                  )}
                </FileUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    </div>
  )
}

// Component to handle file preview URL creation and cleanup
function ImagesPreviewGridForFiles({
  files,
  onRemove,
  mainVariantColors,
  addMainVariantColor,
}: {
  files: File[]
  onRemove: (file: File) => void
  mainVariantColors: FieldArrayWithId<any, 'colors', 'id'>[]
  addMainVariantColor: (color: string) => void
}) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    // Create new blob URLs when files change
    const newUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(newUrls)

    // Cleanup function to revoke URLs when the component unmounts or files change
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [files])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <ImagesPreviewGrid
      images={files.map((file, index) => ({
        id: `file-${index}`,
        url: previewUrls[index] || '',
        key: `file-${file.name}-${index}`,
        originalFile: file,
      }))}
      onRemove={(url: string) => {
        const index = previewUrls.indexOf(url)
        if (index !== -1) {
          onRemove(files[index])
          // Revoke the specific URL
          URL.revokeObjectURL(url)
        }
      }}
      mainVariantColors={mainVariantColors}
      addMainVariantColor={addMainVariantColor}
      isEditMode={false}
    />
  )
}

// SVG component for the upload area
const FileSvgDraw = () => (
  <>
    <svg
      className="mb-4 h-10 w-10 text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400">
      PNG, JPG, GIF, WEBP up to 4MB each
    </p>
  </>
)

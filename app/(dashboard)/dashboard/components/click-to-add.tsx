/* eslint-disable @typescript-eslint/no-explicit-any */
// components/click-to-add-rhf.tsx
'use client'
import React from 'react'
import {
  Control,
  FieldArrayWithId,
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  Path,
} from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ColorPicker } from './color-picker'
import colorNamer from 'color-namer'
import { ProductVariantSchema } from '../lib/schemas'

// --- Type Definitions ---
type FormValues = any // Consider defining a more specific type for your form values
type FieldName = Path<FormValues>
type ArrayItem<T> = T extends (infer U)[] ? U : never
type DetailSchemaType = ArrayItem<FormValues['colors' | 'sizes' | 'specs']>

// --- Component Props Interface ---
interface ClickToAddInputsRHFProps {
  fields: FieldArrayWithId<FormValues, FieldName, 'id'>[]
  name: FieldName
  control: Control<FormValues>
  register: UseFormRegister<FormValues>
  setValue: UseFormSetValue<FormValues>
  getValues: UseFormGetValues<FormValues>
  onAppend: (value: Partial<DetailSchemaType>) => void
  onRemove: (index: number) => void
  initialDetailSchema: Partial<DetailSchemaType>
  header?: string
  colorPicker?: boolean
  containerClassName?: string
  inputClassName?: string
  // Add a labels prop to accept a map of field keys to custom label strings
  labels?: Record<string, string>
  isMandatory?: boolean
}

// --- Component Implementation ---
const ClickToAddInputsRHF: React.FC<ClickToAddInputsRHFProps> = ({
  fields,
  name,
  // control,
  register,
  setValue,
  onAppend,
  onRemove,
  initialDetailSchema,
  header,

  containerClassName,
  inputClassName,
  labels, // Destructure the new labels prop
  isMandatory = false,
}) => {
  const handleAddDetail = () => {
    onAppend(initialDetailSchema)
  }

  const handleRemoveDetail = (index: number) => {
    onRemove(index)
  }

  return (
    <div className="flex flex-col gap-y-4">
      {header && <Label className="text-md font-semibold">{header}</Label>}

      {fields.map((fieldItem, index) => {
        const variantItem = fieldItem as unknown as ProductVariantSchema
        const currentDetail = fieldItem as unknown as DetailSchemaType

        return (
          <div
            key={fieldItem.id}
            className={cn(
              'grid grid-cols-4 items-end gap-3 border p-4 rounded-md relative',
              containerClassName
            )}
          >
            {Object.keys(initialDetailSchema).map((propertyKey) => {
              const fieldPath =
                `${name}.${index}.${propertyKey}` as Path<FormValues>
              const isNumeric =
                typeof initialDetailSchema[
                  propertyKey as keyof DetailSchemaType
                ] === 'number'
              if (propertyKey === 'colorHex') {
                return (
                  <div key={propertyKey} className="flex flex-col gap-1">
                    <Label
                      htmlFor={fieldPath}
                      className="text-xs text-muted-foreground"
                    >
                      {labels?.[propertyKey] || propertyKey}
                      {isMandatory && <span className="text-rose-500">*</span>}
                    </Label>
                    <div className="flex items-center gap-x-2">
                      <ColorPicker
                        value={variantItem.colorHex}
                        onChange={(newHex) => {
                          setValue(fieldPath, newHex, { shouldValidate: true })
                          // Also update the color name field automatically
                          try {
                            const colorName = colorNamer(newHex).ntc[0].name
                            setValue(`${name}.${index}.color`, colorName)
                          } catch {
                            setValue(`${name}.${index}.color`, 'Custom Color')
                          }
                        }}
                      />
                    </div>
                  </div>
                )
              }
              return (
                <div
                  key={propertyKey}
                  className="flex flex-col max-w-xs  gap-1 flex-grow"
                >
                  {/* Use the custom label if provided, otherwise fallback to the propertyKey */}
                  <Label
                    htmlFor={fieldPath}
                    className="text-xs text-muted-foreground"
                  >
                    {labels?.[propertyKey] || propertyKey}
                    {isMandatory && <span className="text-rose-500">*</span>}
                  </Label>
                  {/* {propertyKey === 'color' && colorPicker ? (
                    <div className="flex items-center gap-x-2">
                      <ColorPicker
                        value={(currentDetail as any)?.color || ''}
                        onChange={(newColorValue) => {
                          setValue(fieldPath, newColorValue as any, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                      />
                      <Input
                        {...register(fieldPath as any)}
                        id={fieldPath}
                        className={cn(
                          'w-28 placeholder:capitalize',
                          inputClassName
                        )}
                        placeholder="Hex Color e.g. #FF0000"
                        maxLength={7}
                      />
                    </div> */}
                  {propertyKey === 'colorHex' ? (
                    <div className="flex items-center gap-x-2">
                      <ColorPicker
                        value={(currentDetail as any)?.colorHex || ''}
                        onChange={(newColorValue) => {
                          setValue(fieldPath, newColorValue as any, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                      />
                      {/* You might not need this input if the picker is enough */}
                      <Input
                        {...register(fieldPath as any)}
                        id={fieldPath}
                        className={cn('w-28', inputClassName)}
                        placeholder="e.g. #FF0000"
                        maxLength={7}
                      />
                    </div>
                  ) : (
                    <Input
                      {...register(fieldPath as any, {
                        valueAsNumber: isNumeric,
                      })}
                      id={fieldPath}
                      type={isNumeric ? 'number' : 'text'}
                      className={cn('placeholder:capitalize', inputClassName)}
                      placeholder={labels?.[propertyKey] || propertyKey}
                      min={isNumeric ? 0 : undefined}
                      step={
                        isNumeric
                          ? propertyKey === 'price' ||
                            propertyKey === 'discount' ||
                            propertyKey === 'length' ||
                            propertyKey === 'width' ||
                            propertyKey === 'height' ||
                            propertyKey === 'weight'
                            ? '0.01'
                            : '1'
                          : undefined
                      }
                    />
                  )}
                </div>
              )
            })}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveDetail(index)}
              className="text-destructive hover:bg-destructive/10"
            >
              <XCircle size={20} />
            </Button>
          </div>
        )
      })}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddDetail}
        className="mt-2 self-start"
      >
        <PlusCircle size={18} className="mr-2" /> {header || 'آیتم'}
      </Button>
    </div>
  )
}

export default ClickToAddInputsRHF

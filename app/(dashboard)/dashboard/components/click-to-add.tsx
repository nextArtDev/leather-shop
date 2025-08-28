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
  colorPicker,
  containerClassName,
  inputClassName,
  labels, // Destructure the new labels prop
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
        const currentDetail = fieldItem as unknown as DetailSchemaType

        return (
          <div
            key={fieldItem.id}
            className={cn(
              'flex items-end gap-x-3 border p-4 rounded-md relative',
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

              return (
                <div
                  key={propertyKey}
                  className="flex flex-col gap-1 flex-grow"
                >
                  {/* Use the custom label if provided, otherwise fallback to the propertyKey */}
                  <Label
                    htmlFor={fieldPath}
                    className="text-xs text-muted-foreground"
                  >
                    {labels?.[propertyKey] || propertyKey}
                  </Label>
                  {propertyKey === 'color' && colorPicker ? (
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
        <PlusCircle size={18} className="mr-2" /> + {header || 'Item'}
      </Button>
    </div>
  )
}

export default ClickToAddInputsRHF

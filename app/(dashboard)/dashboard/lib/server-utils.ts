// lib/form-utils.ts

import { toast } from 'sonner'
import {
  type UseFormSetError,
  type FieldValues,
  type FieldPath,
} from 'react-hook-form'
import { PrismaClient } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'

/**
 * A generic utility function to handle setting server-side validation errors
 * on a react-hook-form instance.
 *
 * @param TFieldValues - The type of the form's values, inferred automatically.
 * @param errors - The error object from the server, typically Record<string, string[]>.
 * @param setError - The `setError` function from a `useForm` instance.
 */
export function handleServerErrors<TFieldValues extends FieldValues>(
  errors: Record<string, string[]> | null | undefined,
  setError: UseFormSetError<TFieldValues>
) {
  // If there are no errors, do nothing.
  if (!errors) return

  for (const [field, messages] of Object.entries(errors)) {
    if (field === '_form') {
      // Handle form-level errors with a toast.
      toast.error(messages.join(' و '))
    } else {
      // Set field-specific errors.
      // We assert the field name is a valid path in our form values.
      setError(field as FieldPath<TFieldValues>, {
        type: 'server',
        message: messages.join(' و '),
      })
    }
  }
}
export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = 'slug',
  separator: string = '-'
) => {
  'use server'
  let slug = baseSlug
  let suffix = 1

  while (true) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exisitngRecord = await (prisma[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    })

    if (!exisitngRecord) {
      break
    }
    slug = `${slug}${separator}${suffix}`
    suffix += 1
  }
  return slug
}

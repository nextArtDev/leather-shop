'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PhoneInput } from '@/components/ui/phone-input'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { signInFormSchema } from '../../lib/schemas'

// const signInFormSchema = z.object({
//   phone: z
//     .string()
//     .refine(
//       (value) => {
//         // Remove any non-digit characters
//         const cleanedValue = value.replace(/D/g, '')

//         // Check the length conditions
//         return (
//           cleanedValue.length === 10 ||
//           (cleanedValue.length === 11 && cleanedValue.startsWith('0'))
//         )
//       },
//       {
//         message:
//           'Phone number must be exactly 10 digits or 11 digits starting with 0.',
//       }
//     )
//     .transform((value) => {
//       // Remove the leading zero if present
//       const cleanedValue = value.replace(/D/g, '')
//       return cleanedValue.startsWith('0') ? cleanedValue.slice(1) : cleanedValue
//     }),
// })
export default function SignInForm() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      phone: '',
    },
  })

  function onSubmit(values: z.infer<typeof signInFormSchema>) {
    try {
      console.log(values)
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <Card dir="rtl" className="text-center">
      <CardTitle>لطفا شماره موبایل خود را وارد کنید.</CardTitle>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto py-10"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl className="w-full">
                    <article dir="ltr">
                      <PhoneInput
                        placeholder="9352310831"
                        {...field}
                        defaultCountry="IR"
                      />
                    </article>
                  </FormControl>
                  <FormDescription>Enter your phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>کد تایید به این شماره ارسال می‌شود.</CardFooter>
    </Card>
  )
}

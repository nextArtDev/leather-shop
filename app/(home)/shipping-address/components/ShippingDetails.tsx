'use client'

import { useEffect, useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// import { toast } from 'sonner'

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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProvinceCityInput } from '../../../components/shared/province/LocationSelection'
import { shippingAddressSchema } from '@/app/(home)/lib/validators/home'
import { ShippingAddress } from '@/app/(home)/types'
import { toast } from 'sonner'

import { updateUserAddress } from '@/app/(home)/lib/actions/user.action'
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ShippingDetails = ({
  address: initialData,
}: {
  address?: ShippingAddress
}) => {
  const [provinceName, setProvinceName] = useState<string>(
    initialData?.location[0] || ''
  )
  const [cityName, setCityName] = useState<string>(
    initialData?.location[1] || ''
  )

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: initialData || {
      fullName: '',
      location: ['', ''],
      streetAddress: '',
      postalCode: '',
      //   lat: 0.0,
      //   lng: 0.0,
    },
  })

  function onSubmit(data: z.infer<typeof shippingAddressSchema>) {
    // toast(
    //   <div className="mt-2 w-full rounded-md bg-slate-950 p-4">
    //     <pre className="text-white">
    //       <code>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   </div>
    // )

    // Also log to console
    console.log('Form submitted:', data)
    startTransition(async () => {
      const res = await updateUserAddress(data)

      if (!res.success) {
        toast.error(res.message)
        return
      }

      router.push('/place-order')
    })
  }
  useEffect(() => {
    form.watch('location')
  }, [form])

  return (
    <section
      aria-labelledby="payment-and-shipping-heading"
      className="space-y-6  py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pt-0 lg:pb-24"
    >
      <h2 id="payment-and-shipping-heading" className="sr-only">
        Payment and shipping details
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0 space-y-12 "
        >
          <h3 id="contact-info-heading" className="text-lg font-medium ">
            اطلاعات ارسال و تماس
          </h3>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام و نام‌خانوادگی گیرنده</FormLabel>
                <FormControl>
                  <Input placeholder="نام و نام‌خانوادگی" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div>
                  <FormLabel>انتخاب استان و شهر</FormLabel>
                  <FormDescription className="mt-1">
                    لطفاً ابتدا استان و سپس شهر خود را انتخاب کنید
                  </FormDescription>
                </div>
                <FormControl>
                  <ProvinceCityInput
                    provinces={provincesData}
                    initialProvinceName={provinceName}
                    initialCityName={cityName}
                    onProvinceChange={(province) => {
                      const name = province?.name || ''
                      setProvinceName(name)
                      form.setValue('location', [name, cityName])
                    }}
                    onCityChange={(city) => {
                      const name = city?.name || ''
                      setCityName(name)
                      form.setValue('location', [provinceName, name])
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>آدرس کامل</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="آدرس کامل"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>کد پستی</FormLabel>
                <FormControl>
                  <Input placeholder="کدپستی" type="number" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 w-full hover:bg-indigo-500 text-white !cursor-pointer"
            >
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  ادامه
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default ShippingDetails

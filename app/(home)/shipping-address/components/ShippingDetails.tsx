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
import provincesData from '@/constants/cities.json'

// import { updateUserAddress } from '@/app/(home)/lib/actions/user.action'
import { toast } from 'sonner'

import { ArrowLeft, Loader } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import ProvinceCity from './LocationSelection'
import { City, Province, ShippingAddress, User } from '@/lib/generated/prisma'
import { shippingAddressSchema } from '@/lib/home/schemas'
import { handleServerErrors } from '@/app/(dashboard)/dashboard/lib/server-utils'
import {
  createShippingAddress,
  editShippingAddress,
} from '@/lib/home/actions/user'

const ShippingDetails = ({
  provinces,
  phone,
  initialData,
}: {
  provinces: Province[]
  phone: string
  initialData?: Partial<
    ShippingAddress & {
      city: City
      province: Province
      User: User
    }
  > | null
}) => {
  // console.log(initialData)
  // const [provinceName, setProvinceName] = useState<string>(
  //   initialData?.provinceId || ''
  // )
  // const [cityName, setCityName] = useState<string>(initialData?.cityId || '')
  const path = usePathname()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      name: initialData?.name,
      address1: initialData?.address1 || '',
      // address2: initialData?.address2 || '',
      // countryId: initialData?.countryId,
      // phone: initialData?.phone,
      cityId: Number(initialData?.cityId) || 0,
      provinceId: Number(initialData?.provinceId) || 0,
      // state: initialData?.state,
      zip_code: initialData?.zip_code,
      // default: typeof initialData?.default === 'boolean' ? initialData.default : false,
      // default: initialData?.default ||false ||undefined,
      //   lat: 0.0,
      //   lng: 0.0,
    },
  })

  function onSubmit(data: z.infer<typeof shippingAddressSchema>) {
    // console.log('Form submitted:', data)
    startTransition(async () => {
      try {
        if (initialData?.id) {
          const res = await editShippingAddress(data, initialData.id, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
          router.push('/place-order')
        } else {
          const res = await createShippingAddress(data, phone, path)
          if (res?.errors) handleServerErrors(res.errors, form.setError)
          router.push('/place-order')
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
          return
        }
        toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
      }
    })
  }
  //   startTransition(async () => {
  //     // const res = await updateUserAddress(data)
  //     // if (!res.success) {
  //     //   toast.error(res.message)
  //     //   return
  //     // }
  //     // router.push('/place-order')
  //   })
  // }
  // useEffect(() => {
  //   form.watch('location')
  // }, [form])

  // console.log(phone)
  return (
    <section
      aria-labelledby="payment-and-shipping-heading"
      className="space-y-6  py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pt-0 lg:pb-24"
    >
      <h2 id="payment-and-shipping-heading" className="sr-only">
        Payment and shipping details
      </h2>

      <Input dir="ltr" disabled className="text-right max-w-sm" value={phone} />
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام و نام‌خانوادگی گیرنده</FormLabel>
                <FormControl>
                  <Input placeholder="و  نام و نام‌خانوادگی" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-6">
            <FormLabel>انتخاب استان و شهر</FormLabel>

            <ProvinceCity
              provinces={provinces}
              // initialData={{
              //   city: initialData?.city,
              //   province: initialData?.province,
              // }}
              // initialProvince={
              //   initialData?.provinceId
              //     ? initialData?.provinceId.toString()
              //     : ''
              // }
              // initialCity={
              //   initialData?.cityId ? initialData?.cityId.toString() : ''
              // }
            />

            {/* <FormMessage /> */}
          </div>

          <div className="!mt-3 flex flex-col gap-3">
            <FormField
              // disabled={isLoading}
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="خیابان، کوچه، محله..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
                disabled={isLoading}
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Apt, suite, unit, etc (optional）"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
          </div>

          <FormField
            // disabled={isLoading}
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem className="flex-1 w-[calc(50%-8px)] !mt-3">
                <FormControl>
                  <Input placeholder="کدپستی" {...field} />
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

'use server'

import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { shippingAddressSchema } from '../schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface CreateShippingAddressFormState {
  success?: string
  errors: {
    name?: string[]
    address1?: string[]
    cityId?: string[]
    provinceId?: string[]
    zip_code?: string[]
    _form?: string[]
  }
}

export async function createShippingAddress(
  data: unknown,
  phone: number,
  path: string
): Promise<CreateShippingAddressFormState> {
  const result = shippingAddressSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  try {
    // console.log({ address })
    const cUser = await currentUser()
    if (!cUser || !cUser.phoneNumber) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }

    const userAddress = await prisma.user.findFirst({
      where: {
        phoneNumber: phone.toString(),
      },
    })
    if (cUser.id !== userAddress?.id) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    const user = await prisma.user.findFirst({
      where: {
        id: cUser.id,
      },
      include: {
        shippingAddresses: {
          include: {
            city: true,
            province: true,
          },
        },
      },
    })

    await prisma.shippingAddress.create({
      data: {
        name: result.data.name,
        zip_code: result.data.zip_code,
        cityId: +result.data.cityId,
        provinceId: +result.data.provinceId,
        address1: result.data.address1,
        userId: cUser.id,
        phone: cUser.phoneNumber,
        //  images: {
        //    connect: imageIds.map((id) => ({
        //      id: id,
        //    })),
        //  },
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  //   redirect(`/place-order`)
}

'use server'

import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { shippingAddressSchema } from '../schemas'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateCartWithShipping } from './cart'

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
  phone: string,
  path: string
): Promise<CreateShippingAddressFormState> {
  const result = shippingAddressSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log('phone', phone)
  // console.log('result.data', result.data)
  try {
    const cUser = await currentUser()
    // console.log('cUser', cUser)
    if (!cUser || !cUser.phoneNumber) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }

    const userAddress = await prisma.user.findFirst({
      where: {
        id: cUser.id,
      },
    })

    if (cUser.id !== userAddress?.id) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    // console.log(user)
    const shippingAddress = await prisma.shippingAddress.create({
      data: {
        name: result.data.name,
        zip_code: result.data.zip_code,
        cityId: +result.data.cityId,
        provinceId: +result.data.provinceId,
        address1: result.data.address1,
        userId: cUser.id,
        phone: phone.toString(),
        //  images: {
        //    connect: imageIds.map((id) => ({
        //      id: id,
        //    })),
        //  },
      },
      include: {
        province: {
          select: {
            name: true,
          },
        },
        city: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            cart: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })

    const AddressToSaveForUser = `${shippingAddress?.province.name}-${shippingAddress?.city.name} | ${shippingAddress.address1} - ${shippingAddress.zip_code}`

    await prisma.user.update({
      where: {
        id: cUser.id,
      },
      data: {
        address: AddressToSaveForUser,
        name: result.data.name,
      },
    })
    await updateCartWithShipping(
      shippingAddress.user.cart?.id as string,
      shippingAddress.id
    )
    // console.log({ shippingFee })
    // updateCartWithShipping(cart)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/place-order`)
}
interface EditShippingAddressFormState {
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

export async function editShippingAddress(
  data: unknown,
  shippingAddressId: string,
  path: string
): Promise<EditShippingAddressFormState> {
  const result = shippingAddressSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  if (!shippingAddressId) {
    return {
      errors: {
        _form: ['آدرس مورد نظر در دسترس نیست!'],
      },
    }
  }
  try {
    const cUser = await currentUser()
    if (!cUser || !cUser.phoneNumber) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    const isExisting = await prisma.shippingAddress.findFirst({
      where: {
        id: shippingAddressId,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['آدرس مورد نظر در دسترس نیست!'],
        },
      }
    }

    const userAddress = await prisma.user.findFirst({
      where: {
        id: cUser.id,
      },
    })

    if (cUser.id !== userAddress?.id) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
    await prisma.user.findFirst({
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
    // console.log(user)
    const shippingAddress = await prisma.shippingAddress.update({
      where: { id: shippingAddressId },
      data: {
        name: result.data.name,
        zip_code: result.data.zip_code,
        cityId: +result.data.cityId,
        provinceId: +result.data.provinceId,
        address1: result.data.address1,
        userId: cUser.id,
        // phone: phone.toString(),
        //  images: {
        //    connect: imageIds.map((id) => ({
        //      id: id,
        //    })),
        //  },
      },
      include: {
        province: {
          select: {
            name: true,
          },
        },
        city: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            cart: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
    await updateCartWithShipping(
      shippingAddress.user.cart?.id as string,
      shippingAddress.id
    )
    // console.log({ shippingFee })
    const AddressToSaveForUser = `${shippingAddress?.province.name}-${shippingAddress?.city.name} | ${shippingAddress.address1} - ${shippingAddress.zip_code}`

    await prisma.user.update({
      where: {
        id: cUser.id,
      },
      data: {
        address: AddressToSaveForUser,
        name: result.data.name,
      },
    })

    // console.log(res)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/place-order`)
}

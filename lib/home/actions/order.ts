'use server'

import prisma from '@/lib/prisma'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { getValidatedCart } from './cart'
import { getUserById } from '../queries/user'
import { updateOrderToPaid } from './payment1'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth-helpers'

export async function createOrder() {
  try {
    const session = await getCurrentUser()
    // if (!session) throw new Error('User is not authenticated')

    // const cart = await getMyCart()
    const userId = session?.id

    if (!userId) {
      return {
        success: false,
        message: 'وارد حساب کاربری خود شوید!',
        redirectTo: '/sign-in',
      }
    }

    const user = await getUserById(userId)

    const cart = await getValidatedCart()
    if (!cart || !cart.cart?.items) {
      return {
        success: false,
        message: 'سبد خرید شما خالی است!',
        redirectTo: '/cart',
      }
    }

    if (!user?.shippingAddresses.length) {
      return {
        success: false,
        message: 'آدرس پستی موجود نیست!',
        redirectTo: '/shipping-address',
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        shippingAddressId: user.shippingAddresses[0].id,
        orderStatus: 'Pending',
        paymentStatus: 'Pending',
        subTotal: cart.cart.subTotal, // Will calculate below
        shippingFees: cart.cart.shippingFees, // Will calculate below
        total: cart.cart.total, // Will calculate below
      },
    })

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      for (const item of cart?.cart?.items ?? []) {
        await tx.orderItem.create({
          data: {
            productId: item.productId,
            sizeId: item.sizeId,
            productSlug: item.productSlug,
            sku: item.sku,
            name: item.name,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            shippingFee: item.shippingFee,
            totalPrice: item.totalPrice,
            orderId: order.id,
          },
        })
        // console.log({ orders })
      }

      await tx.cart.delete({
        where: {
          userId,
        },
      })
      //   console.log({ res })
      return order.id
    })
    // console.log({ insertedOrderId })

    if (!insertedOrderId) throw new Error('Order not created')

    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error
    return { success: false, message: error }
  }
}

export async function updateOrderToPaidCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId })

    revalidatePath(`/order/${orderId}`)

    return { success: true, message: 'Order marked as paid' }
  } catch (error) {
    // return { success: false, message: formatError(error) }
    return { success: false, message: error }
  }
}

export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error('Order not found')
    if (order.paymentStatus !== 'Paid') throw new Error('Order is not paid')

    await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'Delivered',
        // isDelivered: true,
        // deliveredAt: new Date(),
      },
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'سفارش به عنوان تحویل داده شده، ثبت شد.',
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

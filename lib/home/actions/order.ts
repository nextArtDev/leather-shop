'use server'

import { auth } from '@/lib/auth'
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
    // if (!user.paymentMethod) {
    //   return {
    //     success: false,
    //     message: 'No payment method',
    //     redirectTo: '/payment-method',
    //   }
    // }

    // Create order object
    // const order = insertOrderSchema.parse({
    //   userId: user.id,
    //   shippingAddress: user.address1,
    //   itemsPrice: cart.subTotal,
    //   shippingPrice: cart.shippingFees,
    //   //   taxPrice: cart.taxPrice,
    //   totalPrice: cart.total,
    // })

    // <----- IMPORTANT ---->

    //  let shippingFee = 0
    //  const { shippingFeeMethod } = product
    //  if (shippingFeeMethod === 'ITEM') {
    //    shippingFee =
    //      quantity === 1
    //        ? details.shippingFee
    //        : details.shippingFee + details.extraShippingFee * (quantity - 1)
    //  } else if (shippingFeeMethod === 'WEIGHT') {
    //    shippingFee = details.shippingFee * variant.weight * quantity
    //  } else if (shippingFeeMethod === 'FIXED') {
    //    shippingFee = details.shippingFee
    //  }
    // <----- IMPORTANT ---->

    const order = await prisma.order.create({
      data: {
        userId: userId,
        shippingAddressId: user.shippingAddresses[0].id,
        orderStatus: 'Pending',
        paymentStatus: 'Pending',
        subTotal: cart.cart.subTotal, // Will calculate below
        shippingFees: 0, // Will calculate below
        total: cart.cart.total, // Will calculate below
      },
    })

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      //   const insertedOrder = await tx.order.create({ data: order })
      // Create order items from the cart items
      for (const item of cart?.cart?.items ?? []) {
        const orders = await tx.orderItem.create({
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
    console.log({ insertedOrderId })

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

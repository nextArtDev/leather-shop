import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function getMyCart() {
  // Check for cart cookie
  //   const sessionCartId = (await cookies()).get('sessionCartId')?.value
  // if (!sessionCartId) throw new Error('Cart session not found')

  // Get session and user ID
  const user = await currentUser()
  const userId = user?.id
  if (!userId) return undefined

  // console.log({ session })
  // Get user cart from database
  //   const cart = await prisma.cart.findFirst({
  //     where: userId ? { userId: userId } : { sessionCartId: userId },
  //   })
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      cartItems: {
        include: {},
      },
    },
  })

  if (!cart) return undefined
  return cart
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      shippingAddresses: {
        include: {
          city: true,
          province: true,
        },
      },
    },
  })
  if (!user) throw new Error('User not found')

  return user
}

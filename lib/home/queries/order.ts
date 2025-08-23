import prisma from '@/lib/prisma'

export async function getOrderById(orderId: string) {
  try {
    const { unstable_noStore } = await import('next/cache')
    unstable_noStore()
    const data = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        paymentDetails: true,

        items: true,
        shippingAddress: {
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
          },
        },
        user: { select: { name: true, phoneNumber: true, role: true } },
        // paymentDetails:true
      },
    })

    return data
  } catch (error) {
    console.error(error)
    // unstable_noStore not available, continue without it
  }
}

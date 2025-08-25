import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './components/order-details-table1'
import { getOrderById } from '@/lib/home/queries/order'
import { getCurrentUser } from '@/lib/auth-helpers'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata: Metadata = {
  title: 'جزئیات سفارش',
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>
}) => {
  const productId = (await params).orderId
  const [order, currentUser] = await Promise.all([
    getOrderById(productId),
    getCurrentUser(),
  ])

  if (!order) notFound()
  const isAdmin = currentUser?.role === 'ADMIN' || false

  return (
    <section>
      <Suspense>
        <OrderDetailsTable
          order={{
            ...order,
            shippingAddress: {
              ...order.shippingAddress,
              province: order.shippingAddress.province,
              city: order.shippingAddress.city,
            },
            user: {
              name: order.user.name,
              phoneNumber: order.user.phoneNumber ?? '', // fallback to empty string if null
            },
          }}
          isAdmin={isAdmin}
        />
      </Suspense>
    </section>
  )
}

export default OrderDetailsPage

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './components/order-details-table1'
import { getOrderById } from '@/lib/home/queries/order'
import { ShippingAddress } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
// Import the helper

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const metadata: Metadata = {
  title: 'Order Details',
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>
}) => {
  const productId = (await params).orderId

  // Get both order and current user
  const [order, currentUser] = await Promise.all([
    getOrderById(productId),
    getCurrentUser(),
  ])

  if (!order) notFound()

  console.log('Fetching order with ID:', productId)
  console.log('Fetched order:', {
    found: !!order,
    id: order?.id,
  })

  // Determine if current user is admin
  const isAdmin = currentUser?.role === 'ADMIN' || false

  return (
    <section>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        isAdmin={isAdmin}
      />
    </section>
  )
}

export default OrderDetailsPage

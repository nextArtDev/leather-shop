import { format } from 'date-fns-jalali'
import { getAllOrders } from '../../lib/queries'
import { DataTable } from '../comments/components/DataTable'
import { columns, OrderTypeColumn } from './components/columns'
import { Heading } from '../comments/components/Heading'
import { Separator } from '@/components/ui/separator'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
import {
  City,
  OrderItem,
  Province,
  ShippingAddress,
} from '@/lib/generated/prisma'

async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const orders = await getAllOrders({ page, pageSize })
  // console.log(orders.order?.map((t) => t.shippingAddressId))
  const formattedComments: OrderTypeColumn[] = orders.order?.map((item) => ({
    id: item.id,
    name: item.user.name ?? '',
    paymentStatus: item.paymentStatus as PaymentStatus,
    orderStatus: item.orderStatus as OrderStatus,
    shippingAddress: item.shippingAddress as ShippingAddress & {
      province: Province | null
    } & {
      city: City | null
    },
    user: item.user,
    total: item.total || undefined,
    items: item.items as OrderItem[],
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`سفارشات (${formattedComments?.length})`}
          description="سفارشات را مدیریت کنید."
        />

        <Separator />
        {!!orders?.order.length && !!formattedComments && (
          <DataTable
            searchKey="name"
            columns={columns}
            data={formattedComments}
            pageNumber={page ? +page : 1}
            pageSize={pageSize}
            isNext={orders.isNext}
          />
        )}
        <Separator />
      </div>
    </div>
  )
}

export default AdminOrdersPage

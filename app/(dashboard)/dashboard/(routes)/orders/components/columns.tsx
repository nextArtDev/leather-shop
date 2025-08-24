'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { Expand } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'

import OrderStatusSelect from './order-status-select'
import StoreOrderSummary from './store-order-summary'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
import CustomModal from '../../../components/custom-modal'
import PaymentStatusTag from './payment-status'
import { OrderItem } from '@/lib/generated/prisma'
import { DetailedOrder } from '../../../lib/queries'

export type OrderTypeColumn = {
  id: string
  name: string | null
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  items: OrderItem[]
  total: number | undefined

  // name: string | null
  // isPending: boolean
  // description: string | null
}

export const columns: ColumnDef<OrderTypeColumn>[] = [
  {
    accessorKey: 'id',
    header: 'سفارش',
    cell: ({ row }) => {
      return <span>{row.original.id}</span>
    },
  },
  {
    accessorKey: 'products',
    header: 'محصولات',
    cell: ({ row }) => {
      const images = row.original.items.map((product) => product.image)
      return (
        <div className="flex flex-wrap gap-1">
          {images.map((img, i) => (
            <Image
              key={`${img}-${i}`}
              src={img}
              alt=""
              width={100}
              height={100}
              className="w-7 h-7 object-cover rounded-full"
              style={{ transform: `translateX(-${i * 15}px)` }}
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'پرداخت',
    cell: ({ row }) => {
      return (
        <div>
          <PaymentStatusTag
            status={row.original.paymentStatus as PaymentStatus}
            isTable
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      return (
        <div>
          <OrderStatusSelect
            orderId={row.original.id}
            status={row.original.orderStatus as OrderStatus}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'total',
    header: 'مجموع',
    cell: ({ row }) => {
      return <span> {row.original.total}</span>
    },
  },
  {
    accessorKey: 'open',
    header: '',
    cell: ({ row }) => {
      return <ViewOrderButton order={row.original} />
    },
  },
]

interface ViewOrderButtonProps {
  order: Partial<DetailedOrder>
}

const ViewOrderButton: React.FC<ViewOrderButtonProps> = ({ order }) => {
  const { setOpen } = useModal()

  return (
    <button
      className="font-sans flex justify-center gap-2 items-center mx-auto text-lg text-gray-50 bg-secondary backdrop-blur-md lg:font-semibold isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-primary-foreground hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
      onClick={() => {
        setOpen(
          <CustomModal maxWidth="!max-w-3xl">
            <StoreOrderSummary order={order} />
          </CustomModal>
        )
      }}
    >
      <span className="w-7 h-7 rounded-full  grid place-items-center">
        <Expand className="w-5 stroke-background" />
      </span>
    </button>
  )
}

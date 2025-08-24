import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderStatus } from '@/lib/types/home'

import { FC, useActionState } from 'react'
import OrderStatusTag from './order-status'
import { usePathname } from 'next/navigation'
import { updateOrderItemStatus } from '@/lib/home/actions/order'

interface Props {
  orderId: string
  status: OrderStatus
}

const OrderStatusSelect: FC<Props> = ({ orderId, status }) => {
  const path = usePathname()

  const [actionState, updateAction, pending] = useActionState(
    updateOrderItemStatus.bind(null, path, orderId),
    {
      status: status,
      errors: {},
    }
  )

  // Get current status from action state or fallback to prop
  const currentStatus = (actionState.status as OrderStatus) || status

  // Options - exclude current status
  const options = Object.values(OrderStatus).filter((s) => s !== currentStatus)

  // Handle status selection
  const handleStatusChange = (selectedStatus: OrderStatus) => {
    const formData = new FormData()
    formData.append('status', selectedStatus)
    updateAction(formData)
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-fit bg-transparent"
            disabled={pending}
          >
            <OrderStatusTag status={currentStatus} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="center">
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleStatusChange(option)}
              className="w-full h-full flex items-center justify-center cursor-pointer"
              disabled={pending}
            >
              <OrderStatusTag status={option} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default OrderStatusSelect

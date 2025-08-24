import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderStatus } from '@/lib/types/home'

import { FC, useState } from 'react'
import { toast } from 'sonner'
import OrderStatusTag from './order-status'

interface Props {
  orderId: string
  status: OrderStatus
}

const OrderStatusSelect: FC<Props> = ({ orderId, status }) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(status)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Options
  const options = Object.values(OrderStatus).filter((s) => s !== newStatus)

  // Handle click
  const handleClick = async (selectedStatus: OrderStatus) => {
    // try {
    //   const response = await updateOrderGroupStatus1(orderId, selectedStatus)
    //   if (response) {
    //     setNewStatus(response as OrderStatus)
    //     setIsOpen(false)
    //   }
    // } catch (error: unknown) {
    //   toast.error(error.toString())
    // }
  }
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit bg-transparent">
            <OrderStatusTag status={newStatus} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="center">
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleClick(option)}
              className="w-full h-full flex items-center justify-center"
            >
              <OrderStatusTag status={option} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Current status */}
      {/* <div
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <OrderStatusTag status={newStatus} />
      </div> */}
      {/* Dropdown */}
      {/* {isOpen && (
        <div className="absolute !z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => handleClick(option)}
            >
              <OrderStatusTag status={option} />
            </button>
          ))}
        </div>
      )} */}
    </div>
  )
}

export default OrderStatusSelect

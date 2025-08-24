import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderStatus } from '@/lib/types/home'

import { FC, useActionState, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import OrderStatusTag from './order-status'
import { usePathname } from 'next/navigation'
import { updateOrderItemStatus } from '@/lib/home/actions/order'

interface Props {
  orderId: string
  status: OrderStatus
}

const OrderStatusSelect: FC<Props> = ({ orderId, status }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>(status)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const path = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ActionState, deleteAction, pending] = useActionState(
    updateOrderItemStatus.bind(null, path, orderId as string),
    {
      status: '',
      errors: {},
    }
  )
  useEffect(() => {
    // console.log({ ActionState })
    if (ActionState.status) {
      console.log(ActionState.status)
      setNewStatus(ActionState.status as OrderStatus)
    }
  }, [ActionState])

  // Options
  const options = Object.values(OrderStatus).filter((s) => s !== newStatus)

  // Handle click
  // const handleClick = async (selectedStatus: OrderStatus) => {
  //   console.log({ selectedStatus })
  //   // try {
  //   //   const response = await updateOrderGroupStatus1(orderId, selectedStatus)
  //   //   if (response) {
  //   //     setNewStatus(response as OrderStatus)
  //   //     setIsOpen(false)
  //   //   }
  //   // } catch (error: unknown) {
  //   //   toast.error(error.toString())
  //   // }
  // }
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="submit"
            variant="outline"
            className="w-fit bg-transparent"
          >
            <OrderStatusTag status={newStatus} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="center">
          {options.map((option) => (
            <form
              key={option}
              action={deleteAction}
              // onSubmit={(e) => {
              //   e.preventDefault()
              //   // buttonRef.current?.click()
              //   // console.log(e.currentTarget)
              //   // handleClick(option)
              // }}
            >
              <DropdownMenuItem
                onClick={() => {
                  buttonRef.current?.click()
                  // handleClick(option)
                }}
                className="w-full h-full flex items-center justify-center"
              >
                <OrderStatusTag status={option} />
                <input
                  type="text"
                  name="status"
                  value={option}
                  onChange={() => setNewStatus(option)}
                  className="hidden"
                />
                <button
                  ref={buttonRef}
                  type="submit"
                  className="hidden"
                ></button>
              </DropdownMenuItem>
            </form>
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

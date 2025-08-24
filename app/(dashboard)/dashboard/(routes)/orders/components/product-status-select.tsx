import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductStatus } from '@/lib/generated/prisma'
import { FC, useState } from 'react'
import { toast } from 'sonner'
import ProductStatusTag from './product-status'

interface Props {
  orderItemId: string
  status: ProductStatus
}

const ProductStatusSelect: FC<Props> = ({ orderItemId, status }) => {
  const [newStatus, setNewStatus] = useState<ProductStatus>(status)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Options
  const options = Object.values(ProductStatus).filter((s) => s !== newStatus)

  // Handle click
  const handleClick = async (selectedStatus: ProductStatus) => {
    // try {
    //   const response = await updateOrderItemStatus1(
    //     orderItemId,
    //     selectedStatus
    //   )
    //   if (response) {
    //     setNewStatus(response as ProductStatus)
    //     setIsOpen(false)
    //   }
    // } catch (error: any) {
    //   toast.error(error.toString())
    // }
  }
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit bg-transparent">
            <ProductStatusTag status={newStatus} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="center">
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleClick(option)}
              className="w-full h-full flex items-center justify-center"
            >
              <ProductStatusTag status={option} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProductStatusSelect

import { Button } from '@/components/ui/button'
import { Size } from '@/lib/generated/prisma'
import { cn } from '@/lib/utils'
import React, { FC } from 'react'

type AddToCardBtnProps = {
  sizeId: string
  size: Partial<Size>
}
const AddToCardBtn: FC<AddToCardBtnProps> = ({ sizeId, size }) => {
  // console.log({ size })
  return (
    <div>
      <Button
        disabled={!size.price}
        variant={size.price ? 'default' : 'secondary'}
        className={cn(
          'w-full rounded-sm py-6 font-bold flex justify-between items-center'
        )}
      >
        <p>خرید</p>
        {size.price && (
          <div className="flex items-center gap-1">
            <p className=" text-red-500">
              {size.discount
                ? size.price - size.price * (size.discount / 100)
                : size.price}{' '}
              تومان
            </p>
            <p className={cn('', size?.discount && 'line-through')}>
              {size.price} تومان
            </p>
          </div>
        )}
        {/* <p>${} USDT</p> */}
      </Button>
    </div>
  )
}

export default AddToCardBtn

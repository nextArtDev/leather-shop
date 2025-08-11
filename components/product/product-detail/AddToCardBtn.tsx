import { Button } from '@/components/ui/button'
import React from 'react'

const AddToCardBtn = () => {
  return (
    <div>
      <Button className="w-full rounded-sm py-6 font-bold flex justify-between items-center">
        <p>ADD TO CART</p>
        <p>$720 USDT</p>
      </Button>
    </div>
  )
}

export default AddToCardBtn

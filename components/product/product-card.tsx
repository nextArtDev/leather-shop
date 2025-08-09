import React from 'react'
import { Card, CardContent } from '../ui/card'

type Props = {}

const ProductGrid = (props: Props) => {
  return (
    <div>
      {' '}
      <div className="p-0 ">
        <Card className="rounded-none bg-red-500">
          <CardContent className="flex aspect-square items-center justify-center  ">
            <span className="text-3xl font-semibold">{index + 1}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductGrid

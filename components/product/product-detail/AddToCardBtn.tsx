'use client'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'
import useFromStore from '@/hooks/useFromStore'
import { Size } from '@/lib/generated/prisma'
import { CartProductType } from '@/lib/types/home'
import { cn, isProductValidToAdd } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'

type AddToCardBtnProps = {
  sizeId: string
  size: Partial<Size>
  productId: string
  slug: string
  name: string
  qty: number
  image: string
  weight?: number | null
  shippingFeeMethod: string
}

const AddToCardBtn: FC<AddToCardBtnProps> = ({
  sizeId,
  size,
  productId,
  slug,
  name,
  qty,
  image,
  weight,
  shippingFeeMethod,
}) => {
  const cartItems = useFromStore(useCartStore, (state) => state.cart)
  const updateProductQty = useCartStore((state) => state.updateProductQuantity)
  const addToCart = useCartStore((state) => state.addToCart)

  const [productToBeAddedToCart, setProductToBeAddedToCart] =
    useState<CartProductType>({
      productId,
      slug,
      name,
      image,
      sizeId,
      size: size.size!,
      quantity: qty,
      price: size.price! - size.price! * ((size?.discount ?? 0) / 100),
      stock: size.quantity ?? 0,
      weight: weight || 1,
      shippingMethod: shippingFeeMethod,
      shippingFee: 0,
      extraShippingFee: 0,
    })

  const { stock } = productToBeAddedToCart
  const [isProductValid, setIsProductValid] = useState<boolean>(false)

  useEffect(() => {
    setProductToBeAddedToCart((prevProduct) => ({
      ...prevProduct,
      productId,
      slug,
      name,
      image,
      stock: size.quantity || 1,
      weight: weight ?? 1,
      sizeId: sizeId,
      size: size.size!,
      price: size.price! - size.price! * ((size?.discount ?? 0) / 100),
    }))
  }, [
    slug,
    weight,
    sizeId,
    productId,
    name,
    image,
    size.quantity,
    size.size,
    size.price,
    size.discount,
  ])

  useEffect(() => {
    const check = isProductValidToAdd(productToBeAddedToCart)
    setIsProductValid(check)
  }, [productToBeAddedToCart])

  // Find existing item in cart
  const existItem = cartItems?.find(
    (x) => x.productId === productId && x.sizeId === sizeId
  )

  // Calculate remaining stock available for this item
  const remainingStock = existItem ? stock - existItem.quantity : stock

  const handleAddQtyToCart = async () => {
    if (existItem && existItem.quantity < stock) {
      updateProductQty(existItem, existItem.quantity + 1)
    }
  }

  const handleAddToCart = async () => {
    if (!isProductValid || remainingStock <= 0) return
    addToCart(productToBeAddedToCart)
  }

  const handleRemoveFromCart = async () => {
    if (existItem) {
      updateProductQty(existItem, existItem.quantity - 1)
    }
  }

  console.log(cartItems)
  if (existItem) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Button
          type="button"
          variant="outline"
          size={'icon'}
          className="rounded-full cursor-pointer"
          onClick={handleRemoveFromCart}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <span className="px-2 text-green-500 text-xl">
          {existItem.quantity}
        </span>

        <Button
          type="button"
          size={'icon'}
          variant="outline"
          className="rounded-full cursor-pointer"
          onClick={handleAddQtyToCart}
          disabled={existItem.quantity >= stock}
        >
          <Plus className="w-4 h-4" />
        </Button>

        {existItem.quantity >= stock ? (
          <span className="px-2 py-3 block text-center text-rose-300 text-xs">
            {'اتمام موجودی!'}
          </span>
        ) : (
          <span className="px-2 py-3 block text-center text-rose-300 text-xs">
            {stock - existItem.quantity} عدد در انبار
          </span>
        )}
      </div>
    )
  }

  // If item doesn't exist in cart, show add to cart button
  return (
    <Button
      disabled={!size.price || !isProductValid || remainingStock <= 0}
      variant={size.price ? 'default' : 'secondary'}
      onClick={handleAddToCart}
      className={cn(
        'w-full rounded-sm py-6 font-bold flex justify-between items-center'
      )}
    >
      <p>خرید</p>
      {size.price && (
        <div className="flex items-center gap-1">
          {!!size.discount && (
            <p className="text-red-500">
              {size.price - size.price * (size.discount / 100)} تومان
            </p>
          )}
          <p className={cn('', size?.discount && 'line-through')}>
            {size.price} تومان
          </p>
        </div>
      )}
    </Button>
  )
}

export default AddToCardBtn

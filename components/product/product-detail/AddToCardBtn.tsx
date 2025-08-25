'use client'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'
import useFromStore from '@/hooks/useFromStore'
import { CartProductType } from '@/lib/types/home'
import { cn, isProductValidToAdd } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'

type AddToCardBtnProps = {
  sizeId: string
  size: string
  discount: number
  price: number
  stockQuantity: number
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
  discount,
  price,
  stockQuantity,
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
      size: size,
      quantity: qty,
      price: price! - price! * ((discount ?? 0) / 100),
      stock: stockQuantity,
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
      stock,
      weight: weight ?? 1,
      sizeId: sizeId,
      size: size!,
      price: price! - price! * ((discount ?? 0) / 100),
    }))
  }, [
    slug,
    weight,
    sizeId,
    productId,
    name,
    image,
    stock,
    size,
    price,
    discount,
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
      <div className="flex flex-col w-full h-full items-center justify-center">
        <article className="flex  w-full h-full items-center justify-center">
          <Button
            type="button"
            variant="outline"
            // size={'icon'}
            className="rounded-md cursor-pointer w-7 h-7 sm:w-9 sm:h-9"
            onClick={handleRemoveFromCart}
          >
            <Minus className="w-2 h-2 sm:w-4 sm:h-4" />
          </Button>

          <span className="px-1 sm:px-2 text-green-500 text-xl">
            {existItem.quantity}
          </span>

          <Button
            type="button"
            // size={'icon'}
            variant="outline"
            className="rounded-md cursor-pointer w-7 h-7 sm:w-9 sm:h-9"
            onClick={handleAddQtyToCart}
            disabled={existItem.quantity >= stock}
          >
            <Plus className="w-2 h-2 sm:w-4 sm:h-4" />
          </Button>
        </article>
        <article className="flex  w-full h-full items-center justify-center">
          {existItem.quantity >= stock ? (
            <span className="px-2 py-3 block text-center text-rose-300 text-xs">
              {'اتمام موجودی!'}
            </span>
          ) : (
            <span className="px-2 py-3 block text-center text-indigo-400 text-xs">
              {stock - existItem.quantity} عدد در انبار
            </span>
          )}
        </article>
      </div>
    )
  }

  // If item doesn't exist in cart, show add to cart button
  return (
    <Button
      disabled={!price || !isProductValid || remainingStock <= 0}
      variant={price ? 'indigo' : 'secondary'}
      onClick={handleAddToCart}
      className={cn(
        'w-full rounded-sm py-6 font-bold flex justify-between items-center'
      )}
    >
      <p>خرید</p>
      {price && (
        <div className="flex items-center gap-1">
          {!!discount && (
            <p className="text-red-300">
              {price - price * (discount / 100)} تومان
            </p>
          )}
          <p className={cn('', discount && 'line-through')}>{price} تومان</p>
        </div>
      )}
    </Button>
  )
}

export default AddToCardBtn

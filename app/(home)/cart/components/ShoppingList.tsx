import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'
import { Badge } from '@/components/ui/badge'
import { CartProductType } from '@/lib/types/home'
import { cn } from '@/lib/utils'
import { CheckIcon, ClockIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  cartItems: CartProductType[]
  mutable?: boolean
}

const ShoppingList = ({ cartItems, mutable = false }: Props) => {
  return (
    <ul
      role="list"
      className=" divide-y divide-foreground border-t border-b border-foreground"
    >
      {cartItems?.map((item) => (
        <li key={item.slug} className={cn(' flex py-6 sm:py-10')}>
          <div className="relative shrink-0 size-20 sm:size:32">
            <Image
              fill
              alt={item.name}
              src={item.image || ''}
              className="size-24 rounded-lg object-cover sm:size-32"
            />
          </div>

          <div className="relative mr-4 flex flex-1 flex-col justify-between sm:mr-6">
            <div className="">
              <div className="flex justify-between sm:grid sm:grid-cols-2">
                <div className="pl-6">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-medium line-clamp-1  hover:underline"
                  >
                    <h3 className="text-sm">{item.name}</h3>
                  </Link>
                  {/* <p className="mt-1 text-sm ">{product.color}</p> */}
                  {item.size ? (
                    <p className="mt-1 text-sm ">{item.size}</p>
                  ) : null}
                </div>
                {!mutable && (
                  <p
                    dir="ltr"
                    className="text-left px-auto text-sm font-medium "
                  >
                    {`${item.price} * ${item.quantity}  =`}
                    <Badge variant={'default'} className="text-xs md:text-sm">
                      {/* {` $${formatCurrency(
                      +product.price * product.quantity
                    )}`} */}
                      {+item.price * item.quantity}
                    </Badge>
                  </p>
                )}
              </div>

              <div
                className={cn(
                  'mt-4 flex items-center sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:block'
                )}
              >
                <div
                  className={cn(
                    'inline-grid w-full max-w-32   grid-cols-1',
                    mutable && ' lg:mr-44 '
                  )}
                >
                  {mutable ? (
                    +item.price * item.quantity
                  ) : (
                    // <AddToCardBtn  item={product} />
                    <AddToCardBtn
                      sizeId={item.sizeId}
                      weight={item.weight}
                      size={item.size}
                      discount={item.price}
                      price={item.price}
                      stockQuantity={item.stock}
                      productId={item.productId}
                      slug={item.slug}
                      name={item.name}
                      qty={item.quantity}
                      shippingFeeMethod={item.shippingMethod}
                      // stock={stock}
                      image={item.image}
                    />
                  )}
                </div>
              </div>
            </div>

            <p className="mt-4 flex space-x-2 text-sm ">
              {item.stock ? (
                <CheckIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-green-500"
                />
              ) : (
                <ClockIcon aria-hidden="true" className="size-5 shrink-0 " />
              )}

              {/* <span>
                        {product.inStock
                          ? 'In stock'
                          : `Ships in ${product.leadTime}`}
                      </span> */}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ShoppingList

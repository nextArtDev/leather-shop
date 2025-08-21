'use client'

import OrderSummary from '../../cart/components/OrderSummary'
import ShoppingList from '../../cart/components/ShoppingList'
import { CartItem } from '@/lib/generated/prisma'
import ShippingShoppingList from './ShippingShoppingList'

export default function ShippingOrders({
  cartItems,
}: {
  cartItems: CartItem[]
}) {
  // const cartItems = useFromStore(useCartStore, (state) => state.cart)

  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-indigo-900  pt-6 pb-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-24"
    >
      <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>
        <div className="divide-y divide-white/10 text-sm font-medium">
          <ShippingShoppingList cartItems={cartItems} />
        </div>
        {/* <OrderSummary cartItems={cartItems} /> */}
      </div>
    </section>
  )
}

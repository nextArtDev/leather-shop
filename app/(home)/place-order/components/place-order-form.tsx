'use client'
import { useRouter } from 'next/navigation'
import { Check, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
import { createOrder } from '@/app/(home)/lib/actions/order.action'
import { useCartStore } from '@/cart-store/useCartStore'
import { useTransition } from 'react'

const PlaceOrderForm = () => {
  const emptyCart = useCartStore((state) => state.emptyCart)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // const emptyCart = useCartStore((state) => state.emptyCart)
  // const router = useRouter()

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault()

  //   const res = await createOrder()
  //   // console.log({ res })
  //   if (res.redirectTo) {
  //     emptyCart() // useCartStore.getState().emptyCart()
  //     router.push(res.redirectTo)
  //   }
  // }
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    startTransition(async () => {
      try {
        // Empty cart immediately to prevent UI issues

        // Create order - this will redirect on success
        const res = await createOrder()
        emptyCart()
        // console.log({ res })
        if (res.redirectTo) {
          router.push(res.redirectTo)
        }
      } catch (error) {
        console.error('Order creation failed:', error)
        // Restore cart if order creation fails
        // You might want to restore cart items here
      }
    })
  }

  const PlaceOrderButton = () => {
    return (
      <Button
        disabled={isPending}
        className="w-full !cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white"
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4" />
        )}{' '}
        تایید
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  )
}

export default PlaceOrderForm

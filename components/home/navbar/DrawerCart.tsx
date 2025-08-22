'use client'

import { useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useCartStore } from '@/hooks/useCartStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import ShoppingList from '@/app/(home)/cart/components/ShoppingList'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type Props = {
  isOpen?: boolean
  onClose?: () => void
}
export default function DrawerCart({ isOpen, onClose }: Props) {
  // const cartItems = useFromStore(useCartStore, (state) => state.cart)
  const cartItems = useCartStore((state) => state.cart)
  const totalPrice = useCartStore((state) => state.totalPrice)
  const { validateAndUpdatePrices } = useCartStore()

  useEffect(() => {
    validateAndUpdatePrices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Drawer open={isOpen} onClose={onClose} shouldScaleBackground>
      <DrawerTrigger>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cart"
          className="relative "
        >
          <>
            <ShoppingBag className="h-4 w-4" />
            <span className="ml-1 w-fit h-fit p-1 text-sm font-medium text-red-500 rounded-full absolute left-1.5 -top-1.5 ">
              {cartItems?.length ?? null}
            </span>
          </>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="">
        <ScrollArea className="h-[80vh] sm:h-[60vh]   ">
          <div dir="rtl" className="mx-auto w-full max-w-[90vw]  ">
            <DrawerHeader>
              <DrawerTitle>لیست خرید</DrawerTitle>

              <h2 className="sr-only">Items in your shopping cart</h2>
              {/* <DrawerDescription>
                We value your feedback. Please rate your experience and leave a
                review.
              </DrawerDescription> */}
            </DrawerHeader>

            {!!cartItems?.length ? (
              <div className="flex flex-col gap-2 pb-12 ">
                <DrawerDescription
                  asChild
                  className="w-full h-full flex flex-col items-center justify-center gap-4"
                >
                  <>
                    <ShoppingList mutable cartItems={cartItems} />
                    <div className="py-6 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base text-muted-foreground">
                          قیمت مجموع:
                        </span>
                        <Badge
                          variant="default"
                          className="  text-sm sm:text-base px-2 py-1"
                        >
                          {totalPrice} تومان
                        </Badge>
                      </div>
                    </div>
                  </>
                </DrawerDescription>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Link
                      href={'/cart'}
                      className={cn(
                        buttonVariants({ variant: 'default' }),
                        'w-full max-w-sm mx-auto'
                      )}
                    >
                      {' '}
                      سبد خرید
                    </Link>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Link
                      href={'/'}
                      className={cn(
                        buttonVariants({ variant: 'link' }),
                        'w-full max-w-sm mx-auto'
                      )}
                    >
                      {' '}
                      ادامه &larr;
                    </Link>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            ) : (
              <article className="w-full h-full flex flex-col gap-8 items-center justify-center">
                سبد شما خالی است!
                <DrawerClose asChild>
                  <Link
                    href={'/'}
                    className={buttonVariants({ variant: 'default' })}
                  >
                    ادامه خرید
                  </Link>
                </DrawerClose>
              </article>
            )}
            {/* 
          <DrawerFooter>
          <Button className="w-full">Submit</Button>
          <DrawerClose asChild>
          <Button variant="outline" className="w-full">
          Cancel
          </Button>
          </DrawerClose>
          </DrawerFooter> */}
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

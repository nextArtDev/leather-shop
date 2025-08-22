import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'
// import { formatCurrency } from '@/lib/utils'
// import { getMyCart } from '../../lib/actions/cart.action'
// import { getUserById } from '../../lib/actions/user.action'
// import { ShippingAddress } from '../../types'
// import CheckoutSteps from '../../components/checkout-steps'
import PlaceOrderForm from './components/place-order-form'
import {
  getMyCart,
  getUserById,
  getUserShippingAddressById,
} from '@/lib/home/queries/user'
import { currentUser } from '@/lib/auth'
import CheckoutSteps from '../shipping-address/components/checkout-steps'
import { City, Province, ShippingAddress } from '@/lib/generated/prisma'
import { getCartForCheckout, getValidatedCart } from '@/lib/home/actions/cart'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/dialog'
import { DialogContent } from '@radix-ui/react-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export const metadata: Metadata = {
  title: 'Place Order',
}

const PlaceOrderPage = async () => {
  // if (cart.cart?.validationErrors)
  //   return toast(cart.cart?.validationErrors.map((er) => er.issue).join(' '))
  const cUser = await currentUser()
  const userId = cUser?.id

  if (!userId) redirect('/sign-in')

  const cart = await getValidatedCart()

  if (!cart || cart.cart?.items.length === 0) redirect('/cart')
  const shippingAddress = await getUserShippingAddressById(userId)
  if (!shippingAddress) redirect('/shipping-address')
  //   if (!user.paymentMethod) redirect('/payment-method')

  // console.log(shippingAddress)
  return (
    <section className="px-2">
      <CheckoutSteps current={2} />
      <h1 className="py-4 text-2xl font-bold text-center">تایید سفارش</h1>

      {(!cart.success || cart.cart?.validationErrors) && (
        <AlertDialog open={!!cart.cart?.validationErrors.length}>
          {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500">
                سبد خرید معتبر نیست!
              </AlertDialogTitle>
              <AlertDialogDescription>
                {cart.cart?.validationErrors.map((er) => er.issue).join(', ')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
              <AlertDialogAction asChild>
                <Link href={'/cart'}>برگشت به سبد خرید &larr;</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-2">
              <h2 className="text-xl pb-4 font-bold">آدرس ارسال</h2>
              <p>{shippingAddress?.name}</p>
              <p>
                {`${shippingAddress?.city?.name} - ${shippingAddress?.province?.name}`}{' '}
              </p>
              <p>{shippingAddress.address1}</p>
              <p>{shippingAddress.zip_code}</p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">ویرایش</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardContent className="p-4 gap-4 ">
              <h2 className="text-xl pb-4 font-bold">سفارشها</h2>
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead>سفارش</TableHead>
                    <TableHead>تعداد</TableHead>
                    <TableHead>قیمت واحد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.cart?.items?.map((item) => (
                    <TableRow key={item.productSlug}>
                      <TableCell>
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item?.image || ''}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.quantity}</span>
                      </TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>سفارشها</div>
                <div>{cart.cart?.subTotal}</div>
              </div>
              {/* <div className="flex justify-between">
                <div>مالیات</div>
                <div>{cart.taxPrice}</div>
              </div> */}
              <div className="flex justify-between">
                <div>هزینه ارسال</div>
                {/* <div>{cart.shippingFees}</div> */}
              </div>
              <div className="flex justify-between">
                <div>مجموع</div>
                <div>{cart.cart?.total}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default PlaceOrderPage

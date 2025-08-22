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
import { getMyCart, getUserById } from '@/lib/home/queries/user'
import { currentUser } from '@/lib/auth'
import CheckoutSteps from '../shipping-address/components/checkout-steps'
import { ShippingAddress } from '@/lib/generated/prisma'

export const metadata: Metadata = {
  title: 'Place Order',
}

const PlaceOrderPage = async () => {
  const cart = await getMyCart()
  const cUser = await currentUser()
  const userId = cUser?.id

  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId)

  if (!cart || cart.cartItems.length === 0) redirect('/cart')
  if (!user.address) redirect('/shipping-address')
  //   if (!user.paymentMethod) redirect('/payment-method')

  const userAddress = user.address as Partial<ShippingAddress>

  return (
    <>
      <CheckoutSteps current={2} />
      <h1 className="py-4 text-2xl font-bold">تایید سفارش</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4 font-bold">آدرس ارسال</h2>
              <p>{userAddress.name}</p>
              <p>
                {userAddress.address1}, <br />
                {`${userAddress?.city?.name} - ${userAddress?.province?.name}`}{' '}
                {/* {userAddress.postalCode}, {userAddress?.country}{' '} */}
              </p>
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
                    <TableHead>قیمت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.cartItems.map((item) => (
                    <TableRow key={item.productSlug}>
                      <TableCell>
                        <Link
                          href={`/product/{item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item?.image?.[0] || ''}
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
                      <TableCell className="text-right">
                        ${item.price}
                      </TableCell>
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
                <div>{cart.subTotal}</div>
              </div>
              {/* <div className="flex justify-between">
                <div>مالیات</div>
                <div>{cart.taxPrice}</div>
              </div> */}
              <div className="flex justify-between">
                <div>هزینه ارسال</div>
                <div>{cart.shippingFees}</div>
              </div>
              <div className="flex justify-between">
                <div>مجموع</div>
                <div>{cart.total}</div>
              </div>
              {/* <PlaceOrderForm /> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default PlaceOrderPage

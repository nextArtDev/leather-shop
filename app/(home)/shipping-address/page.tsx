// import LocationSelectorForm from '@/components/shared/province-city/LocationSelectorForm'
// import { getProvinces } from '@/lib/home/actions/location'
import { redirect } from 'next/navigation'

// import { getProvinces, getUserById } from '../../lib/actions/user.action'
// import { getMyCart } from '../../lib/actions/cart.action'
import ShippingDetails from './components/ShippingDetails'
import ShippingHeader from './components/ShippingHeader'
import ShippingOrders from './components/ShippinOrders'
import { currentUser } from '@/lib/auth'
import { getMyCart, getUserById } from '@/lib/home/queries/user'
import CheckoutSteps from './components/checkout-steps'
import { ShippingAddress } from '@/lib/generated/prisma'
import { seed } from '@/lib/home/actions/seed'
import prisma from '@/lib/prisma'
const page = async () => {
  //خوزستان ->18
  // const provinces = await getProvinces()
  //   console.log(provinces)

  const cUser = await currentUser()
  const provinces = await prisma.province.findMany()
  const userId = cUser?.id

  const cart = await getMyCart()
  if (!cart || cart.cartItems.length === 0) redirect('/cart')

  if (!userId) redirect('/sign-in')

  const user = await getUserById(userId)
  const shippingAddress = await prisma.shippingAddress.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      city: true,
      country: true,
      user: true,
    },
  })
  // const provinces = getProvinces()
  console.log(user)
  return (
    <section>
      <CheckoutSteps current={1} />
      <div
        aria-hidden="true"
        className="fixed -z-10 rounded-md top-24 left-0 hidden h-full w-1/2 lg:block"
      />
      <div
        aria-hidden="true"
        className="fixed -z-10 rounded-md top-24 right-0 hidden h-full w-1/2 dark:bg-indigo-900  md:bg-indigo-400 lg:block"
      />
      <ShippingHeader />
      <article className="relative  mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8">
        <h1 className="sr-only">Checkout</h1>
        <ShippingOrders cartItems={cart.cartItems} />
        <ShippingDetails
          provinces={provinces}
          initialData={shippingAddress}
          phone={user.phoneNumber}
        />
      </article>
    </section>
    // <section
    //   className="w-full h-full min-h-screen flex flex-col items-center
    //  justify-center max-w-md mx-auto"
    // >
    //   page
    //   {provinces.length > 0 && <LocationSelectorForm provinces={provinces} />}
    // </section>
  )
}

export default page

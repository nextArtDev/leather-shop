import React from 'react'

import CartContainer from './components/CartContainer'
import { redirect } from 'next/navigation'
import { getCurrentUserWithFetch } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

const page = async () => {
  const user = await getCurrentUserWithFetch()
  if (!user || !user?.id) redirect('/sign-in')
  return (
    <div>
      {/* <ShoppingCart /> */}
      <CartContainer />
    </div>
  )
}

export default page

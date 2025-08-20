import React from 'react'

import CartContainer from './components/CartContainer'
import { currentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await currentUser()
  if (!user || !user?.id) redirect('/sign-in')
  return (
    <div>
      {/* <ShoppingCart /> */}
      <CartContainer />
    </div>
  )
}

export default page

import React from 'react'

import MultiStepFormAuth from './components/MultiSteFormAuth'

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const page = async () => {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // })
  const session = await getCurrentUser()

  if (session?.phoneNumber) {
    redirect('/')
  }
  return (
    <section aria-label="sign-in" className=" ">
      {/* <SignInForm /> */}
      {/* <MultiStepPhoneAuth /> */}
      {/* <MultiStepAuth /> */}
      <Link
        href={'/'}
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-10 left-10 flex gap-1 font-bold'
        )}
      >
        بازگشت &larr;
      </Link>
      <div className="relative w-full h-full">
        <MultiStepFormAuth />
      </div>
    </section>
  )
}

export default page

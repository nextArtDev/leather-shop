import React from 'react'
import SignInForm from './components/SignInForm'
import MultiStepPhoneAuth from './components/MultiSignIn'
import MultiStepAuth from './components/MultiStepSign'
import MultiStepFormAuth from './components/MultiSteFormAuth'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (session) {
    redirect('/')
  }
  return (
    <div>
      {/* <SignInForm /> */}
      {/* <MultiStepPhoneAuth /> */}
      {/* <MultiStepAuth /> */}
      <MultiStepFormAuth />
    </div>
  )
}

export default page

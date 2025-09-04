import React from 'react'

import { getCurrentUserWithFetch } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import MultiStepFormAuth from '@/app/(auth)/sign-in/components/MultiSteFormAuth'
import ModalWrapper from '../components/ModalWrapper'

export const dynamic = 'force-dynamic'

const InterceptedSignInPage = async () => {
  const session = await getCurrentUserWithFetch()

  // If user is already authenticated, redirect to home
  if (session?.phoneNumber) {
    redirect('/')
  }

  return (
    <ModalWrapper>
      <MultiStepFormAuth />
    </ModalWrapper>
  )
}

export default InterceptedSignInPage

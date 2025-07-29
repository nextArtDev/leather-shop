import React from 'react'
import SignInForm from './components/SignInForm'
import MultiStepPhoneAuth from './components/MultiSignIn'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      {/* <SignInForm /> */}
      <MultiStepPhoneAuth />
    </div>
  )
}

export default page

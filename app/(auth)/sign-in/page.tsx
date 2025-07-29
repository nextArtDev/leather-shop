import React from 'react'
import SignInForm from './components/SignInForm'
import MultiStepPhoneAuth from './components/MultiSignIn'
import MultiStepAuth from './components/MultiStepSign'
import MultiStepFormAuth from './components/MultiSteFormAuth'

type Props = {}

const page = (props: Props) => {
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

// import crypto from 'crypto'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from './generated/prisma'
import { phoneNumber } from 'better-auth/plugins'
import prisma from './prisma'
import { headers } from 'next/headers'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: false, // Disable email/password since we want phone-only
  },
  plugins: [
    phoneNumber({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sendOTP: async ({ phoneNumber, code }, request) => {
        // const verificationCode = crypto.randomInt(100123, 999879)
        if (!code) {
          //   throw   Error 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!'
          return
        }
        console.log({ code, phoneNumber })
        return
        // Implement sending OTP code via SMS
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@my-site.com`
        },
        //optionally, you can also pass `getTempName` function to generate a temporary name for the user
        getTempName: (phoneNumber) => {
          return phoneNumber //by default, it will use the phone number as the name
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      callbackOnVerification: async ({ phoneNumber, user }, request) => {
        // Implement callback after phone number verification
        console.log({ phoneNumber })
        console.log({ user })
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  // advanced: {
  //   generateId: false, // Let Prisma handle ID generation
  // },
})

export const currentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })

  return session?.user
}

// export const currentRole = async () => {
// const session = await auth.api.getSession({
//   headers: await headers(), // you need to pass the headers object.
// })

//   return session?.user?.role
// }

// import crypto from 'crypto'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from './generated/prisma'
import { phoneNumber } from 'better-auth/plugins'
import prisma from './prisma'
import { headers } from 'next/headers'
import { nextCookies } from 'better-auth/next-js'

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
    nextCookies(),
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
  'use server'
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return null
  }

  // Fetch the complete user data including role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    },
  })

  return user
}

// export const currentRole = async () => {
// const session = await auth.api.getSession({
//   headers: await headers(), // you need to pass the headers object.
// })

//   return session?.user?.role
// }

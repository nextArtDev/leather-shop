import crypto from 'crypto'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
// If your Prisma file is located elsewhere, you can change the path
// import { PrismaClient } from './generated/prisma'
import { phoneNumber } from 'better-auth/plugins'
import prisma from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: false, // Disable email/password since we want phone-only
  },
  plugins: [
    phoneNumber({
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
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  //   advanced: {
  //     generateId: false, // Let Prisma handle ID generation
  //   },
})

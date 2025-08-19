import { z } from 'zod'

export const ReviewFormSchema = z.object({
  title: z
    .string()
    .min(2, 'عنوان نباید کمتر از 2 حرف باشد!')
    .max(20, 'عنوان نباید بیشتر از 20 حرف باشد'),
  description: z
    .string()
    .min(3, 'توضیحات نمی‌تواند کمتر از 3 حرف باشد.')
    .max(200, 'توضیحات نمی‌تواند بیشتر از 200 حرف باشد.'),
  rating: z
    .number()
    .int()
    .min(1, 'ستاره باید حداقل 1 باشد.')
    .max(5, 'ستاره‌ها باید حداکثر 5 باشد.'),
})

// id String @id @default(uuid())

//   title              String
//   description        String
//   isVerifiedPurchase Boolean @default(true)

//   rating Float

//   isFeatured Boolean @default(false)
//   isPending  Boolean @default(true)
//   images     Image[]

//   quantity String
//   likes    Int    @default(0)
//   user     User   @relation("ReviewToUser", fields: [userId], references: [id])
//   userId   String

//   productId String
//   product   Product @relation("ReviewToProduct", fields: [productId], references: [id])

//   createdAt DateTime @default(now())
//   updatedAt DateTime @default(now()) @updatedAt

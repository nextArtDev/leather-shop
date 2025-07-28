import z from 'zod'

export const authFormSchema = z.object({
  phone: z
    .string()
    .max(12, { message: 'شماره تلفن نمی‌تواند از 12 رقم بیشتر باشد!' }),
  code: z.string().min(6).max(6),
})

export const signInFormSchema = authFormSchema.pick({ phone: true })

import { ShippingFeeMethod } from '@/lib/generated/prisma'
import { z } from 'zod'

// Define your constants for validation
const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

// This schema remains the same
const imageObjectSchema = z.object({
  url: z.string(),
})

// This is the new schema for a single file upload
const fileSchema = z
  .instanceof(File) // Replaces zfd.file()
  .refine((file) => file.size > 0, 'File is required.') // Optional: check for empty file
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File can't be bigger than 5MB.`,
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: 'File format must be either jpg, jpeg, png or webp.',
  })

// Create the combined schema that accepts both new Files and existing image objects
const imageSchema = z
  .union([
    z.array(fileSchema), // For new file uploads
    z.array(imageObjectSchema), // For existing images being re-submitted
    z.array(z.string()), // For URLs of existing images
  ])
  .optional()

// export const CategoryFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Category name must be at least 2 characters long.' })
//     .max(50, { message: 'Category name cannot exceed 50 characters.' })
//     .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
//       message:
//         'Only letters, numbers, and spaces are allowed in the category name.',
//     }),
//   name_fa: z
//     .string()
//     .min(2, { message: 'Category name must be at least 2 characters long.' })
//     .max(50, { message: 'Category name cannot exceed 50 characters.' })
//     .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
//       message:
//         'Only letters, numbers, and spaces are allowed in the category name.',
//     })
//     .optional(),
//   images: imageSchema,
//   url: z
//     .string()
//     .min(2, { message: 'Category url must be at least 2 characters long.' })
//     .max(50, { message: 'Category url cannot exceed 50 characters.' })
//     .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
//       message:
//         'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
//     }),
//   featured: z.union([z.boolean().default(false), z.string()]),
// })

// export const CategoryServerFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Category name must be at least 2 characters long.' })
//     .max(50, { message: 'Category name cannot exceed 50 characters.' })
//     .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
//       message:
//         'Only letters, numbers, and spaces are allowed in the category name.',
//     }),
//   name_fa: z
//     .string()
//     .min(2, { message: 'Category name must be at least 2 characters long.' })
//     .max(50, { message: 'Category name cannot exceed 50 characters.' })
//     .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
//       message:
//         'Only letters, numbers, and spaces are allowed in the category name.',
//     })
//     .optional(),

//   images: imageSchema,

//   url: z
//     .string()
//     .min(2, { message: 'Category url must be at least 2 characters long.' })
//     .max(50, { message: 'Category url cannot exceed 50 characters.' })
//     .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
//       message:
//         'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
//     }),
//   featured: z.string().optional(),
// })
export const SubCategoryFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Sub Category name must be at least 2 characters long.',
  }),
  images: imageSchema,

  url: z
    .string()
    .min(2, { message: 'Sub Category url must be at least 2 characters long.' })
    .max(50, { message: 'Sub Category url cannot exceed 50 characters.' })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the sub category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.union([z.boolean().default(false)]).optional(),
  categoryId: z.string(),
})

export const ProductFormSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است.'),
  description: z.string().min(1, 'توضیحات محصول الزامی است.'),
  categoryId: z.string().min(1, 'دسته‌بندی محصول الزامی است.'),
  subCategoryId: z.string().min(1, 'زیر دسته‌بندی الزامی است.'),
  // shippingFeeMethod: z.enum(['ITEM', 'WEIGHT', 'FIXED']).default('ITEM'),
  shippingFeeMethod: z.nativeEnum(ShippingFeeMethod),
  images: z
    .union([
      z.array(z.instanceof(File)),
      z.array(z.string()),
      z.array(z.object({ url: z.string() })),
    ])
    .optional(),

  // .optional(),
  offerTagId: z.string().optional(),
  isFeatured: z.union([z.boolean().default(false)]).optional(),
  brand: z.string().optional(),
  specs: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional(),
  freeShippingCityIds: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),

  sku: z
    .string()
    // .min(6, {
    //   message: 'SKU باید حداقل 6 کاراکتر باشد.',
    // })
    // .max(50, {
    //   message: 'SKU حداکثر می‌تواند 50 کاراکتر باشد',
    // })
    .optional(),

  variants: z
    .array(
      z.object({
        // You'll likely use IDs for existing sizes/colors, or create new ones
        size: z.string().min(1, 'سایز الزامی است.'),
        color: z.string().min(1, 'رنگ الزامی است.'),
        colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'کد رنگ معتبر نیست.'),
        quantity: z.number().min(0, 'تعداد نمی‌تواند منفی باشد.'),
        price: z.number().min(1000, 'قیمت باید از هزارتومان بیشتر باشد.'),
        discount: z.number().min(0).default(0).optional(),
        weight: z.number().min(0, 'وزن نمی‌تواند منفی باشد.'),
        length: z.number().min(0),
        width: z.number().min(0),
        height: z.number().min(0),
        sku: z.string().optional(),
      })
    )
    .min(1, 'حداقل یک نوع محصول (وریانت) باید اضافه کنید.'),
  variantImages: z
    .union([
      z.array(z.instanceof(File)),
      z.array(z.string()),
      z.array(z.object({ url: z.string() })),
    ])
    .optional(),

  isSale: z.boolean().default(false).optional(),
  // saleEndDate: z.string().optional(),
  keywords: z
    .array(z.string())
    .nonempty('لطفا حداقل یک کلمه کلیدی درباره محصول اضافه کنید.')
    .max(10, {
      message: 'حداکثر کلمات کلیدی 10 تاست.',
    })
    .optional(),

  saleEndDate: z.union([z.date(), z.string()]).optional(),
})

export type ProductVariantSchema = z.infer<
  typeof ProductFormSchema
>['variants'][number]

export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'نام دسته‌بندی حداقل باید سه حرف باشد.' })
    .max(50, { message: 'نام دسته‌بندی نمی‌تواند بیش از 50 حرف باشد' })
    .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message: 'تنها استفاده از حروف، اعداد و اسپیس در نام دسته‌بندی مجاز است.',
    }),

  images: z
    .union([
      z.array(z.instanceof(File)),
      z.array(z.string()),
      z.array(z.object({ url: z.string() })),
    ])
    .optional(),
  url: z
    .string()
    .min(2, { message: 'آدرس دسته‌بندی حداقل باید 2 حرف باشد' })
    .max(50, { message: 'آدرس دسته‌بندی نمی‌تواند بیش از 50 حرف باشد.' })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        // 'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
        'تنها استفاده از حروف، اعداد، آندرلاین و خط تیره مجاز است.',
    }),
  featured: z.union([z.boolean().default(false)]).optional(),
})

export const CategoryServerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters long.' })
    .max(50, { message: 'Category name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, and spaces are allowed in the category name.',
    }),
  name_fa: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters long.' })
    .max(50, { message: 'Category name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, and spaces are allowed in the category name.',
    })
    .optional(),

  images: imageSchema,

  url: z
    .string()
    .min(2, { message: 'Category url must be at least 2 characters long.' })
    .max(50, { message: 'Category url cannot exceed 50 characters.' })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.string().optional(),
})

export const VariantFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Variant variant name should be at least 2 characters long.',
    })
    .max(100, {
      message: 'Variant variant name cannot exceed 100 characters.',
    }),

  description: z.string().optional(),

  sku: z
    .string()
    .min(6, {
      message: 'Variant SKU should be at least 6 characters long.',
    })
    .max(50, {
      message: 'Variant SKU cannot exceed 50 characters.',
    })
    .optional(),
  weight: z.number().min(1, {
    message: 'Please provide a valid variant weight.',
  }),
  // .optional(),

  colors: z
    .object({ color: z.string() })
    .array()
    .min(1, 'Please provide at least one color.')
    .refine((colors) => colors.every((c) => c.color.length > 0), {
      message: 'All color inputs must be filled.',
    })
    .optional(),
  sizes: z
    .object({
      size: z.string(),
      quantity: z
        .number()
        .min(1, { message: 'Quantity must be greater than 0.' }),
      price: z.number().min(0.01, { message: 'Price must be greater than 0.' }),
      discount: z.number().min(0).default(0).optional(),
    })
    .array()
    .min(1, 'Please provide at least one size.')
    .refine(
      (sizes) =>
        sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
      {
        message: 'All size inputs must be filled correctly.',
      }
    ),
  specs: z
    .object({
      name: z.string(),
      value: z.string(),
      // name_fa: z.string(),
    })
    .array()
    // .min(1, 'Please provide at least one variant spec.')
    .refine(
      (specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0),
      {
        message: 'All variant specs inputs must be filled correctly.',
      }
    )
    .optional(),

  isSale: z.boolean().default(false).optional(),
  // saleEndDate: z.string().optional(),
  keywords: z
    .array(z.string())
    .nonempty('Please at least one item')
    .max(10, {
      message: 'You can provide up to 10 keywords.',
    })
    .optional(),

  saleEndDate: z.union([z.date(), z.string()]).optional(),
})

export const CouponFormSchema = z.object({
  code: z
    .string()
    .min(2, { message: 'کوپن تخفیف باید حداقل دو کاراکتر باشد.' })
    .max(50, { message: 'کوپن تخفیف نمی‌تواند بیش از 50 کاراکتر باشد.' })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: 'تنها حروف و اعداد میتوانند در کوپن تخفیف باشند.',
    }),
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]),
  discount: z
    .number()
    .min(1, { message: 'تخفیف باید حداقل 1% باشد' })
    .max(100, { message: 'تخفیف نمی‌تواند بیش از 100% باشد.' }),
})
// export const UpdateOrderGroupStatusFormSchema = z.object({
//   status: z.string(),
// })

// export const OfferTagFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Category name must be at least 2 characters long.' })
//     .max(50, { message: 'Category name cannot exceed 50 characters.' })
//     .regex(/^[a-zA-Z0-9\s&$.%,']+$/, {
//       message:
//         'Only letters, numbers, and spaces are allowed in the category name.',
//     }),
//   url: z
//     .string()
//     .min(2, { message: 'Category url must be at least 2 characters long.' })
//     .max(50, { message: 'Category url cannot exceed 50 characters.' })
//     .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
//       message:
//         'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
//     }),
// })

export const updateUserSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().min(10, 'شماره موبایل نمی‌تواند خالی باشد.'),
  role: z.string().min(1, 'مشخص کردن نقش کاربر الزامی است.'),
})

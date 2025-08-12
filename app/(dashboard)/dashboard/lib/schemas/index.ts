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
  featured: z.union([z.boolean().default(false), z.string()]).optional(),
  categoryId: z.string(),
})

export const subCategoryServerFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Sub Category name must be at least 2 characters long.',
    })
    .max(50, { message: 'Sub Category name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, and spaces are allowed in the sub category name.',
    }),
  name_fa: z
    .string()
    .min(2, {
      message: 'Sub Category name must be at least 2 characters long.',
    })
    .max(50, { message: 'Sub Category name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, and spaces are allowed in the sub category name.',
    })
    .optional(),

  images: imageSchema,

  url: z
    .string()
    .min(2, { message: 'Sub Category url must be at least 2 characters long.' })
    .max(50, { message: 'Sub Category url cannot exceed 50 characters.' })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the sub category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.string().optional(),
  categoryId: z.string(),
})

// export const ProductEditFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Product name should be at least 2 characters long.' })
//     .max(200, { message: 'Product name cannot exceed 200 characters.' }),
//   name_fa: z
//     .string()
//     // .min(2, { message: 'Product name should be at least 2 characters long.' })
//     .max(200, { message: 'Product name cannot exceed 200 characters.' })
//     .optional(),
//   description: z.string().min(200, {
//     message: 'Product description should be at least 200 characters long.',
//   }),
//   description_fa: z
//     .string()

//     .optional(),

//   images: imageSchema,
//   // .min(3, 'Please upload at least 3 images for the product.')
//   // .max(6, 'You can upload up to 6 images for the product.'),

//   //  z
//   //   .object({ url: z.string() })
//   //   .array()
//   //   .length(1, 'Choose a product variant image.'),
//   categoryId: z.string().uuid(),
//   subCategoryId: z.string().uuid(),
//   offerTagId: z
//     .string()
//     // .uuid()
//     .optional(),
//   brand: z
//     .string()
//     .min(2, {
//       message: 'Product brand should be at least 2 characters long.',
//     })
//     .max(50, {
//       message: 'Product brand cannot exceed 50 characters.',
//     })
//     .optional(),
//   sku: z
//     .string()
//     .min(6, {
//       message: 'Product SKU should be at least 6 characters long.',
//     })
//     .max(50, {
//       message: 'Product SKU cannot exceed 50 characters.',
//     })
//     .optional(),
//   weight: z
//     .number()
//     .min(0.01, {
//       message: 'Please provide a valid product weight.',
//     })
//     .optional(),
//   keywords: z
//     .array(z.string())
//     .nonempty('Please at least one item')
//     // .string()
//     // .array()
//     // .min(5, {
//     //   message: 'Please provide at least 5 keywords.',
//     // })
//     .max(10, {
//       message: 'You can provide up to 10 keywords.',
//     })
//     .optional(),
//   keywords_fa: z
//     .array(z.string())
//     .nonempty('Please at least one item')
//     .max(10, {
//       message: 'You can provide up to 10 keywords.',
//     })
//     .optional(),

//   product_specs: z
//     .object({
//       name: z.string(),
//       value: z.string(),
//       // name_fa: z.string(),
//     })
//     .array()
//     // .min(1, 'Please provide at least one product spec.')
//     .refine(
//       (product_specs) =>
//         product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
//       {
//         message: 'All product specs inputs must be filled correctly.',
//       }
//     )
//     .optional(),

//   questions: z
//     .object({
//       question: z.string(),
//       answer: z.string(),
//       // question_fa: z.string(),
//       // answer_fa: z.string(),
//     })
//     .array()
//     // .min(1, 'Please provide at least one product question.')
//     .refine(
//       (questions) =>
//         questions.every((q) => q.question.length > 0 && q.answer.length > 0),
//       {
//         message: 'All product question inputs must be filled correctly.',
//       }
//     )
//     .optional(),

//   freeShippingForAllCountries: z.boolean().default(false),
//   freeShippingCountriesIds: z
//     .array(
//       z.object({
//         id: z.string().optional(),
//         label: z.string(),
//         value: z.string(),
//         disable: z.boolean().optional(),
//       })
//     )
//     .optional()
//     .refine(
//       (ids) => ids?.every((item) => item.label && item.value),
//       'Each country must have a valid name and ID.'
//     )
//     .default([]), // use it when an array is optional
//   // .object({
//   //   id: z.string().optional(),
//   //   label: z.string(),
//   //   value: z.string(),
//   // })
//   // .array()
//   // .optional()
//   // .refine(
//   //   (ids) => ids?.every((item) => item.label && item.value),
//   //   'Each country must have a valid name and ID.'
//   // )
//   // .default([]),
//   // shippingFeeMethod: z.nativeEnum(ShippingFeeMethod),
// })

export const NewProductFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  subCategoryId: z.string().min(1, 'Sub-category is required'),
  // shippingFeeMethod: z.enum(['ITEM', 'WEIGHT', 'FIXED']).default('ITEM'),
  shippingFeeMethod: z.nativeEnum(ShippingFeeMethod),
  images: z
    .union([
      z.array(z.instanceof(File)),
      z.array(z.string()),
      z.array(z.object({ url: z.string() })),
    ])
    .optional(),
  offerTagId: z.string().optional(),
  brand: z.string().optional(),
  product_specs: z
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

  // .default([]),
})
export const CategoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters long.' })
    .max(50, { message: 'Category name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, and spaces are allowed in the category name.',
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
    .min(2, { message: 'Category url must be at least 2 characters long.' })
    .max(50, { message: 'Category url cannot exceed 50 characters.' })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9\s'&-‌\u0600-\u06FF]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.union([z.boolean().default(false), z.string()]).optional(),
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
// export const NewServerProductFormSchema = z.object({
//   name: z
//     .string()
//     .min(2, { message: 'Product name should be at least 2 characters long.' })
//     .max(200, { message: 'Product name cannot exceed 200 characters.' }),
//   name_fa: z
//     .string()
//     // .min(2, { message: 'Product name should be at least 2 characters long.' })
//     .max(200, { message: 'Product name cannot exceed 200 characters.' })
//     .optional(),
//   description: z.string().min(200, {
//     message: 'Product description should be at least 200 characters long.',
//   }),
//   description_fa: z
//     .string()

//     .optional(),

//   images: imageSchema,

//   categoryId: z.string().uuid(),
//   subCategoryId: z.string().uuid(),
//   offerTagId: z
//     .string()
//     // .uuid()
//     .optional(),
//   brand: z
//     .string()
//     .min(2, {
//       message: 'Product brand should be at least 2 characters long.',
//     })
//     .max(50, {
//       message: 'Product brand cannot exceed 50 characters.',
//     })
//     .optional(),

//   product_specs: z
//     .object({
//       name: z.string(),
//       value: z.string(),
//       // name_fa: z.string(),
//     })
//     .array()
//     // .min(1, 'Please provide at least one product spec.')
//     .refine(
//       (product_specs) =>
//         product_specs.every((s) => s.name.length > 0 && s.value.length > 0),
//       {
//         message: 'All product specs inputs must be filled correctly.',
//       }
//     )
//     .optional(),

//   questions: z
//     .object({
//       question: z.string(),
//       answer: z.string(),
//       // question_fa: z.string(),
//       // answer_fa: z.string(),
//     })
//     .array()
//     // .min(1, 'Please provide at least one product question.')
//     .refine(
//       (questions) =>
//         questions.every((q) => q.question.length > 0 && q.answer.length > 0),
//       {
//         message: 'All product question inputs must be filled correctly.',
//       }
//     )
//     .optional(),

//   freeShippingForAllCountries: z.boolean().default(false),
//   freeShippingCountriesIds: z
//     .array(z.string())
//     .optional()
//     // .refine(
//     //   (ids) => ids?.every((item) => item.label && item.value),
//     //   'Each country must have a valid name and ID.'
//     // )
//     .default([]), // use it when an array is optional
//   freeShippingCityIds: z
//     .array(z.string())
//     .optional()
//     // .refine(
//     //   (ids) => ids?.every((item) => item.label && item.value),
//     //   'Each country must have a valid name and ID.'
//     // )
//     .default([]), // use it when an array is optional

//   // .object({
//   //   id: z.string().optional(),
//   //   label: z.string(),
//   //   value: z.string(),
//   // })
//   // .array()
//   // .optional()
//   // .refine(
//   //   (ids) => ids?.every((item) => item.label && item.value),
//   //   'Each country must have a valid name and ID.'
//   // )
//   // .default([]),
//   // shippingFeeMethod: z.nativeEnum(ShippingFeeMethod),
// })

// export const VariantFormSchema = z.object({
//   variantName: z
//     .string()
//     .min(2, {
//       message: 'Variant variant name should be at least 2 characters long.',
//     })
//     .max(100, {
//       message: 'Variant variant name cannot exceed 100 characters.',
//     }),
//   variantName_fa: z
//     .string()
//     // .min(2, {
//     //   message: 'Variant variant name should be at least 2 characters long.',
//     // })
//     .max(100, {
//       message: 'Variant variant name cannot exceed 100 characters.',
//     })
//     .optional(),
//   /*
//     .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_ -]+$/, {
//       message:
//         "Variant variant name may only contain letters, numbers, spaces, hyphens, and underscores, without consecutive special characters.",
//     })

//        */
//   variantDescription: z.string().optional(),
//   variantDescription_fa: z.string().optional(),

//   variantImage: imageSchema,

//   sku: z
//     .string()
//     .min(6, {
//       message: 'Variant SKU should be at least 6 characters long.',
//     })
//     .max(50, {
//       message: 'Variant SKU cannot exceed 50 characters.',
//     })
//     .optional(),
//   weight: z
//     .number()
//     .min(1, {
//       message: 'Please provide a valid variant weight.',
//     })
//     .optional(),

//   colors: z
//     .object({ color: z.string() })
//     .array()
//     .min(1, 'Please provide at least one color.')
//     .refine((colors) => colors.every((c) => c.color.length > 0), {
//       message: 'All color inputs must be filled.',
//     })
//     .optional(),
//   sizes: z
//     .object({
//       size: z.string(),
//       quantity: z
//         .number()
//         .min(1, { message: 'Quantity must be greater than 0.' }),
//       price: z.number().min(0.01, { message: 'Price must be greater than 0.' }),
//       discount: z.number().min(0).default(0),
//     })
//     .array()
//     .min(1, 'Please provide at least one size.')
//     .refine(
//       (sizes) =>
//         sizes.every((s) => s.size.length > 0 && s.price > 0 && s.quantity > 0),
//       {
//         message: 'All size inputs must be filled correctly.',
//       }
//     ),
//   specs: z
//     .object({
//       name: z.string(),
//       value: z.string(),
//       // name_fa: z.string(),
//     })
//     .array()
//     // .min(1, 'Please provide at least one variant spec.')
//     .refine(
//       (specs) => specs.every((s) => s.name.length > 0 && s.value.length > 0),
//       {
//         message: 'All variant specs inputs must be filled correctly.',
//       }
//     )
//     .optional(),

//   isSale: z.boolean().default(false),
//   // saleEndDate: z.string().optional(),
//   keywords: z
//     .array(z.string())
//     .nonempty('Please at least one item')
//     .max(10, {
//       message: 'You can provide up to 10 keywords.',
//     })
//     .optional(),
//   keywords_fa: z
//     .array(z.string())
//     // .nonempty('Please at least one item')
//     .max(10, {
//       message: 'You can provide up to 10 keywords.',
//     })
//     .optional(),
//   saleEndDate: z.union([z.date(), z.string()]).optional(),
// })

// export const CouponFormSchema = z.object({
//   code: z
//     .string()
//     .min(2, { message: 'Coupon code must be at least 2 characters long.' })
//     .max(50, { message: 'Coupon code cannot exceed 50 characters.' })
//     .regex(/^[a-zA-Z0-9]+$/, {
//       message: 'Only letters and numbers are allowed in the coupon code.',
//     }),
//   startDate: z.union([z.date(), z.string()]),
//   endDate: z.union([z.date(), z.string()]),
//   discount: z
//     .number()
//     .min(1, { message: 'Discount must be at least 1.' })
//     .max(99, { message: 'Discount cannot exceed 99.' }),
// })
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

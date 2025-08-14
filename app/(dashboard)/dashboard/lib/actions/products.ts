'use server'

import slugify from 'slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { ProductFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateUniqueSlug } from '../server-utils'
import { Image, Product, Variant } from '@/lib/generated/prisma'
import { arraysEqual } from '../utils'

interface CreateProductFormState {
  success?: string
  errors: {
    name?: string[]
    description?: string[]
    isFeatured?: string[]

    images?: string[]
    categoryId?: string[]
    subCategoryId?: string[]
    offerTagId?: string[]
    brand?: string[]

    specs?: string[]
    keywords?: string[]
    questions?: string[]

    _form?: string[]
  }
}

export async function createProduct(
  data: unknown,
  path: string
): Promise<CreateProductFormState> {
  const result = ProductFormSchema.safeParse(
    data
    //   {
    //   name: formData.get('name'),
    //   description: formData.get('description'),
    //   name: formData.get('name'),
    //   description: formData.get('description'),
    //   name_fa: formData.get('name_fa'),
    //   description_fa: formData.get('description_fa'),
    //   name_fa: formData.get('name_fa'),
    //   description_fa: formData.get('description_fa'),
    //   categoryId: formData.get('categoryId'),
    //   subCategoryId: formData.get('subCategoryId'),
    //   offerTagId: formData.get('offerTagId'),
    //   isSale: Boolean(formData.get('isSale')),
    //   saleEndDate: formData.get('saleEndDate'),
    //   brand: formData.get('brand'),
    //   sku: formData.get('sku'),
    //   weight: Number(formData.get('weight')),
    //   keywords: formData.getAll('keywords'),
    //   product_specs: formData
    //     .getAll('product_specs')
    //     .map((product_spec) => JSON.parse(product_spec.toString())),
    //   variant_specs: formData
    //     .getAll('variant_specs')
    //     .map((variant_spec) => JSON.parse(variant_spec.toString())),
    //   questions: formData
    //     .getAll('questions')
    //     .map((question) => JSON.parse(question.toString())),
    //   sizes: formData.getAll('sizes').map((size) => JSON.parse(size.toString())),
    //   colors: formData
    //     .getAll('colors')
    //     .map((size) => JSON.parse(size.toString())),
    //   shippingFeeMethod: formData.get('shippingFeeMethod'),
    //   freeShippingForAllCountries: Boolean(
    //     formData.get('freeShippingForAllCountries')
    //   ),
    //   images: formData.getAll('images'),
    //   variantImage: formData.getAll('variantImage'),
    // }
  )

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  // const user = await currentUser()
  // if (
  //   !user ||
  //   !user.id ||
  //   user.role !== 'SELLER'
  // ) {
  //   return {
  //     errors: {
  //       _form: ['شما اجازه دسترسی ندارید!'],
  //     },
  //   }
  // }

  try {
    const isExistingProduct = await prisma.product.findFirst({
      where: {
        name: result.data.name,
      },
    })
    if (isExistingProduct) {
      return {
        errors: {
          _form: ['محصول با این نام موجود است!'],
        },
      }
    }

    const productSlug = await generateUniqueSlug(
      slugify(result.data.name, {
        replacement: '-',
        lower: true,
        trim: true,
      }),
      'product'
    )

    let imageIds: string[] = []
    if (result.data.images) {
      const filesToUpload = result.data.images.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      imageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]
    }

    const product = await prisma.product.create({
      data: {
        categoryId: result.data.categoryId,
        subCategoryId: result.data.subCategoryId,
        name: result.data.name,
        description: result.data.description,
        slug: productSlug,
        brand: result.data?.brand || '',
        shippingFeeMethod: result.data.shippingFeeMethod,
        // freeShipping:result.data.freeShippingCountriesIds?true:false,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
      },
    })

    await prisma.freeShipping.create({
      data: {
        productId: product.id,
        eligibleCities: {
          create: result.data.freeShippingCityIds?.map((cityId) => ({
            cityId: +cityId,
          })),
        },
      },
      include: {
        eligibleCities: {
          include: {
            city: true,
          },
        },
      },
    })

    let newSpecs
    if (result.data.product_specs) {
      newSpecs = result.data.product_specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
        productId: product.id,
      }))
    }
    if (newSpecs) {
      await prisma.spec.createMany({
        data: newSpecs,
      })
    }
    let newQuestions
    if (result.data.questions) {
      newQuestions = result.data.questions.map((question) => ({
        question: question.question,
        answer: question.answer,
        productId: product.id,
      }))
    }
    if (newQuestions) {
      await prisma.question.createMany({
        data: newQuestions,
      })
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/products`)
}

export async function editProduct(
  data: unknown,
  productId: string,
  path: string
): Promise<CreateProductFormState> {
  const result = ProductFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const user = await currentUser()
  // if (  !user || !user.id || user.role !== 'SELLER') {
  //   return {
  //     errors: {
  //       _form: ['شما اجازه دسترسی ندارید!'],
  //     },
  //   }
  // }
  if (!productId) {
    return {
      errors: {
        _form: ['محصول موجود نیست!'],
      },
    }
  }
  // console.log({ result })
  let isExisting:
    | (Product & {
        images: { id: string; key: string }[] | null
      })
    | null
  try {
    isExisting = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['محصول حذف شده است!'],
        },
      }
    }

    const isNameExisting = await prisma.product.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: result.data.name }],
          },
          {
            NOT: {
              id: productId,
            },
          },
        ],
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['محصول با این نام موجود است!'],
        },
      }
    }

    if (
      typeof result.data?.images?.[0] === 'object' &&
      result.data.images[0] instanceof File
    ) {
      if (isExisting.images && isExisting.images.length > 0) {
        const oldImageKeys = isExisting.images.map((img) => img.key)
        // console.log('Deleting old keys from S3:', oldImageKeys)
        await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      }
      const filesToUpload = result.data.images.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      const imageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]

      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          images: {
            disconnect: isExisting.images?.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
        },
      })
    }

    await prisma.$transaction(async (tx) => {
      tx.product.update({
        where: {
          id: productId,
        },
        data: {
          categoryId: result.data.categoryId,
          subCategoryId: result.data.subCategoryId,
          name: result.data.name,
          description: result.data.description,
          brand: result.data?.brand || '',
          shippingFeeMethod: result.data.shippingFeeMethod,
        },
      })

      const existingFreeShippingCities = await tx.freeShipping.findFirst({
        where: {
          productId,
        },
        include: {
          eligibleCities: true,
        },
      })
      const existingCityIds = existingFreeShippingCities?.eligibleCities.map(
        (city) => city.cityId
      )
      // console.log(
      //   'ev',
      //   !arraysEqual(existingCityIds, result.data.freeShippingCityIds)
      // )
      // console.log(
      //   'id',
      //   existingFreeShippingCities?.eligibleCities.map(
      //     (city: { id: string }) => ({
      //       id: city.id,
      //     })
      //   )
      // )
      if (
        // !existingCityIds?.every(
        //   (value, index) => value == +result.data.freeShippingCityIds[index]
        // )
        !arraysEqual(existingCityIds, result.data.freeShippingCityIds)
      ) {
        await tx.freeShipping.update({
          where: {
            id: existingFreeShippingCities?.id,
            productId,
          },
          data: {
            eligibleCities: {
              deleteMany: existingFreeShippingCities?.eligibleCities.map(
                (city: { id: string }) => ({
                  id: city.id,
                })
              ),
            },
          },
        })
        await tx.freeShipping.delete({
          where: {
            id: existingFreeShippingCities?.id,
            productId,
          },
        })
        await tx.freeShipping.create({
          data: {
            productId,
            eligibleCities: {
              create: result.data.freeShippingCityIds?.map((cityId) => ({
                cityId: +cityId,
              })),
            },
          },
        })
      }

      await tx.spec.deleteMany({
        where: { productId: productId },
      })
      await tx.question.deleteMany({
        where: { productId: productId },
      })

      let newSpecs
      if (result.data.product_specs && result.data.product_specs.length > 0) {
        newSpecs = result.data.product_specs
          .filter((spec) => spec.name.trim() !== '' || spec.value.trim() !== '')
          .map((spec) => ({
            name: spec.name,
            value: spec.value,
            productId: productId,
          }))
      }
      if (newSpecs) {
        await tx.spec.createMany({
          data: newSpecs,
        })
      }
      let newQuestions
      if (result.data.questions && result.data.questions.length > 0) {
        newQuestions = result.data.questions
          .filter((qa) => qa.question.trim() !== '' || qa.answer.trim() !== '')
          .map((question) => ({
            question: question.question,
            answer: question.answer,
            productId: productId,
          }))
      }
      if (newQuestions) {
        await tx.question.createMany({
          data: newQuestions,
        })
      }
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/products`)
}

//////////////////////

interface DeleteProductFormState {
  errors: {
    // name?: string[]
    // featured?: string[]
    // url?: string[]
    images?: string[]

    _form?: string[]
  }
}

export async function deleteProduct(
  path: string,
  productId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteProductFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteProductFormState> {
  const user = await currentUser()
  // if (  !user || user.role !== 'SELLER') {
  //   return {
  //     errors: {
  //       _form: ['شما اجازه دسترسی ندارید!'],
  //     },
  //   }
  // }
  // console.log(result)
  if (!productId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Product & {
          variants: (Variant & { variantImage: Image[] })[] | null
        } & {
          images: Image[] | null
        })
      | null = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        images: true,
        variants: {
          include: {
            variantImage: true,
          },
        },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }

    if (isExisting.images && isExisting.images?.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)
      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
    }
    const variants = isExisting.variants?.flatMap((variant) => variant)

    if (variants) {
      for (const variant of variants) {
        if (variant.id) {
          await prisma.product.update({
            where: { id: productId },
            data: {
              variants: {
                disconnect: {
                  id: variant.id,
                },
              },
            },
          })
          await prisma.variant.delete({
            where: {
              id: variant.id,
            },
          })
        }
      }
    }

    await prisma.product.delete({
      where: {
        id: isExisting.id,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }
  revalidatePath(path)
  redirect(` /dashboard/products`)
}

// Product Variant

interface CreateVariantProps {
  productId: string
  name: string
  variantId?: string
  description: string

  saleEndDate: string | Date | undefined
  sku: string | undefined
  keywords: string[] | undefined
  weight: number | undefined
  isSale: boolean
  isFeatured: boolean
  specs:
    | {
        name: string
        value: string
      }[]
    | undefined
  images:
    | string[]
    | File[]
    | {
        url: string
      }[]
    | undefined
  sizes:
    | {
        size: string
        quantity: number
        discount: number
        price: number
      }[]
    | undefined
  colors:
    | {
        color: string
      }[]
    | undefined
}
export const createVariant = async ({
  productId,
  name,
  description,
  saleEndDate,
  sku,
  keywords,
  weight,
  isSale,
  specs,
  images,
  sizes,
  colors,
}: CreateVariantProps) => {
  try {
    const variantImageIds: string[] = []
    for (const img of images || []) {
      if (img instanceof File) {
        const buffer = Buffer.from(await img.arrayBuffer())
        const res = await uploadFileToS3(buffer, img.name)

        if (res?.imageId && typeof res.imageId === 'string') {
          variantImageIds.push(res.imageId)
        }
      }
    }
    const imagesIds: string[] = []
    for (const img of images || []) {
      if (img instanceof File) {
        const buffer = Buffer.from(await img.arrayBuffer())
        const res = await uploadFileToS3(buffer, img.name)

        if (res?.imageId && typeof res.imageId === 'string') {
          imagesIds.push(res.imageId)
        }
      }
    }
    const variantSlug = await generateUniqueSlug(
      slugify(name, {
        replacement: '-',
        lower: true,
        trim: true,
      }),
      'variant'
    )

    const variant = await prisma.variant.create({
      data: {
        productId,
        slug: variantSlug,
        name: name,
        description: description,
        saleEndDate: String(saleEndDate),
        sku: sku ? sku : '',
        keywords: keywords?.length ? keywords?.join(',') : '',
        weight: weight ? +weight : 0,
        isSale,
      },
    })

    let newVariantSpecs
    if (specs) {
      newVariantSpecs = specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
        variantId: variant.id,
      }))
    }

    if (newVariantSpecs) {
      await prisma.spec.createMany({
        data: newVariantSpecs,
      })
    }

    let newColors
    if (colors) {
      newColors = colors.map((color) => ({
        name: color.color,
        productVariantId: variant.id,
      }))
    }

    if (newColors) {
      await prisma.color.createMany({
        data: newColors,
      })
    }
    //  new Size
    let newSizes
    if (sizes) {
      newSizes = sizes.map((size) => ({
        size: size.size,
        quantity: size.quantity,
        price: size.price,
        discount: size.discount,
        productVariantId: variant.id,
      }))
    }

    if (newSizes) {
      await prisma.size.createMany({
        data: newSizes,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

interface EditVariantFormState {
  success?: string
  errors: {
    name?: string[]
    description?: string[]
    name?: string[]
    description?: string[]

    name_fa?: string[]
    description_fa?: string[]

    variantImage?: string[]

    isSale?: string[]
    saleEndDate?: string[]

    sku?: string[]
    weight?: string[]
    colors?: string[]
    sizes?: string[]
    specs?: string[]
    keywords?: string[]
    keywords_fa?: string[]

    _form?: string[]
  }
}
export async function editVariant(
  formData: FormData,
  variantId: string,
  productId: string,
  path: string
): Promise<EditVariantFormState> {
  const headerResponse = await headers()
  const locale = headerResponse.get('X-NEXT-INTL-LOCALE')

  const result = VariantFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),

    name_fa: formData.get('name_fa'),
    description_fa: formData.get('description_fa'),

    isSale: Boolean(formData.get('isSale')),
    saleEndDate: formData.get('saleEndDate'),

    sku: formData.get('sku'),
    weight: Number(formData.get('weight')),
    keywords: formData.getAll('keywords'),
    keywords_fa: formData.getAll('keywords_fa'),
    specs: formData.getAll('specs').map((spec) => JSON.parse(spec.toString())),

    sizes: formData.getAll('sizes').map((size) => JSON.parse(size.toString())),
    colors: formData
      .getAll('colors')
      .map((size) => JSON.parse(size.toString())),

    variantImage: formData.getAll('variantImage'),
  })
  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  if (!variantId || !productId) {
    return {
      errors: {
        _form: ['محصول حذف شده است!'],
      },
    }
  }
  const user = await currentUser()
  if (!session || !user || !user.id || user.role !== 'SELLER') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      store: true,
    },
  })
  if (!product) {
    return {
      errors: {
        _form: ['محصول حذف شده است!'],
      },
    }
  }

  const isExistingVariant:
    | (ProductVariant & { variantImage: Image[] | null } & {
        sizes: Size[] | null
      } & { colors: Color[] | null } & { specs: Spec[] | null })
    | null = await prisma.productVariant.findFirst({
    where: {
      id: variantId,
    },
    include: {
      colors: true,
      sizes: true,
      specs: true,
      variantImage: true,
      wishlist: true,
    },
  })
  try {
    const isNameExisting = await prisma.productVariant.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: result.data.name }],
          },
          {
            NOT: {
              id: variantId,
            },
          },
        ],
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['نوع محصول با این نام موجود است!'],
        },
      }
    }
    // const variantImageIds: string[] = []
    // for (const img of images || []) {
    //   if (img instanceof File) {
    //     const buffer = Buffer.from(await img.arrayBuffer())
    //     const res = await uploadFileToS3(buffer, img.name)

    //     if (res?.imageId && typeof res.imageId === 'string') {
    //       variantImageIds.push(res.imageId)
    //     }
    //   }
    // }
    // if (
    //   typeof result.data.variantImage?.[0] === 'object' &&
    //   result.data.variantImage[0] instanceof File
    // ) {
    //   const imageIds: string[] = []
    //   for (const img of result.data.variantImage) {
    //     if (img instanceof File) {
    //       const buffer = Buffer.from(await img.arrayBuffer())
    //       const res = await uploadFileToS3(buffer, img.name)

    //       if (res?.imageId && typeof res.imageId === 'string') {
    //         imageIds.push(res.imageId)
    //       }
    //     }
    //   }
    //   // console.log(res)
    //   await prisma.productVariant.update({
    //     where: {
    //       id: variantId,
    //     },
    //     data: {
    //       variantImage: {
    //         disconnect: isExistingVariant?.variantImage?.map(
    //           (image: { id: string }) => ({
    //             id: image.id,
    //           })
    //         ),
    //       },
    //     },
    //   })
    //   await prisma.productVariant.update({
    //     where: {
    //       id: variantId,
    //     },
    //     data: {
    //       variantImage: {
    //         connect: imageIds.map((id) => ({
    //           id: id,
    //         })),
    //       },
    //     },
    //   })
    // }
    // OTHER UPDATES
    await prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId, productId },
        data: {
          // productId, // usually not changed during variant edit
          // slug: isExistingVariant?.slug, // slug might need careful handling if name changes
          name: result.data.name,
          name_fa: result.data.name_fa,
          description: result.data?.description || '',
          description_fa: result.data?.description_fa || '',
          saleEndDate: String(result.data.saleEndDate), // Ensure this is a string if your schema expects it
          sku: result.data.sku ? result.data.sku : '',
          keywords: result.data.keywords?.length
            ? result.data.keywords?.join(',')
            : '',
          keywords_fa: result.data.keywords_fa?.length
            ? result.data.keywords_fa?.join(',')
            : '',
          weight: result.data.weight ? +result.data.weight : 0,
          isSale: result.data.isSale,
          // Do NOT update variantImage here if you have separate logic for it
        },
      })
      await tx.color.deleteMany({
        where: { productVariantId: variantId },
      })
      await tx.size.deleteMany({
        where: { productVariantId: variantId },
      })
      await tx.spec.deleteMany({
        where: { variantId: variantId },
      })

      // 3. Create new related collections based on submitted data
      if (result.data.colors && result.data.colors.length > 0) {
        const newColorsData = result.data.colors
          .filter((color) => color.color && color.color.trim() !== '') // Filter out empty/invalid colors
          .map((color) => ({
            name: color.color,
            productVariantId: variantId, // Use variantId directly
          }))
        if (newColorsData.length > 0) {
          await tx.color.createMany({
            data: newColorsData,
          })
        }
      }

      if (result.data.sizes && result.data.sizes.length > 0) {
        const newSizesData = result.data.sizes
          .filter((size) => size.size && size.size.trim() !== '') // Filter out empty/invalid sizes
          .map((size) => ({
            size: size.size,
            quantity: size.quantity,
            price: size.price,
            discount: size.discount,
            productVariantId: variantId,
          }))
        if (newSizesData.length > 0) {
          await tx.size.createMany({
            data: newSizesData,
          })
        }
      }

      if (result.data.specs && result.data.specs.length > 0) {
        const newSpecsData = result.data.specs
          .filter(
            (spec) =>
              (spec.name && spec.name.trim() !== '') ||
              (spec.value && spec.value.trim() !== '')
          ) // Filter out empty/invalid specs
          .map((spec) => ({
            name: spec.name,
            value: spec.value,
            variantId: variantId, // Assuming relation name is variantId for Spec model
          }))
        if (newSpecsData.length > 0) {
          await tx.spec.createMany({
            data: newSpecsData,
          })
        }
      }

      // Handle variantImage updates (this seems to be what you attempted)
      // Ensure this logic is correct and doesn't conflict with the main variant update.
      // Your existing image logic:
      if (
        result.data.variantImage &&
        result.data.variantImage.length > 0 &&
        result.data.variantImage[0] instanceof File
      ) {
        const imageIds: string[] = []
        for (const img of result.data.variantImage) {
          if (img instanceof File) {
            const buffer = Buffer.from(await img.arrayBuffer())
            const res = await uploadFileToS3(buffer, img.name) // This is outside the transaction, S3 ops are hard to transact
            if (res?.imageId && typeof res.imageId === 'string') {
              imageIds.push(res.imageId)
            }
          }
        }

        // Disconnect old images
        await tx.productVariant.update({
          where: { id: variantId },
          data: {
            variantImage: {
              set: [], // Disconnects all existing relations
            },
          },
        })
        // Connect new images
        if (imageIds.length > 0) {
          await tx.productVariant.update({
            where: { id: variantId },
            data: {
              variantImage: {
                connect: imageIds.map((id) => ({ id: id })),
              },
            },
          })
        }
      }
      // --- END: Modification for Colors, Sizes, Specs ---
    })
    // const variant = await prisma.productVariant.update({
    //   where: { id: variantId, productId },
    //   data: {
    //     productId,
    //     slug: isExistingVariant?.slug,
    //     name: result.data.name,
    //     description: result.data?.description || '',
    //     description_fa: result.data?.description_fa || '',
    //     saleEndDate: String(result.data.saleEndDate),
    //     sku: result.data.sku ? result.data.sku : '',
    //     keywords: result.data.keywords?.length
    //       ? result.data.keywords?.join(',')
    //       : '',
    //     keywords_fa: result.data.keywords_fa?.length
    //       ? result.data.keywords_fa?.join(',')
    //       : '',
    //     weight: result.data.weight ? +result.data.weight : 0,
    //     isSale: result.data.isSale,
    //   },
    // })

    // let newVariantSpecs
    // if (result.data.specs) {
    //   newVariantSpecs = result.data.specs.map((spec) => ({
    //     name: spec.name,
    //     value: spec.value,
    //     variantId: variant.id,
    //   }))
    // }

    // if (newVariantSpecs) {
    //   await prisma.spec.createMany({
    //     data: newVariantSpecs,
    //   })
    // }

    // let newColors
    // if (result.data.colors) {
    //   newColors = result.data.colors.map((color) => ({
    //     name: color.color,
    //     productVariantId: variant.id,
    //   }))
    // }

    // if (newColors) {
    //   await prisma.color.createMany({
    //     data: newColors,
    //   })
    // }
    // //  new Size
    // let newSizes
    // if (result.data.sizes) {
    //   newSizes = result.data.sizes.map((size) => ({
    //     size: size.size,
    //     quantity: size.quantity,
    //     price: size.price,
    //     discount: size.discount,
    //     productVariantId: variant.id,
    //   }))
    // }

    // if (newSizes) {
    //   await prisma.size.createMany({
    //     data: newSizes,
    //   })
    // }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }
  revalidatePath(path)
  redirect(
    `/${locale}/dashboard/seller/stores/${product.store.url}/products/${productId}/variants`
  )
}

// Product Variant

interface CreateNewVariantProps {
  success?: string
  errors: {
    name?: string[]
    description?: string[]
    name?: string[]
    description?: string[]

    name_fa?: string[]
    description_fa?: string[]

    variantImage?: string[]

    isSale?: string[]
    saleEndDate?: string[]

    sku?: string[]
    weight?: string[]
    colors?: string[]
    sizes?: string[]
    specs?: string[]
    keywords?: string[]
    keywords_fa?: string[]

    _form?: string[]
  }
}

export async function createNewVariant(
  formData: FormData,
  productId: string,
  path: string
): Promise<CreateNewVariantProps> {
  const headerResponse = await headers()
  const locale = headerResponse.get('X-NEXT-INTL-LOCALE')

  const result = VariantFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),

    name_fa: formData.get('name_fa'),
    description_fa: formData.get('description_fa'),

    isSale: Boolean(formData.get('isSale')),
    saleEndDate: formData.get('saleEndDate'),

    sku: formData.get('sku'),
    weight: Number(formData.get('weight')),
    keywords: formData.getAll('keywords'),
    keywords_fa: formData.getAll('keywords_fa'),
    specs: formData.getAll('specs').map((spec) => JSON.parse(spec.toString())),

    sizes: formData.getAll('sizes').map((size) => JSON.parse(size.toString())),
    colors: formData
      .getAll('colors')
      .map((size) => JSON.parse(size.toString())),

    variantImage: formData.getAll('variantImage'),
  })

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  if (!productId) {
    return {
      errors: {
        _form: ['محصول حذف شده است!'],
      },
    }
  }
  const user = await currentUser()
  if (!user || !user || !user.id || user.role !== 'SELLER') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  let existingVariantProducts
  try {
    existingVariantProducts = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        variants: true,
        store: true,
      },
    })
    if (!existingVariantProducts) {
      return {
        errors: {
          _form: ['محصول حذف شده است!'],
        },
      }
    }

    // Check for duplicate variant name (case-sensitive)
    const hasDuplicate = existingVariantProducts.variants.some(
      (variant) => variant.name.toLowerCase() === result.data.name.toLowerCase()
    )

    if (hasDuplicate) {
      return {
        errors: {
          _form: ['این نام واریانت از قبل موجود است!'],
        },
      }
    }
    const variantImageIds: string[] = []
    for (const img of result.data?.variantImage || []) {
      if (img instanceof File) {
        const buffer = Buffer.from(await img.arrayBuffer())
        const res = await uploadFileToS3(buffer, img.name)

        if (res?.imageId && typeof res.imageId === 'string') {
          variantImageIds.push(res.imageId)
        }
      }
    }
    // console.log({ variantImageIds })
    const variantSlug = await generateUniqueSlug(
      slugify(result.data.name, {
        replacement: '-',
        lower: true,
        trim: true,
      }),
      'productVariant'
    )

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        slug: variantSlug,
        name: result.data.name,
        description: result.data?.description || '',
        description_fa: result.data?.description_fa || '',
        saleEndDate: String(result.data.saleEndDate),
        sku: result.data.sku ? result.data.sku : '',
        keywords: result.data.keywords?.length
          ? result.data.keywords?.join(',')
          : '',
        keywords_fa: result.data.keywords_fa?.length
          ? result.data.keywords_fa?.join(',')
          : '',
        weight: result.data.weight ? +result.data.weight : 0,
        isSale: result.data.isSale,
        variantImage: {
          connect: variantImageIds.map((id) => ({
            id: id,
          })),
        },
      },
    })

    let newVariantSpecs
    if (result.data.specs) {
      newVariantSpecs = result.data.specs.map((spec) => ({
        name: spec.name,
        value: spec.value,
        variantId: variant.id,
      }))
    }

    if (newVariantSpecs) {
      await prisma.spec.createMany({
        data: newVariantSpecs,
      })
    }

    let newColors
    if (result.data.colors) {
      newColors = result.data.colors.map((color) => ({
        name: color.color,
        productVariantId: variant.id,
      }))
    }

    if (newColors) {
      await prisma.color.createMany({
        data: newColors,
      })
    }
    //  new Size
    let newSizes
    if (result.data.sizes) {
      newSizes = result.data.sizes.map((size) => ({
        size: size.size,
        quantity: size.quantity,
        price: size.price,
        discount: size.discount,
        productVariantId: variant.id,
      }))
    }

    if (newSizes) {
      await prisma.size.createMany({
        data: newSizes,
      })
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }
  revalidatePath(path)
  redirect(
    `/${locale}/dashboard/seller/stores/${existingVariantProducts.store.url}/products/${productId}/variants`
  )
}

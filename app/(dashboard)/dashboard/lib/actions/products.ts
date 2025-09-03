'use server'

import slugify from 'slugify'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { ProductFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { generateUniqueSlug } from '../server-utils'
import { Image, Product } from '@/lib/generated/prisma'

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
  const result = ProductFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log(result.data)
  const user = await currentUser()
  if (!user || user.role !== 'ADMIN') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }

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
    let variantImageIds: string[] = []
    if (result.data.variantImages) {
      const filesToUpload = result.data.variantImages?.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      variantImageIds = uploadedImages
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
        isFeatured: result.data.isFeatured,
        keywords: result.data.keywords?.length
          ? result.data.keywords?.join(',')
          : '',
        sku: result.data.sku ? result.data.sku : '',
        isSale: result.data.isSale,
        weight: result.data.weight ? +result.data.weight : 0,
        saleEndDate: String(result.data.saleEndDate),

        // freeShipping:result.data.freeShippingCountriesIds?true:false,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
        variantImages: {
          connect: variantImageIds.map((id) => ({
            id: id,
          })),
        },
      },
    })

    let newSpecs
    if (result.data.specs) {
      newSpecs = result.data.specs.map((spec) => ({
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
    let newColors
    if (result.data.colors) {
      newColors = result.data.colors.map((color) => ({
        name: color.color,
        productId: product.id,
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
        productId: product.id,
        length: size.length,
        width: size.width,
        height: size.height,
      }))
    }

    if (newSizes) {
      await prisma.size.createMany({
        data: newSizes,
      })
    }

    // console.log({ product })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/products`)
}

// export async function editProduct(
//   data: unknown,
//   productId: string,
//   path: string
// ): Promise<CreateProductFormState> {
//   const result = ProductFormSchema.safeParse(data)

//   if (!result.success) {
//     console.error(result.error.flatten().fieldErrors)
//     return {
//       errors: result.error.flatten().fieldErrors,
//     }
//   }
//   // console.log('result.data', result.data)
//   const user = await currentUser()
//   if (!user || user.role !== 'ADMIN') {
//     if (!user) {
//       return {
//         errors: {
//           _form: ['شما اجازه دسترسی ندارید!'],
//         },
//       }
//     }
//   }
//   if (!productId) {
//     return {
//       errors: {
//         _form: ['محصول موجود نیست!'],
//       },
//     }
//   }
//   // console.log({ result })
//   let isExisting:
//     | (Product & {
//         images: { id: string; key: string }[] | null
//       } & {
//         variantImages: { id: string; key: string }[] | null
//       })
//     | null
//   try {
//     isExisting = await prisma.product.findFirst({
//       where: { id: productId },
//       include: {
//         images: { select: { id: true, key: true } },
//         variantImages: { select: { id: true, key: true } },
//       },
//     })
//     if (!isExisting) {
//       return {
//         errors: {
//           _form: ['محصول حذف شده است!'],
//         },
//       }
//     }

//     const isNameExisting = await prisma.product.findFirst({
//       where: {
//         AND: [
//           {
//             OR: [{ name: result.data.name }],
//           },
//           {
//             NOT: {
//               id: productId,
//             },
//           },
//         ],
//       },
//     })

//     if (isNameExisting) {
//       return {
//         errors: {
//           _form: ['محصول با این نام موجود است!'],
//         },
//       }
//     }

//     if (
//       typeof result.data?.images?.[0] === 'object' &&
//       result.data.images[0] instanceof File
//     ) {
//       if (isExisting.images && isExisting.images.length > 0) {
//         const oldImageKeys = isExisting.images.map((img) => img.key)
//         // console.log('Deleting old keys from S3:', oldImageKeys)
//         await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
//       }
//       const filesToUpload = result.data.images.filter(
//         (img): img is File => img instanceof File
//       )
//       const newImageUploadPromises = filesToUpload.map(async (img: File) => {
//         const buffer = Buffer.from(await img.arrayBuffer())
//         return uploadFileToS3(buffer, img.name)
//       })
//       const uploadedImages = await Promise.all(newImageUploadPromises)
//       const imageIds = uploadedImages
//         .map((res) => res?.imageId)
//         .filter(Boolean) as string[]

//       await prisma.product.update({
//         where: {
//           id: productId,
//         },
//         data: {
//           images: {
//             disconnect: isExisting.images?.map((image: { id: string }) => ({
//               id: image.id,
//             })),
//           },
//         },
//       })
//       await prisma.product.update({
//         where: {
//           id: productId,
//         },
//         data: {
//           images: {
//             connect: imageIds.map((id) => ({
//               id: id,
//             })),
//           },
//         },
//       })
//     }

//     if (
//       typeof result.data?.variantImages?.[0] === 'object' &&
//       result.data.variantImages[0] instanceof File
//     ) {
//       if (isExisting.variantImages && isExisting.variantImages.length > 0) {
//         const oldImageKeys = isExisting.variantImages.map((img) => img.key)
//         // console.log('Deleting old keys from S3:', oldImageKeys)
//         await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
//       }
//       const filesToUpload = result.data.variantImages.filter(
//         (img): img is File => img instanceof File
//       )
//       const newImageUploadPromises = filesToUpload.map(async (img: File) => {
//         const buffer = Buffer.from(await img.arrayBuffer())
//         return uploadFileToS3(buffer, img.name)
//       })
//       const uploadedImages = await Promise.all(newImageUploadPromises)
//       const variantImageIds = uploadedImages
//         .map((res) => res?.imageId)
//         .filter(Boolean) as string[]

//       await prisma.product.update({
//         where: {
//           id: productId,
//         },
//         data: {
//           variantImages: {
//             disconnect: isExisting.images?.map((image: { id: string }) => ({
//               id: image.id,
//             })),
//           },
//         },
//       })
//       await prisma.product.update({
//         where: {
//           id: productId,
//         },
//         data: {
//           variantImages: {
//             connect: variantImageIds.map((id) => ({
//               id: id,
//             })),
//           },
//         },
//       })
//     }

//     await prisma.$transaction(async (tx) => {
//       await tx.product.update({
//         where: {
//           id: productId,
//         },
//         data: {
//           categoryId: result.data.categoryId,
//           subCategoryId: result.data.subCategoryId,
//           name: result.data.name,
//           description: result.data.description,
//           brand: result.data?.brand || '',
//           shippingFeeMethod: result.data.shippingFeeMethod,
//           isFeatured: result.data?.isFeatured,
//           keywords: result.data.keywords?.length
//             ? result.data.keywords?.join(',')
//             : '',
//           sku: result.data.sku ? result.data.sku : '',
//           isSale: result.data.isSale,
//           weight: result.data.weight ? +result.data.weight : 0,
//           saleEndDate: String(result.data.saleEndDate),
//         },
//       })

//       await tx.spec.deleteMany({
//         where: { productId: productId },
//       })
//       await tx.question.deleteMany({
//         where: { productId: productId },
//       })

//       let newSpecs
//       if (result.data.specs && result.data.specs.length > 0) {
//         newSpecs = result.data.specs
//           .filter((spec) => spec.name.trim() !== '' || spec.value.trim() !== '')
//           .map((spec) => ({
//             name: spec.name,
//             value: spec.value,
//             productId: productId,
//           }))
//       }
//       if (newSpecs) {
//         await tx.spec.createMany({
//           data: newSpecs,
//         })
//       }
//       let newQuestions
//       if (result.data.questions && result.data.questions.length > 0) {
//         newQuestions = result.data.questions
//           .filter((qa) => qa.question.trim() !== '' || qa.answer.trim() !== '')
//           .map((question) => ({
//             question: question.question,
//             answer: question.answer,
//             productId: productId,
//           }))
//       }
//       if (newQuestions) {
//         await tx.question.createMany({
//           data: newQuestions,
//         })
//       }
//     })
//     let newColors
//     if (result.data.colors) {
//       await prisma.color.deleteMany({
//         where: { productId: productId },
//       })
//       newColors = result.data.colors.map((color) => ({
//         name: color.color,
//         productId: productId,
//       }))
//     }

//     if (newColors) {
//       await prisma.color.createMany({
//         data: newColors,
//       })
//     }
//     //  new Size
//     let newSizes
//     if (result.data.sizes) {
//       await prisma.size.deleteMany({
//         where: { productId },
//       })
//       newSizes = result.data.sizes.map((size) => ({
//         size: size.size,
//         quantity: size.quantity,
//         price: size.price,
//         discount: size.discount,
//         productId,
//       }))
//     }

//     if (newSizes) {
//       await prisma.size.createMany({
//         data: newSizes,
//       })
//     }
//   } catch (err: unknown) {
//     const message =
//       err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
//     return { errors: { _form: [message] } }
//   }
//   revalidatePath(path)
//   redirect(`/dashboard/products`)
// }

//////////////////////
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
  if (!user || user.role !== 'ADMIN') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }

  if (!productId) {
    return {
      errors: {
        _form: ['محصول موجود نیست!'],
      },
    }
  }

  let isExisting:
    | (Product & {
        images: { id: string; key: string }[] | null
      } & {
        variantImages: { id: string; key: string }[] | null
      })
    | null

  try {
    isExisting = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        images: { select: { id: true, key: true } },
        variantImages: { select: { id: true, key: true } },
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

    // Handle image uploads (keeping your existing logic)
    if (
      typeof result.data?.images?.[0] === 'object' &&
      result.data.images[0] instanceof File
    ) {
      if (isExisting.images && isExisting.images.length > 0) {
        const oldImageKeys = isExisting.images.map((img) => img.key)
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

    if (
      typeof result.data?.variantImages?.[0] === 'object' &&
      result.data.variantImages[0] instanceof File
    ) {
      if (isExisting.variantImages && isExisting.variantImages.length > 0) {
        const oldImageKeys = isExisting.variantImages.map((img) => img.key)
        await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      }
      const filesToUpload = result.data.variantImages.filter(
        (img): img is File => img instanceof File
      )
      const newImageUploadPromises = filesToUpload.map(async (img: File) => {
        const buffer = Buffer.from(await img.arrayBuffer())
        return uploadFileToS3(buffer, img.name)
      })
      const uploadedImages = await Promise.all(newImageUploadPromises)
      const variantImageIds = uploadedImages
        .map((res) => res?.imageId)
        .filter(Boolean) as string[]

      await prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          variantImages: {
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
          variantImages: {
            connect: variantImageIds.map((id) => ({
              id: id,
            })),
          },
        },
      })
    }

    // Main transaction for product updates
    await prisma.$transaction(async (tx) => {
      // Update product basic info
      await tx.product.update({
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
          isFeatured: result.data?.isFeatured,
          keywords: result.data.keywords?.length
            ? result.data.keywords?.join(',')
            : '',
          sku: result.data.sku ? result.data.sku : '',
          isSale: result.data.isSale,
          weight: result.data.weight ? +result.data.weight : 0,
          saleEndDate: String(result.data.saleEndDate),
        },
      })

      // Handle specs - delete and recreate (these don't affect cart)
      await tx.spec.deleteMany({
        where: { productId: productId },
      })

      if (result.data.specs && result.data.specs.length > 0) {
        const newSpecs = result.data.specs
          .filter((spec) => spec.name.trim() !== '' || spec.value.trim() !== '')
          .map((spec) => ({
            name: spec.name,
            value: spec.value,
            productId: productId,
          }))

        if (newSpecs.length > 0) {
          await tx.spec.createMany({
            data: newSpecs,
          })
        }
      }

      // Handle questions - delete and recreate (these don't affect cart)
      await tx.question.deleteMany({
        where: { productId: productId },
      })

      if (result.data.questions && result.data.questions.length > 0) {
        const newQuestions = result.data.questions
          .filter((qa) => qa.question.trim() !== '' || qa.answer.trim() !== '')
          .map((question) => ({
            question: question.question,
            answer: question.answer,
            productId: productId,
          }))

        if (newQuestions.length > 0) {
          await tx.question.createMany({
            data: newQuestions,
          })
        }
      }

      // Handle colors - delete and recreate (these don't affect cart)
      if (result.data.colors) {
        await tx.color.deleteMany({
          where: { productId: productId },
        })

        const newColors = result.data.colors.map((color) => ({
          name: color.color,
          productId: productId,
        }))

        if (newColors.length > 0) {
          await tx.color.createMany({
            data: newColors,
          })
        }
      }
      // Handle sizes - SMART UPDATE to preserve IDs and cart items
      if (result.data.sizes) {
        // Get existing sizes
        const existingSizes = await tx.size.findMany({
          where: { productId },
          select: {
            id: true,
            size: true,
            quantity: true,
            price: true,
            discount: true,
            length: true,
            width: true,
            height: true,
          },
        })

        // Track processed size names to identify what to delete
        const formSizeNames = result.data.sizes.map((s) => s.size)
        const processedSizeNames: string[] = []

        // Process each size from the form
        for (const sizeData of result.data.sizes) {
          const existingSize = existingSizes.find(
            (s) => s.size === sizeData.size
          )

          if (existingSize) {
            await tx.size.update({
              where: { id: existingSize.id },
              data: {
                quantity: sizeData.quantity,
                price: sizeData.price,
                discount: sizeData.discount,
                length: sizeData.length,
                width: sizeData.width,
                height: sizeData.height,
              },
            })
          } else {
            await tx.size.create({
              data: {
                size: sizeData.size,
                quantity: sizeData.quantity,
                price: sizeData.price,
                discount: sizeData.discount,
                length: sizeData.length,
                width: sizeData.width,
                height: sizeData.height,
                productId,
              },
            })
          }

          processedSizeNames.push(sizeData.size)
        }

        // Delete sizes that are no longer in the form
        const sizesToDelete = existingSizes.filter(
          (existingSize) => !formSizeNames.includes(existingSize.size)
        )

        if (sizesToDelete.length > 0) {
          await tx.size.deleteMany({
            where: {
              id: {
                in: sizesToDelete.map((s) => s.id),
              },
            },
          })
        }
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
  if (!user || user.role !== 'ADMIN') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
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
      | (Product & { variantImages: Image[] } & {
          images: Image[] | null
        })
      | null = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        images: true,

        variantImages: true,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['محصول حذف شده است!'],
        },
      }
    }
    const ordersWithProduct = await prisma.orderItem.count({
      where: { productId: productId },
    })

    if (ordersWithProduct > 0) {
      return {
        errors: {
          _form: ['نمی‌توان محصول را حذف کرد زیرا در سفارشات موجود است!'],
        },
      }
    }

    const deletePromises: Promise<unknown>[] = []

    if (isExisting?.images && isExisting?.images?.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)
      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
    }

    if (isExisting?.variantImages && isExisting?.variantImages?.length > 0) {
      const oldImageKeys = isExisting.variantImages.map((img) => img.key)
      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
    }
    if (deletePromises.length > 0) {
      await Promise.allSettled(deletePromises) // Use allSettled to continue even if some fail
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
  redirect(`/dashboard/products`)
}

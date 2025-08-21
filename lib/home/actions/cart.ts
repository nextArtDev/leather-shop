'use server'

import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { CartProductType } from '@/lib/types/home'
import { revalidatePath } from 'next/cache'

// export async function saveAllToCart(items: CartProductType[]) {
//   try {
//     const user = await currentUser()
//     const userId = user?.id
//     if (!user || !user.id) {
//       return {
//         success: false,
//         message: 'لطفا وارد حساب کاربری خود شوید.',
//       }
//     }

//     // Validate that we have items
//     if (!items || items.length === 0) {
//       return {
//         success: false,
//         message: 'محصولی برای خرید انتخاب نشده است.',
//       }
//     }
//     const userCart = await prisma.cart.findFirst({
//       where: { userId },
//     })

//     // Delete any existing user cart
//     if (userCart) {
//       await prisma.cart.delete({
//         where: {
//           userId,
//         },
//       })
//     }
//     const validatedCartItems = await Promise.all(
//       items.map(async (cartProduct) => {
//         const { productId, sizeId, quantity } = cartProduct

//         // Fetch the product, variant, and size from the database
//         const product = await prisma.product.findUnique({
//           where: {
//             id: productId,
//           },
//           include: {
//             images: true,
//             sizes: {
//               where: {
//                 id: sizeId,
//               },
//             },
//           },
//         })

//         if (!product || product.sizes.length === 0) {
//           return {
//             success: false,
//             message: 'محصول یا سایز انتخابی اشتباه است.',
//           }
//         }

//         const size = product.sizes[0]

//         // Validate stock and price
//         const validQuantity = Math.min(quantity, size.quantity)

//         const price = size.discount
//           ? size.price - size.price * (size.discount / 100)
//           : size.price

//         // let shippingFee = 0
//         // const { shippingFeeMethod } = product
//         // if (shippingFeeMethod === 'ITEM') {
//         //   shippingFee =
//         //     quantity === 1
//         //       ? details.shippingFee
//         //       : details.shippingFee + details.extraShippingFee * (quantity - 1)
//         // } else if (shippingFeeMethod === 'WEIGHT') {
//         //   shippingFee = details.shippingFee * variant.weight * quantity
//         // } else if (shippingFeeMethod === 'FIXED') {
//         //   shippingFee = details.shippingFee
//         // }

//         // const totalPrice = price * validQuantity + shippingFee
//         const totalPrice = price * validQuantity + 0
//         revalidatePath(`/product/${product.slug}`)
//         return {
//           productId,
//           productSlug: product.slug,
//           sizeId,
//           sku: product.sku,
//           name: `${product.name} `,
//           image: product?.images?.[0].url || '',
//           size: size.size,
//           quantity: validQuantity,
//           price,
//           //   shippingFee,
//           totalPrice,
//         }
//       })
//     )
//     const subTotal = validatedCartItems.reduce(
//       (acc, item) => acc + item.price! * item.quantity!,
//       0
//     )

//     // const shippingFees = validatedCartItems.reduce(
//     //   (acc, item) => acc + item.shippingFee,
//     //   0
//     // )

//     // const total = subTotal + shippingFees

//     // Save the validated items to the cart in the database
//     const cart = await prisma.cart.create({
//       data: {
//         cartItems: {
//           create: validatedCartItems.map((item) => ({
//             productId: item.productId!,
//             sizeId: item.sizeId!,
//             sku: item.sku!,
//             productSlug: item.productSlug!,
//             name: item.name ?? '',
//             image: item.image ?? '',
//             quantity: item.quantity ?? 0,
//             size: item.size ?? '',
//             price: item.price ?? 0,
//             // shippingFee: item.shippingFee ?? 0,
//             // totalPrice: item.totalPrice ?? 0,
//             totalPrice: item.totalPrice ?? 0,
//           })),
//         },
//         // shippingFees,
//         subTotal,
//         total: subTotal,
//         userId: userId!,
//       },
//     })

//     return {
//       success: true,
//       message: `${validatedCartItems.length} item${
//         validatedCartItems.length > 1 ? 's' : ''
//       } added to cart`,
//     }
//   } catch (error) {
//     return {
//       success: false,
//       message: error,
//     }
//   }
// }

// app/actions/cart.ts

export interface SaveCartResult {
  success: boolean
  message: string
  cartId?: string
  validationErrors?: Array<{
    productId: string
    sizeId: string
    productName: string
    issue: string
    requestedQuantity: number
    availableStock: number
  }>
  correctedItems?: Array<{
    productId: string
    sizeId: string
    originalQuantity: number
    correctedQuantity: number
  }>
}

export async function saveAllToCart(
  items: CartProductType[]
): Promise<SaveCartResult> {
  try {
    // 1. Authentication check
    const user = await currentUser()
    if (!user?.id) {
      return {
        success: false,
        message: 'لطفا وارد حساب کاربری خود شوید.',
      }
    }

    // 2. Input validation
    if (!items || items.length === 0) {
      return {
        success: false,
        message: 'محصولی برای خرید انتخاب نشده است.',
      }
    }

    // 3. Start database transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing cart if exists
      const existingCart = await tx.cart.findFirst({
        where: { userId: user.id },
      })

      if (existingCart) {
        await tx.cart.delete({
          where: { id: existingCart.id },
        })
      }

      // 4. Validate all items and prepare cart data
      const validationErrors: SaveCartResult['validationErrors'] = []
      const correctedItems: SaveCartResult['correctedItems'] = []
      const validatedCartItems: Array<{
        productId: string
        sizeId: string
        productSlug: string
        sku: string
        name: string
        image: string
        size: string
        quantity: number
        price: number
        weight: number
        totalPrice: number
      }> = []

      for (const cartProduct of items) {
        const { productId, sizeId, quantity } = cartProduct

        // Fetch product with size information
        const product = await tx.product.findUnique({
          where: { id: productId },
          include: {
            images: {
              take: 1,
              orderBy: { created_at: 'asc' },
            },
            sizes: {
              where: { id: sizeId },
            },
          },
        })

        // Product validation
        if (!product) {
          validationErrors.push({
            productId,
            sizeId,
            productName: cartProduct.name || 'نامشخص',
            issue: 'محصول یافت نشد.',
            requestedQuantity: quantity,
            availableStock: 0,
          })
          continue
        }

        // Size validation
        const size = product.sizes[0]
        if (!size) {
          validationErrors.push({
            productId,
            sizeId,
            productName: product.name,
            issue: 'سایز انتخابی موجود نیست.',
            requestedQuantity: quantity,
            availableStock: 0,
          })
          continue
        }

        // Stock validation
        if (size.quantity <= 0) {
          validationErrors.push({
            productId,
            sizeId,
            productName: product.name,
            issue: 'موجودی تمام شده است.',
            requestedQuantity: quantity,
            availableStock: 0,
          })
          continue
        }

        // Quantity adjustment if needed
        const validQuantity = Math.min(quantity, size.quantity)
        if (validQuantity < quantity) {
          correctedItems.push({
            productId,
            sizeId,
            originalQuantity: quantity,
            correctedQuantity: validQuantity,
          })
        }

        // Calculate price with discount
        const price =
          size.discount && size.discount > 0
            ? size.price - size.price * (size.discount / 100)
            : size.price

        const totalPrice = price * validQuantity

        validatedCartItems.push({
          productId,
          sizeId,
          productSlug: product.slug,
          sku: product.sku,
          name: product.name,
          image: product.images[0]?.url || '',
          size: size.size,
          quantity: validQuantity,
          price,
          totalPrice,
          weight: product.weight || 0,
        })
      }

      // If there are critical validation errors, return them
      if (validationErrors.length > 0) {
        throw new Error('VALIDATION_FAILED')
      }

      // If no valid items after validation
      if (validatedCartItems.length === 0) {
        throw new Error('NO_VALID_ITEMS')
      }

      // Calculate totals
      const subTotal = validatedCartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )

      // Create new cart with items
      const cart = await tx.cart.create({
        data: {
          userId: user.id,
          subTotal,
          total: subTotal, // Will be updated after shipping calculation
          cartItems: {
            create: validatedCartItems.map((item) => ({
              productId: item.productId,
              sizeId: item.sizeId,
              productSlug: item.productSlug,
              sku: item.sku,
              name: item.name,
              image: item.image,
              size: item.size,
              quantity: item.quantity,
              price: item.price,
              totalPrice: item.totalPrice,
              shippingFee: 0, // Will be calculated later
            })),
          },
        },
      })

      return {
        cartId: cart.id,
        itemCount: validatedCartItems.length,
        correctedItems: correctedItems.length > 0 ? correctedItems : undefined,
      }
    })

    // Revalidate relevant paths
    revalidatePath('/cart')
    revalidatePath('/checkout')

    return {
      success: true,
      message: `${result.itemCount} محصول با موفقیت به سبد خرید اضافه شد.`,
      cartId: result.cartId,
      correctedItems: result.correctedItems,
    }
  } catch (error) {
    console.error('Save cart error:', error)

    if (error instanceof Error) {
      if (error.message === 'VALIDATION_FAILED') {
        // This would need to be handled differently since we're inside a transaction
        // For now, return a generic error
        return {
          success: false,
          message:
            'برخی محصولات قابل خرید نیستند. لطفا سبد خرید خود را بررسی کنید.',
        }
      }

      if (error.message === 'NO_VALID_ITEMS') {
        return {
          success: false,
          message: 'هیچ محصول معتبری برای خرید یافت نشد.',
        }
      }
    }

    return {
      success: false,
      message: 'خطایی در ذخیره سبد خرید رخ داد. لطفا دوباره تلاش کنید.',
    }
  }
}

// Additional helper action for getting cart with shipping calculation
export async function getCartForCheckout() {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            // You might want to include product details for validation
          },
        },
      },
    })

    if (!cart) {
      return { success: false, message: 'سبد خرید یافت نشد.' }
    }

    return {
      success: true,
      cart,
    }
  } catch (error) {
    console.error('Get cart error:', error)
    return {
      success: false,
      message: 'خطا در بارگذاری سبد خرید.',
    }
  }
}

// Action to update cart with shipping information
export async function updateCartWithShipping(
  cartId: string,
  shippingAddressId: string
) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    // Get shipping address
    const shippingAddress = await prisma.shippingAddress.findUnique({
      where: { id: shippingAddressId },
      include: {
        city: true,
        province: true,
      },
    })

    if (!shippingAddress || shippingAddress.userId !== user.id) {
      return { success: false, message: 'آدرس ارسال نامعتبر است.' }
    }

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: {
          include: {
            // Include product for shipping calculation
          },
        },
      },
    })

    if (!cart || cart.userId !== user.id) {
      return { success: false, message: 'سبد خرید نامعتبر است.' }
    }

    // Calculate shipping fees based on your business logic
    // This is where you'd implement your shipping calculation
    let totalShippingFee = 0
    const updatedItems = cart.cartItems.map((item) => {
      // Calculate shipping for each item
      const itemShippingFee = calculateShippingFee(item, shippingAddress)
      totalShippingFee += itemShippingFee
      return { ...item, shippingFee: itemShippingFee }
    })

    // Update cart with shipping information
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        total: cart.subTotal + totalShippingFee,
        cartItems: {
          updateMany: updatedItems.map((item) => ({
            where: { id: item.id },
            data: { shippingFee: item.shippingFee },
          })),
        },
      },
    })

    return {
      success: true,
      message: 'هزینه ارسال محاسبه شد.',
      totalShippingFee,
      total: cart.subTotal + totalShippingFee,
    }
  } catch (error) {
    console.error('Update shipping error:', error)
    return {
      success: false,
      message: 'خطا در محاسبه هزینه ارسال.',
    }
  }
}

// Helper function to calculate shipping fee
function calculateShippingFee(cartItem: any, shippingAddress: any): number {
  // Implement your shipping calculation logic here
  // This could be based on weight, location, item type, etc.
  return 0 // Placeholder
}

export async function fetchCurrentPricesAndStock(sizeIds: string[]) {
  try {
    const productSizes = await prisma.size.findMany({
      where: {
        id: {
          in: sizeIds,
        },
      },
      select: {
        id: true,
        price: true,
        quantity: true,
        productId: true,
        discount: true,
      },
    })

    return productSizes.map((size) => ({
      productId: size.productId,
      sizeId: size.id,
      price: size.price,
      stock: size.quantity,
      discount: size.discount,
    }))
  } catch (error) {
    console.error('Failed to fetch current prices and stock:', error)
    throw new Error('Unable to fetch current prices')
  }
}

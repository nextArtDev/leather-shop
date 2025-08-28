'use server'

import { currentUser } from '@/lib/auth'
import { Cart, CartItem } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { calculateShippingCost } from '@/lib/shipping-price'

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
        sku: string | ''
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
          sku: product.sku || '',
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
export async function getCartForCheckout(): Promise<
  Cart & { cartItems: CartItem[] }
> {
  try {
    const user = await currentUser()
    if (!user?.id) {
      // return { success: false, message: 'کاربر وارد نشده است.' }
      throw new Error('کاربر وارد نشده است.')
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
      // return { success: false, message: 'سبد خرید یافت نشد.' }
      throw new Error('سبد خرید یافت نشد.')
    }

    return cart
  } catch (error) {
    console.error('Get cart error:', error)

    throw new Error('خطا در بارگذاری سبد خرید.')
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
    // let totalShippingFee = 0
    const totalShippingFee = calculateShippingCost({
      origin: { province: 'خوزستان', city: 'دزفول' },
      destination: {
        province: shippingAddress.province.name,
        city: shippingAddress.city.name,
      },
      weightGrams: cart.cartItems.reduce(
        (acc, item) => acc + ((item.weight ?? 1000) * item.quantity || 2000),
        0
      ),
      valueRial:
        cart.cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ) * 10,
      dimensions: { length: 50, width: 50, height: 50 },
    })
    // const updatedItems = cart.cartItems.map((item) => {
    //   // Calculate shipping for each item
    //     // item,
    //     // shippingAddress
    //   )
    //   totalShippingFee += itemShippingFee
    //   return { ...item, shippingFee: itemShippingFee }
    // })

    // Update cart with shipping information
    await prisma.cart.update({
      where: { id: cartId },
      data: {
        total: cart.subTotal + totalShippingFee.total,
        shippingFees: totalShippingFee.total,
        // cartItems: {
        //   updateMany: updatedItems.map((item) => ({
        //     where: { id: item.id },
        //     data: { shippingFee: item.shippingFee },
        //   })),
        // },
      },
    })

    return {
      success: true,
      message: 'هزینه ارسال محاسبه شد.',
      totalShippingFee,
      total: cart.subTotal + totalShippingFee.total / 10,
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
// function calculateShippingFee(cartItem: any, shippingAddress: any): number {
//   // Implement your shipping calculation logic here
//   // This could be based on weight, location, item type, etc.
//   return 0 // Placeholder
// }

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

// -----------------------------
// Real Time validation Cart
// -----------------------------

export interface DbCartItem {
  id: string
  productId: string
  sizeId: string
  productSlug: string
  sku: string
  name: string
  image: string
  size: string
  price: number
  quantity: number
  shippingFee: number
  totalPrice: number
  // Validation fields
  currentStock: number
  currentPrice: number
  isStockValid: boolean
  isPriceValid: boolean
  maxAvailableQuantity: number
}

export interface DbCart {
  id: string
  userId: string
  subTotal: number
  shippingFees: number
  total: number
  items: DbCartItem[]
  hasValidationIssues: boolean
  validationErrors: Array<{
    itemId: string
    productName: string
    issue: string
    severity: 'warning' | 'error'
  }>
}

export interface CartValidationResult {
  success: boolean
  cart?: DbCart
  message: string
  requiresUserAction?: boolean
}

// Get cart with real-time validation
export async function getValidatedCart(): Promise<CartValidationResult> {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return {
        success: false,
        message: 'کاربر وارد نشده است.',
      }
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        cartItems: true,
      },
    })

    if (!cart) {
      return {
        success: false,
        message: 'سبد خرید یافت نشد.',
      }
    }

    // Validate each item against current product data
    const validatedItems: DbCartItem[] = []
    const validationErrors: DbCart['validationErrors'] = []
    let hasValidationIssues = false
    let recalculatedSubTotal = 0

    for (const item of cart.cartItems) {
      // Get current product and size data
      const currentProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          sizes: {
            where: { id: item.sizeId },
          },
          images: {
            take: 1,
            orderBy: { created_at: 'asc' },
          },
        },
      })

      if (!currentProduct) {
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: 'محصول دیگر موجود نیست.',
          severity: 'error',
        })
        hasValidationIssues = true
        continue
      }

      const currentSize = currentProduct.sizes[0]
      if (!currentSize) {
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: 'سایز انتخابی دیگر موجود نیست.',
          severity: 'error',
        })
        hasValidationIssues = true
        continue
      }

      // Calculate current price
      const currentPrice =
        currentSize.discount && currentSize.discount > 0
          ? currentSize.price - currentSize.price * (currentSize.discount / 100)
          : currentSize.price

      // Check stock
      const isStockValid = currentSize.quantity >= item.quantity
      const maxAvailableQuantity = currentSize.quantity

      // Check price
      const isPriceValid = Math.abs(currentPrice - item.price) < 0.01

      // Add validation issues
      if (!isStockValid) {
        if (currentSize.quantity === 0) {
          validationErrors.push({
            itemId: item.id,
            productName: item.name,
            issue: 'موجودی تمام شده است.',
            severity: 'error',
          })
        } else {
          validationErrors.push({
            itemId: item.id,
            productName: item.name,
            issue: `تنها ${currentSize.quantity} عدد در انبار موجود است. (درخواستی: ${item.quantity})`,
            severity: 'warning',
          })
        }
        hasValidationIssues = true
      }

      if (!isPriceValid) {
        validationErrors.push({
          itemId: item.id,
          productName: item.name,
          issue: `قیمت تغییر کرده است! قیمت قبلی: ${item.price.toLocaleString()}، قیمت جدید: ${currentPrice.toLocaleString()}`,
          severity: 'warning',
        })
        hasValidationIssues = true
      }

      // Create validated item
      const validatedQuantity = Math.min(item.quantity, currentSize.quantity)
      const validatedTotalPrice = currentPrice * validatedQuantity

      validatedItems.push({
        id: item.id,
        productId: item.productId,
        sizeId: item.sizeId,
        productSlug: item.productSlug,
        sku: item.sku,
        name: item.name,
        image: currentProduct.images[0]?.url || item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        shippingFee: item.shippingFee,
        totalPrice: item.totalPrice,
        // Current validation data
        currentStock: currentSize.quantity,
        currentPrice,
        isStockValid,
        isPriceValid,
        maxAvailableQuantity,
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      recalculatedSubTotal += validatedTotalPrice
    }

    const validatedCart: DbCart = {
      id: cart.id,
      userId: cart.userId,
      subTotal: cart.subTotal,
      shippingFees: cart.shippingFees,
      total: cart.total,
      items: validatedItems,
      hasValidationIssues,
      validationErrors,
    }

    return {
      success: true,
      cart: validatedCart,
      message: hasValidationIssues
        ? 'سبد خرید شما بروزرسانی شده است. لطفا تغییرات را بررسی کنید.'
        : 'سبد خرید معتبر است.',
      requiresUserAction: hasValidationIssues,
    }
  } catch (error) {
    console.error('Cart validation error:', error)
    return {
      success: false,
      message: 'خطا در بارگذاری سبد خرید.',
    }
  }
}

// Fix cart issues automatically where possible
export async function autoFixCartIssues(cartId: string) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: { cartItems: true },
      })

      if (!cart || cart.userId !== user.id) {
        throw new Error('سبد خرید نامعتبر است.')
      }

      for (const item of cart.cartItems) {
        // Get current product data
        const currentProduct = await tx.product.findUnique({
          where: { id: item.productId },
          include: {
            sizes: { where: { id: item.sizeId } },
          },
        })

        if (!currentProduct || currentProduct.sizes.length === 0) {
          // Remove invalid items
          await tx.cartItem.delete({ where: { id: item.id } })
          continue
        }

        const currentSize = currentProduct.sizes[0]
        const currentPrice =
          currentSize.discount && currentSize.discount > 0
            ? currentSize.price -
              currentSize.price * (currentSize.discount / 100)
            : currentSize.price

        // Fix quantity if exceeds stock
        const validQuantity = Math.min(item.quantity, currentSize.quantity)

        if (currentSize.quantity === 0) {
          // Remove out of stock items
          await tx.cartItem.delete({ where: { id: item.id } })
          continue
        }

        // Update item with corrected values
        await tx.cartItem.update({
          where: { id: item.id },
          data: {
            quantity: validQuantity,
            price: currentPrice,
            totalPrice: currentPrice * validQuantity,
          },
        })
      }

      // Recalculate cart totals
      const updatedItems = await tx.cartItem.findMany({
        where: { cartId: cart.id },
      })

      const newSubTotal = updatedItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      )

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          subTotal: newSubTotal,
          total: newSubTotal, // Will be updated with shipping later
        },
      })
    })

    revalidatePath('/checkout')
    return {
      success: true,
      message: 'سبد خرید اصلاح شد.',
    }
  } catch (error) {
    console.error('Auto fix cart error:', error)
    return {
      success: false,
      message: 'خطا در اصلاح سبد خرید.',
    }
  }
}

// Remove invalid items from cart
export async function removeCartItems(cartId: string, itemIds: string[]) {
  try {
    const user = await currentUser()
    if (!user?.id) {
      return { success: false, message: 'کاربر وارد نشده است.' }
    }

    await prisma.$transaction(async (tx) => {
      // Verify cart ownership
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
      })

      if (!cart || cart.userId !== user.id) {
        throw new Error('سبد خرید نامعتبر است.')
      }

      // Remove items
      await tx.cartItem.deleteMany({
        where: {
          id: { in: itemIds },
          cartId: cartId,
        },
      })

      // Recalculate cart totals
      const remainingItems = await tx.cartItem.findMany({
        where: { cartId: cartId },
      })

      const newSubTotal = remainingItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      )

      await tx.cart.update({
        where: { id: cartId },
        data: {
          subTotal: newSubTotal,
          total: newSubTotal,
        },
      })
    })

    revalidatePath('/checkout')
    return {
      success: true,
      message: 'محصولات حذف شدند.',
    }
  } catch (error) {
    console.error('Remove cart items error:', error)
    return {
      success: false,
      message: 'خطا در حذف محصولات.',
    }
  }
}

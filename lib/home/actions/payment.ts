// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use server'

// import { revalidatePath } from 'next/cache'
// import ZarinPalCheckout from 'zarinpal-checkout'

// import { auth } from '@/lib/auth'
// import prisma from '@/lib/prisma'
// import { PaymentResult } from '../schemas'
// import { headers } from 'next/headers'

// const currentUser = async () => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//   if (!session?.user?.id) {
//     return null
//   }

//   // Fetch the complete user data including role
//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       phoneNumber: true,
//       role: true,
//     },
//   })
// }
// // Types
// interface ZarinpalPaymentFormState {
//   errors: {
//     orderId?: string[]
//     amount?: string[]
//     _form?: string[]
//   }
//   payment?: {
//     status?: number
//     authority?: string
//     url?: string
//   }
// }

// interface PaymentVerificationResult {
//   status: number
//   refId: number
// }

// interface PaymentRequestResult {
//   status: number
//   authority: string
//   url: string
// }

// // Constants
// const PAYMENT_STATUS = {
//   SUCCESS: 100,
//   OK: 'OK',
//   NOK: 'NOK',
// } as const

// const ERROR_MESSAGES = {
//   UNAUTHORIZED: 'شما اجازه دسترسی ندارید!',
//   ORDER_NOT_FOUND: 'سفارش در دسترس نیست!',
//   ORDER_DELETED: 'سفارش حذف شده است!',
//   INVALID_PAYMENT_RESPONSE: 'پاسخ درگاه پرداخت معتبر نیست!',
//   INVALID_PAYMENT_INFO: 'اطلاعات پرداخت نادرست است!',
//   PAYMENT_ERROR: 'پرداخت با خطا مواجه شده است!',
//   PAYMENT_FAILED: 'مشکلی در پرداخت پیش آمده، لطفا دوباره امتحان کنید!',
//   GENERIC_ERROR: 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!',
//   ORDER_ALREADY_PAID: 'Order is already paid',
// } as const

// // In-memory cache to prevent duplicate processing
// const processingCache = new Map<string, Promise<any>>()

// // Utility functions
// const createZarinpalInstance = () => {
//   const apiKey = process.env.ZARINPAL_KEY
//   if (!apiKey) {
//     throw new Error('ZARINPAL_KEY environment variable is not set')
//   }
//   return ZarinPalCheckout.create(apiKey, true)
// }

// const user = await currentUser()

// const validatePaymentParameters = (
//   orderId: string,
//   Authority?: string,
//   Status?: string
// ) => {
//   if (!orderId) {
//     return { isValid: false, error: ERROR_MESSAGES.ORDER_NOT_FOUND }
//   }

//   if (
//     Authority !== undefined &&
//     Status !== undefined &&
//     (!Status || !Authority)
//   ) {
//     return { isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_RESPONSE }
//   }

//   return { isValid: true }
// }

// const findOrderByIdAndUser = async (orderId: string, userId: string) => {
//   return await prisma.order.findFirst({
//     where: {
//       id: orderId,
//       userId: userId,
//     },
//     include: {
//       // orderitems: true,
//       items: true,
//       paymentDetails: true,
//     },
//   })
// }

// // Main payment approval function
// export async function zarinpalPaymentApproval(
//   path: string,
//   orderId: string,
//   Authority: string,
//   Status: string
// ) {
//   // Create a unique key for this payment verification
//   const cacheKey = `verify-${orderId}-${Authority}`

//   // Check if we're already processing this exact payment
//   if (processingCache.has(cacheKey)) {
//     console.log('Already processing payment verification for:', cacheKey)
//     try {
//       return await processingCache.get(cacheKey)
//     } catch (error) {
//       processingCache.delete(cacheKey) // Clean up on error
//       throw error
//     }
//   }

//   // Create the processing promise
//   const processingPromise = (async () => {
//     try {
//       console.log('Starting payment approval for:', {
//         orderId,
//         Authority,
//         Status,
//       })

//       // Get current user
//       const user = await currentUser()
//       if (!user?.id) {
//         return {
//           errors: {
//             _form: [ERROR_MESSAGES.UNAUTHORIZED],
//           },
//         }
//       }

//       // Validate parameters
//       const validation = validatePaymentParameters(orderId, Authority, Status)
//       if (!validation.isValid) {
//         return {
//           errors: {
//             _form: [validation.error!],
//           },
//         }
//       }

//       // Find order - get fresh data from database
//       const order = await findOrderByIdAndUser(orderId, user.id)
//       if (!order) {
//         return {
//           errors: {
//             _form: [ERROR_MESSAGES.ORDER_DELETED],
//           },
//         }
//       }

//       // CRITICAL: Check if order is already paid to prevent double processing
//       if (order.paymentDetails?.status === 'Paid') {
//         console.log('Order already paid, skipping verification:', orderId)
//         return { success: true, alreadyPaid: true }
//       }

//       // Handle payment status
//       if (Status === PAYMENT_STATUS.OK) {
//         return await verifySuccessfulPayment(order, Authority, orderId, path)
//       } else if (Status === PAYMENT_STATUS.NOK) {
//         await markPaymentAsFailed(orderId, user.id)
//         return {
//           errors: {
//             _form: [ERROR_MESSAGES.PAYMENT_ERROR],
//           },
//         }
//       }

//       return {
//         errors: {
//           _form: [ERROR_MESSAGES.INVALID_PAYMENT_RESPONSE],
//         },
//       }
//     } catch (error) {
//       console.error('Payment approval error:', error)
//       return {
//         errors: {
//           _form: [
//             error instanceof Error
//               ? error.message
//               : ERROR_MESSAGES.GENERIC_ERROR,
//           ],
//         },
//       }
//     } finally {
//       revalidatePath(path)
//       // Clean up the cache after processing
//       setTimeout(() => {
//         processingCache.delete(cacheKey)
//       }, 5000) // Keep in cache for 5 seconds to prevent immediate duplicates
//     }
//   })()

//   // Store the promise in cache
//   processingCache.set(cacheKey, processingPromise)

//   return await processingPromise
// }

// // Helper function to verify successful payment
// async function verifySuccessfulPayment(
//   order: any,
//   Authority: string,
//   orderId: string,
//   path: string
// ) {
//   const zarinpal = createZarinpalInstance()

//   // Additional security check: verify the Authority matches the order's payment result
//   const storedPaymentResult = order.paymentResult as any
//   if (
//     storedPaymentResult?.authority &&
//     storedPaymentResult.authority !== Authority
//   ) {
//     console.log('Authority mismatch - possible cross-order contamination:', {
//       stored: storedPaymentResult.authority,
//       received: Authority,
//       orderId,
//     })
//     return {
//       errors: {
//         _form: [ERROR_MESSAGES.INVALID_PAYMENT_INFO],
//       },
//     }
//   }

//   // Double-check order is not already paid (race condition protection)
//   const freshOrder = await prisma.order.findFirst({
//     where: { id: orderId },
//     // select: { isPaid: true, userId: true },
//     select: {
//       paymentStatus: true,
//       userId: true,
//     },
//   })

//   if (!freshOrder) {
//     return {
//       errors: {
//         _form: [ERROR_MESSAGES.ORDER_NOT_FOUND],
//       },
//     }
//   }

//   if (freshOrder.paymentStatus === 'Paid') {
//     console.log('Order was paid during verification process:', orderId)
//     return { success: true, alreadyPaid: true }
//   }

//   const verification = (await zarinpal.PaymentVerification({
//     Amount: Number(order.totalPrice),
//     Authority,
//   })) as PaymentVerificationResult

//   console.log('Payment verification result:', verification)

//   if (verification.status === PAYMENT_STATUS.SUCCESS) {
//     console.log(`Payment verified! Ref ID: ${verification.refId}`)

//     // Use a transaction to ensure atomicity and prevent race conditions
//     try {
//       await updateOrderToPaid({
//         orderId,
//         paymentResult: {
//           id: verification.refId.toString(),
//           status: PAYMENT_STATUS.OK,
//           authority: Authority,
//           fee: order.totalPrice.toString(),
//         },
//       })

//       return { success: true }
//     } catch (error) {
//       // Check if the error is due to order already being paid
//       if (
//         error instanceof Error &&
//         error.message === ERROR_MESSAGES.ORDER_ALREADY_PAID
//       ) {
//         console.log('Order was already paid during update process')
//         return { success: true, alreadyPaid: true }
//       }
//       throw error
//     }
//   } else {
//     console.log('Payment verification failed with status:', verification.status)
//     await markPaymentAsFailed(orderId, order.userId)

//     return {
//       errors: {
//         _form: [ERROR_MESSAGES.INVALID_PAYMENT_INFO],
//       },
//     }
//   }
// }

// // Helper function to mark payment as failed
// async function markPaymentAsFailed(orderId: string, userId: string) {
//   await prisma.order.update({
//     where: {
//       id: orderId,
//       userId: userId,
//     },
//     data: {
//       // isPaid: false,
//       paymentStatus: 'Pending',
//     },
//   })
// }

// // Main payment request function
// export async function zarinpalPayment(
//   path: string,
//   orderId: string,
//   formState: ZarinpalPaymentFormState,
//   formData: FormData
// ): Promise<ZarinpalPaymentFormState> {
//   try {
//     // Get current user
//     const user = await currentUser()
//     if (!user || !user.id) {
//       return {
//         errors: {
//           _form: [ERROR_MESSAGES.UNAUTHORIZED],
//         },
//       }
//     }
//     const userId = user.id

//     // Validate parameters
//     const validation = validatePaymentParameters(orderId)
//     if (!validation.isValid) {
//       return {
//         errors: {
//           _form: [validation.error!],
//         },
//       }
//     }

//     // Find order
//     const order = await findOrderByIdAndUser(orderId, userId)
//     if (!order) {
//       return {
//         errors: {
//           _form: [ERROR_MESSAGES.ORDER_DELETED],
//         },
//       }
//     }

//     // Check if order is already paid
//     // if (order.isPaid) {
//     if (order.paymentStatus === 'Paid') {
//       return {
//         errors: {
//           _form: ['این سفارش قبلاً پرداخت شده است'],
//         },
//       }
//     }

//     console.log('Processing payment for order:', {
//       orderId,
//       totalPrice: order.total,
//     })

//     // Create payment request
//     const payment = await createPaymentRequest(order, orderId)

//     // Update order with payment request
//     await updateOrderWithPaymentRequest(orderId, userId, payment)

//     if (payment?.status === PAYMENT_STATUS.SUCCESS) {
//       return {
//         payment,
//         errors: {},
//       }
//     } else {
//       return {
//         errors: {
//           _form: [ERROR_MESSAGES.PAYMENT_FAILED],
//         },
//       }
//     }
//   } catch (error) {
//     console.error('Payment request error:', error)
//     return {
//       errors: {
//         _form: [
//           error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR,
//         ],
//       },
//     }
//   } finally {
//     revalidatePath(path)
//   }
// }

// // Helper function to create payment request
// async function createPaymentRequest(order: any, orderId: string) {
//   const zarinpal = createZarinpalInstance()

//   const callbackURL =
//     process.env.NODE_ENV === 'production'
//       ? `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}`
//       : `http://localhost:3000/order/${orderId}`

//   const user = await currentUser()
//   if (!user?.phoneNumber) return null
//   const payment = (await zarinpal.PaymentRequest({
//     Amount: Number(order.totalPrice),
//     CallbackURL: callbackURL,
//     Description: `Payment for order ${orderId}`,
//     Mobile: user.phoneNumber, // TODO: Get from user data
//   })) as PaymentRequestResult

//   console.log('Payment request result:', payment)
//   return payment
// }

// // Helper function to update order with payment request
// async function updateOrderWithPaymentRequest(
//   orderId: string,
//   userId: string,
//   payment: PaymentRequestResult
// ) {
//   // await prisma.order.update({
//   //   where: {
//   //     id: orderId,
//   //     userId: userId,
//   //   },
//   //   data: {
//   //     paymentDetails:{

//   //       Status: payment.status,
//   //       authority: payment.authority,
//   //     }

//   //   },
//   // })
//   await prisma.paymentDetails.update({
//     where: {
//       id: orderId,
//       userId: userId,
//     },
//     data: {
//       status: payment.status.toString(),
//       Authority: payment.authority,
//     },
//   })
// }

// // Function to update order to paid status with race condition protection
// export async function updateOrderToPaid({
//   orderId,
//   paymentResult,
// }: {
//   orderId: string
//   paymentResult?: PaymentResult
// }) {
//   console.log('Updating order to paid:', { orderId, paymentResult })

//   // Use a database transaction to prevent race conditions
//   return await prisma.$transaction(async (tx) => {
//     // Get order from database with a lock
//     const order = await tx.order.findFirst({
//       where: {
//         id: orderId,
//       },
//       include: {
//         items: true,
//       },
//     })

//     if (!order) {
//       throw new Error('Order not found')
//     }

//     // CRITICAL: Check if order is already paid
//     if (order.paymentStatus === 'Paid') {
//       console.log('Order already paid during transaction:', orderId)
//       throw new Error(ERROR_MESSAGES.ORDER_ALREADY_PAID)
//     }

//     // Update product stock for each item
//     for (const item of order.items) {
//       await tx.size.update({
//         where: { productId: item.productId, id: item.sizeId },
//         data: {
//           quantity: {
//             decrement: item.quantity,
//           },
//         },
//       })
//     }

//     // Mark order as paid
//     const updatedOrder = await tx.order.update({
//       where: { id: orderId },
//       data: {
//         // isPaid: true,

//         // paidAt: new Date(),
//         // paymentResult,
//         paymentStatus: 'Paid',
//         // paymentDetails:
//       },
//       include: {
//         items: true,
//         user: { select: { name: true, phoneNumber: true } },
//         paymentDetails: true,
//       },
//     })
//     await tx.paymentDetails.update({
//       where: {
//         orderId: updatedOrder.id,
//       },
//       data: {
//         status: paymentResult?.status,
//         Authority: paymentResult?.authority,
//         amount: Number(paymentResult?.fee),
//       },
//     })

//     console.log('Order successfully updated to paid:', { orderId })
//     return updatedOrder
//   })

//   // TODO: Send SMS notification after successful transaction
//   // await sendPurchaseReceipt({
//   //   order: {
//   //     ...updatedOrder,
//   //     shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
//   //     paymentResult: updatedOrder.paymentResult as PaymentResult,
//   //   },
//   // })
// }

// // Additional helper function to deliver order (for admin use)
// export async function deliverOrder(orderId: string) {
//   try {
//     const userId = await currentUser()
//     if (!userId) {
//       return {
//         success: false,
//         message: ERROR_MESSAGES.UNAUTHORIZED,
//       }
//     }

//     // TODO: Add admin authorization check
//     // const user = await getCurrentUser()
//     if (user?.role !== 'ADMIN') {
//       return {
//         success: false,
//         message: 'شما اجازه انجام این عمل را ندارید!',
//       }
//     }

//     const order = await prisma.order.findFirst({
//       where: { id: orderId },
//     })

//     if (!order) {
//       return {
//         success: false,
//         message: ERROR_MESSAGES.ORDER_NOT_FOUND,
//       }
//     }

//     if (order.paymentStatus !== 'Paid') {
//       return {
//         success: false,
//         message: 'سفارش هنوز پرداخت نشده است!',
//       }
//     }

//     if (order.orderStatus === 'Delivered') {
//       return {
//         success: false,
//         message: 'سفارش قبلاً تحویل داده شده است!',
//       }
//     }

//     await prisma.order.update({
//       where: { id: orderId },
//       data: {
//         orderStatus: 'Delivered',
//         // isDelivered: true,
//         // deliveredAt: new Date(),
//       },
//     })

//     return {
//       success: true,
//       message: 'سفارش با موفقیت به عنوان تحویل شده علامت‌گذاری شد!',
//     }
//   } catch (error) {
//     console.error('Deliver order error:', error)
//     return {
//       success: false,
//       message: ERROR_MESSAGES.GENERIC_ERROR,
//     }
//   }
// }

// // Helper function to get order by ID with better validation
// export async function getOrderById(orderId: string | undefined) {
//   try {
//     console.log('getOrderById called with:', { orderId, type: typeof orderId })

//     // Validate orderId parameter - MUST be a valid string
//     if (
//       !orderId ||
//       orderId === 'undefined' ||
//       typeof orderId !== 'string' ||
//       orderId.trim() === ''
//     ) {
//       console.error('Invalid or missing orderId provided:', orderId)
//       return null
//     }

//     const user = await currentUser()
//     if (!user || user.id) {
//       console.error('No userId found')
//       return null
//     }

//     const order = await prisma.order.findFirst({
//       where: {
//         id: orderId.trim(),
//         userId: user.id,
//       },
//       include: {
//         items: true,
//       },
//     })

//     if (order && order.id === orderId.trim()) {
//       return order
//     }

//     console.error('No order found for ID:', orderId)
//     return null
//   } catch (error) {
//     console.error('Get order by ID error:', error)
//     return null
//   }
// }

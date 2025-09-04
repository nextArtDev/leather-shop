// 'use client'

// import { Badge } from '@/components/ui/badge'
// import { Card, CardContent } from '@/components/ui/card'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { Button } from '@/components/ui/button'
// import Link from 'next/link'
// import Image from 'next/image'

// import {
//   useActionState,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   useTransition,
//   useRef,
// } from 'react'

// import { Order, OrderItem, ShippingAddress, User } from '@/lib/generated/prisma'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import { toast } from 'sonner'
// import {
//   zarinpalPayment,
//   zarinpalPaymentApproval,
// } from '@/lib/home/actions/payment1'
// import { deliverOrder, updateOrderToPaidCOD } from '@/lib/home/actions/order'
// import { formatDateTime, formatId } from '@/lib/utils'

// // Types
// interface ZarinpalResponse {
//   Authority: string
//   Status: string
// }

// interface PaymentActionState {
//   errors: Record<string, string[]>
//   payment: { url?: string }
// }

// interface ExtendedShippingAddress extends ShippingAddress {
//   province: { name: string }
//   city: { name: string }
// }

// type ExtendedUser = Pick<User, 'name' | 'phoneNumber'>

// interface ExtendedOrder extends Order {
//   items: OrderItem[]
//   shippingAddress: ExtendedShippingAddress
//   user: ExtendedUser
// }

// interface OrderDetailsTableProps {
//   order: ExtendedOrder
//   isAdmin: boolean
// }

// // Constants
// const PAYMENT_STATUS = {
//   OK: 'OK',
//   NOK: 'NOK',
// } as const

// // Helper functions
// const parseDate = (date: Date | string | null): Date | null => {
//   if (!date) return null
//   if (date instanceof Date) return date
//   if (typeof date === 'string') return new Date(date)
//   return null
// }

// const OrderDetailsTable = ({ order, isAdmin }: OrderDetailsTableProps) => {
//   const pathname = usePathname()
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   // Refs for tracking state
//   const currentOrderIdRef = useRef(order.id)
//   const paymentProcessedRef = useRef<Set<string>>(new Set())

//   // Extract order properties with proper typing
//   const {
//     id,
//     shippingAddress,
//     items: orderItems,
//     subTotal: itemsPrice,
//     shippingFees: shippingPrice,
//     total: totalPrice,
//     orderStatus,
//     paymentStatus,
//     updatedAt: rawPaidAt,
//   } = order

//   // Derived values
//   const isDelivered = orderStatus === 'Delivered'
//   const isPaid = paymentStatus === 'Paid'
//   const paidAt = parseDate(rawPaidAt)

//   // State
//   const [zarinpalResponse, setZarinpalResponse] = useState<ZarinpalResponse>({
//     Authority: '',
//     Status: '',
//   })
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false)

//   // Payment action
//   const [actionState, zarinpalPaymentAction, isPending] = useActionState(
//     zarinpalPayment.bind(null, pathname, id),
//     {
//       errors: {},
//       payment: {},
//     } as PaymentActionState
//   )

//   // Reset state when order changes
//   useEffect(() => {
//     if (currentOrderIdRef.current !== id) {
//       currentOrderIdRef.current = id
//       setZarinpalResponse({ Authority: '', Status: '' })
//       setIsProcessingPayment(false)

//       const hasPaymentParams =
//         searchParams?.get('Authority') || searchParams?.get('Status')
//       if (hasPaymentParams) {
//         router.replace(pathname, { scroll: false })
//       }
//     }
//   }, [id, pathname, router, searchParams])

//   // Computed values
//   const isPaymentSuccessful = useMemo(() => {
//     const hasValidCallback =
//       zarinpalResponse.Status === PAYMENT_STATUS.OK &&
//       zarinpalResponse.Authority &&
//       !isPaid &&
//       currentOrderIdRef.current === id

//     return isPaid || (hasValidCallback && isProcessingPayment)
//   }, [
//     isPaid,
//     zarinpalResponse.Status,
//     zarinpalResponse.Authority,
//     isProcessingPayment,
//     id,
//   ])

//   const formattedShippingAddress = useMemo(() => {
//     if (!shippingAddress) return ''
//     return `${shippingAddress.province.name}، ${shippingAddress.city.name}، ${shippingAddress.address1}، ${shippingAddress.zip_code}`
//   }, [shippingAddress])

//   // Payment verification
//   const verifyPayment = useCallback(async () => {
//     if (currentOrderIdRef.current !== id) return
//     if (!zarinpalResponse.Authority || !zarinpalResponse.Status) return
//     if (isPaid) return

//     const paymentKey = `${id}-${zarinpalResponse.Authority}`
//     if (paymentProcessedRef.current.has(paymentKey)) return

//     paymentProcessedRef.current.add(paymentKey)
//     setIsProcessingPayment(true)

//     try {
//       const result = await zarinpalPaymentApproval(
//         pathname,
//         id,
//         zarinpalResponse.Authority,
//         zarinpalResponse.Status
//       )

//       if (result?.errors?._form) {
//         toast.error(result.errors._form[0])
//       } else if (result?.success) {
//         if (result.alreadyPaid) {
//           toast.success('سفارش قبلاً پرداخت شده بود')
//         } else {
//           toast.success('پرداخت با موفقیت انجام شد')
//         }

//         router.replace(pathname, { scroll: false })
//         setTimeout(() => router.refresh(), 1000)
//       }
//     } catch (error) {
//       console.error('Payment verification failed:', error)
//       toast.error('خطا در تأیید پرداخت')
//       paymentProcessedRef.current.delete(paymentKey)
//     } finally {
//       setIsProcessingPayment(false)
//     }
//   }, [
//     pathname,
//     id,
//     zarinpalResponse.Authority,
//     zarinpalResponse.Status,
//     router,
//     isPaid,
//   ])

//   // Handle URL parameters
//   useEffect(() => {
//     const authority = searchParams?.get('Authority')
//     const status = searchParams?.get('Status')

//     if (
//       authority &&
//       status &&
//       currentOrderIdRef.current === id &&
//       !zarinpalResponse.Authority &&
//       !zarinpalResponse.Status &&
//       !isPaid
//     ) {
//       setZarinpalResponse({ Authority: authority, Status: status })
//     } else if (authority && status && isPaid) {
//       router.replace(pathname, { scroll: false })
//     }
//   }, [
//     searchParams,
//     id,
//     zarinpalResponse.Authority,
//     zarinpalResponse.Status,
//     isPaid,
//     router,
//     pathname,
//   ])

//   // Verify payment when response is available
//   useEffect(() => {
//     if (
//       zarinpalResponse.Authority &&
//       zarinpalResponse.Status &&
//       currentOrderIdRef.current === id &&
//       !isPaid
//     ) {
//       verifyPayment()
//     }
//   }, [verifyPayment, zarinpalResponse, id, isPaid])

//   // Handle payment redirect
//   useEffect(() => {
//     if (actionState.payment?.url && currentOrderIdRef.current === id) {
//       router.push(actionState.payment.url)
//     }
//   }, [actionState.payment?.url, router, id])

//   // Show error messages
//   useEffect(() => {
//     if (actionState.errors?._form) {
//       toast.error(actionState.errors._form[0])
//     }
//   }, [actionState.errors])

//   return (
//     <div className="container mx-auto py-4">
//       <h1 className="text-2xl font-bold mb-6">سفارش {formatId(id)}</h1>

//       <div className="grid md:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="md:col-span-2 space-y-4">
//           <PaymentStatusCard isPaid={isPaid} paidAt={paidAt} />
//           <ShippingAddressCard
//             shippingAddress={shippingAddress}
//             formattedAddress={formattedShippingAddress}
//             isDelivered={isDelivered}
//           />
//           <OrderItemsCard orderItems={orderItems} />
//         </div>

//         {/* Order Summary Sidebar */}
//         <div>
//           <OrderSummaryCard
//             itemsPrice={Number(itemsPrice)}
//             shippingPrice={Number(shippingPrice)}
//             totalPrice={Number(totalPrice)}
//             isPaymentSuccessful={Boolean(isPaymentSuccessful)}
//             isPending={isPending}
//             zarinpalPaymentAction={zarinpalPaymentAction}
//             isAdmin={isAdmin}
//             isPaid={isPaid}
//             isDelivered={isDelivered}
//             orderId={id}
//             paidAt={paidAt}
//             isProcessingPayment={isProcessingPayment}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// // Sub-components
// const PaymentStatusCard = ({
//   isPaid,
//   paidAt,
// }: {
//   isPaid: boolean
//   paidAt: Date | null
// }) => (
//   <Card>
//     <CardContent className="p-4">
//       <h2 className="text-xl mb-4">وضعیت پرداخت</h2>
//       {isPaid ? (
//         <Badge variant="secondary">
//           {paidAt
//             ? `پرداخت در ${formatDateTime(paidAt).dateTime}`
//             : 'پرداخت شده'}
//         </Badge>
//       ) : (
//         <Badge variant="destructive">پرداخت نشده</Badge>
//       )}
//     </CardContent>
//   </Card>
// )

// const ShippingAddressCard = ({
//   shippingAddress,
//   formattedAddress,
//   isDelivered,
// }: {
//   shippingAddress: ExtendedShippingAddress
//   formattedAddress: string
//   isDelivered: boolean
// }) => (
//   <Card>
//     <CardContent className="p-4">
//       <h2 className="text-xl mb-4">آدرس ارسال</h2>
//       <p className="mb-2 font-medium">{shippingAddress.name}</p>
//       <p className="mb-4 text-gray-600">{formattedAddress}</p>
//       {isDelivered ? (
//         <Badge variant="secondary">تحویل شده</Badge>
//       ) : (
//         <Badge variant="destructive">تحویل نشده</Badge>
//       )}
//     </CardContent>
//   </Card>
// )

// const OrderItemsCard = ({ orderItems }: { orderItems: OrderItem[] }) => (
//   <Card>
//     <CardContent className="p-4">
//       <h2 className="text-xl mb-4">سفارشها</h2>
//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>سفارش</TableHead>
//               <TableHead>تعداد</TableHead>
//               <TableHead className="text-right">هزینه</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {orderItems.map((item) => (
//               <TableRow key={`${item.productSlug}-${item.productId}`}>
//                 <TableCell>
//                   <Link
//                     href={`/product/${item.productSlug}`}
//                     className="flex items-center hover:opacity-80 transition-opacity"
//                   >
//                     <Image
//                       unoptimized
//                       src={item.image}
//                       alt={item.name}
//                       width={50}
//                       height={50}
//                       className="rounded-md object-cover"
//                     />
//                     <span className="px-2 text-sm">{item.name}</span>
//                   </Link>
//                 </TableCell>
//                 <TableCell>
//                   <span className="px-2">{item.quantity}</span>
//                 </TableCell>
//                 <TableCell className="text-right font-medium">
//                   {Number(item.price).toLocaleString('fa-IR')} تومان
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </CardContent>
//   </Card>
// )

// const OrderSummaryCard = ({
//   itemsPrice,
//   shippingPrice,
//   totalPrice,
//   isPending,
//   zarinpalPaymentAction,
//   isAdmin,
//   isPaid,
//   isDelivered,
//   orderId,
//   paidAt,
//   isProcessingPayment,
// }: {
//   itemsPrice: number
//   shippingPrice: number
//   totalPrice: number
//   isPaymentSuccessful: boolean
//   isPending: boolean
//   zarinpalPaymentAction: (formData: FormData) => void
//   isAdmin: boolean
//   isPaid: boolean
//   isDelivered: boolean
//   orderId: string
//   paidAt: Date | null
//   isProcessingPayment: boolean
// }) => {
//   const MarkAsPaidButton = () => {
//     const [isPending, startTransition] = useTransition()

//     return (
//       <Button
//         type="button"
//         variant="outline"
//         disabled={isPending}
//         onClick={() =>
//           startTransition(async () => {
//             const res = await updateOrderToPaidCOD(orderId)
//             if (res.success) {
//               toast.success(
//                 typeof res?.message === 'string'
//                   ? res.message
//                   : 'عملیات با موفقیت انجام شد'
//               )
//             } else {
//               toast.error(
//                 typeof res?.message === 'string'
//                   ? res.message
//                   : 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!'
//               )
//             }
//           })
//         }
//       >
//         {isPending ? 'در حال انجام...' : 'تغییر به پرداخت شده'}
//       </Button>
//     )
//   }

//   const MarkAsDeliveredButton = () => {
//     const [isPending, startTransition] = useTransition()

//     return (
//       <Button
//         type="button"
//         variant="outline"
//         disabled={isPending}
//         onClick={() =>
//           startTransition(async () => {
//             const res = await deliverOrder(orderId)
//             if (res.success) {
//               toast.success(
//                 typeof res?.message === 'string'
//                   ? res.message
//                   : 'عملیات با موفقیت انجام شد'
//               )
//             } else {
//               toast.error(
//                 typeof res?.message === 'string'
//                   ? res.message
//                   : 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!'
//               )
//             }
//           })
//         }
//       >
//         {isPending ? 'در حال انجام...' : 'تغییر به تحویل داده شده'}
//       </Button>
//     )
//   }

//   return (
//     <Card>
//       <CardContent className="p-4 space-y-4">
//         <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>

//         <SummaryRow
//           label="سفارشها"
//           value={`${itemsPrice.toLocaleString('fa-IR')} تومان`}
//         />
//         <SummaryRow
//           label="هزینه ارسال"
//           value={`${shippingPrice.toLocaleString('fa-IR')} تومان`}
//         />

//         <hr className="my-4" />

//         <SummaryRow
//           label="مجموع"
//           value={`${totalPrice.toLocaleString('fa-IR')} تومان`}
//           isTotal
//         />

//         {isPaid && paidAt ? (
//           <Badge className="bg-green-500 hover:bg-green-600 w-full justify-center h-12">
//             پرداخت شده در {formatDateTime(paidAt).dateTime}
//           </Badge>
//         ) : isPaid ? (
//           <Badge className="bg-green-500 hover:bg-green-600 w-full justify-center h-12">
//             پرداخت شده
//           </Badge>
//         ) : isProcessingPayment ? (
//           <Badge className="bg-yellow-500 hover:bg-yellow-600 w-full justify-center h-12">
//             در حال تأیید پرداخت...
//           </Badge>
//         ) : (
//           <form action={zarinpalPaymentAction} className="space-y-2">
//             <Button
//               type="submit"
//               disabled={isPending || isProcessingPayment}
//               className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isPending ? 'در حال پردازش...' : 'پرداخت'}
//             </Button>
//           </form>
//         )}

//         {isAdmin && !isPaid && <MarkAsPaidButton />}
//         {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
//       </CardContent>
//     </Card>
//   )
// }

// const SummaryRow = ({
//   label,
//   value,
//   isTotal = false,
// }: {
//   label: string
//   value: string
//   isTotal?: boolean
// }) => (
//   <div className={`flex justify-between ${isTotal ? 'font-bold text-lg' : ''}`}>
//     <div>{label}</div>
//     <div>{value}</div>
//   </div>
// )

// export default OrderDetailsTable

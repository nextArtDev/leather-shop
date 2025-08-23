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
// import { useToast } from '@/hooks/use-toast'
// import {
//   useActionState,
//   useCallback,
//   useEffect,
//   useState,
//   useTransition,
// } from 'react'
// // import {
// //   PayPalButtons,
// //   PayPalScriptProvider,
// //   usePayPalScriptReducer,
// // } from '@paypal/react-paypal-js';
// // import {
// //   createPayPalOrder,
// //   approvePayPalOrder,
// //   updateOrderToPaidCOD,
// //   deliverOrder,
// // } from '@/lib/actions/order.actions'
// import { formatDateTime, formatId } from '@/app/(home)/lib/utils'
// import { formatCurrency } from '@/lib/utils'
// import { Order, OrderItem } from '@/lib/generated/prisma'
// import {
//   zarinpalPayment,
//   zarinpalPaymentApproval,
// } from '@/app/(home)/lib/actions/payment'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// const OrderDetailsTable = ({
//   order,
//   // paypalClientId,
//   isAdmin,
// }: // stripeClientSecret,
// {
//   order: Omit<Order & { orderitems: OrderItem[] }, 'paymentResult'>
//   // paypalClientId: string
//   isAdmin: boolean
//   // stripeClientSecret: string | null
// }) => {
//   const {
//     id,
//     shippingAddress,
//     orderitems,
//     itemsPrice,
//     shippingPrice,
//     taxPrice,
//     totalPrice,
//     // paymentMethod,
//     isDelivered,
//     isPaid,
//     paidAt,
//     deliveredAt,
//   } = order

//   const { toast } = useToast()
//   const path = usePathname()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const [zarinpalResponse, setZarinpalResponse] = useState({
//     Authority: '',
//     Status: '',
//   })

//   // const [errorMessage, setErrorMessage] = useState<string>()
//   // const [clientSecret, setClientSecret] = useState<string | null>(null)
//   // const [loading, setLoading] = useState<boolean>(false)

//   const verifyPayment = useCallback(async () => {
//     const verif = await zarinpalPaymentApproval(
//       path,
//       order.id,
//       zarinpalResponse.Authority,
//       zarinpalResponse.Status
//     )
//     console.log({ verif })
//     router.push(`/order/${order.id}&paid=OK`)
//   }, [path, order.id, zarinpalResponse.Authority, zarinpalResponse.Status])

//   useEffect(() => {
//     if (
//       searchParams?.get('Authority') &&
//       searchParams?.get('Status') &&
//       !searchParams?.get('paid')
//     ) {
//       setZarinpalResponse({
//         Authority: searchParams.get('Authority') as string,
//         Status: searchParams.get('Status') as string,
//       })
//       verifyPayment()
//     }
//   }, [searchParams, verifyPayment])

//   const [ActionState, zarinpalPaymentAction, pending] = useActionState(
//     zarinpalPayment.bind(null, path, order.id as string),
//     {
//       errors: {},
//       payment: {},
//     }
//   )
//   console.log({ ActionState })
//   useEffect(() => {
//     if (ActionState.payment?.url) {
//       router.push(ActionState.payment?.url)
//     }
//   }, [ActionState.payment?.url, router])
//   const PrintLoadingState = () => {
//     // const [{ isPending, isRejected }] = usePayPalScriptReducer()
//     // let status = ''
//     // if (isPending) {
//     //   status = 'Loading PayPal...'
//     // } else if (isRejected) {
//     //   status = 'Error Loading PayPal'
//     // }
//     // return status
//   }

//   const handleCreatePayPalOrder = async () => {
//     // const res = await createPayPalOrder(order.id)
//     // if (!res.success) {
//     //   toast({
//     //     variant: 'destructive',
//     //     description: res.message,
//     //   })
//     // }
//     // return res.data
//   }

//   const handleApprovePayPalOrder = async (data: { orderID: string }) => {
//     // const res = await approvePayPalOrder(order.id, data)
//     // toast({
//     //   variant: res.success ? 'default' : 'destructive',
//     //   description: res.message,
//     // })
//   }

//   // Button to mark order as paid
//   const MarkAsPaidButton = () => {
//     const [isPending, startTransition] = useTransition()
//     const { toast } = useToast()

//     return (
//       <Button
//         type="button"
//         disabled={isPending}
//         onClick={() =>
//           startTransition(async () => {
//             // const res = await updateOrderToPaidCOD(order.id)
//             // toast({
//             //   variant: res.success ? 'default' : 'destructive',
//             //   description: res.message,
//             // })
//           })
//         }
//       >
//         {isPending ? 'processing...' : 'Mark As Paid'}
//       </Button>
//     )
//   }

//   // Button to mark order as delivered
//   const MarkAsDeliveredButton = () => {
//     const [isPending, startTransition] = useTransition()
//     const { toast } = useToast()

//     return (
//       <Button
//         type="button"
//         disabled={isPending}
//         onClick={() =>
//           startTransition(async () => {
//             // const res = await deliverOrder(order.id)
//             // toast({
//             //   variant: res.success ? 'default' : 'destructive',
//             //   description: res.message,
//             // })
//           })
//         }
//       >
//         {isPending ? 'processing...' : 'Mark As Delivered'}
//       </Button>
//     )
//   }

//   return (
//     <>
//       <h1 className="py-4 text-2xl">سفارش {formatId(id)}</h1>
//       <div className="grid md:grid-cols-3 md:gap-5">
//         <div className="col-span-2 space-4-y overflow-x-auto">
//           <Card>
//             <CardContent className="p-4 gap-4">
//               {/* <h2 className="text-xl pb-4">نحوه پرداخت</h2> */}
//               {/* <p className="mb-2">{paymentMethod}</p> */}
//               {isPaid ? (
//                 <Badge variant="secondary">
//                   پرداخت در {formatDateTime(paidAt!).dateTime}
//                 </Badge>
//               ) : (
//                 <Badge variant="destructive">پرداخت نشده</Badge>
//               )}
//             </CardContent>
//           </Card>
//           <Card className="my-2">
//             <CardContent className="p-4 gap-4">
//               <h2 className="text-xl pb-4">آدرس ارسال</h2>
//               <p>{shippingAddress?.fullName}</p>
//               <p className="mb-2">
//                 {shippingAddress?.location[0]}
//                 {'، '} {shippingAddress?.location[1]}
//                 {'، '}
//                 {shippingAddress?.streetAddress}
//                 {'، '}
//                 {shippingAddress?.postalCode}
//               </p>
//               {isDelivered ? (
//                 <Badge variant="secondary">
//                   تحویل شده در {formatDateTime(deliveredAt!).dateTime}
//                 </Badge>
//               ) : (
//                 <Badge variant="destructive">تحویل نشده</Badge>
//               )}
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 gap-4">
//               <h2 className="text-xl pb-4">سفارشها</h2>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>سفارش</TableHead>
//                     <TableHead>تعداد</TableHead>
//                     <TableHead>هزینه</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {orderitems.map((item) => (
//                     <TableRow key={item.slug}>
//                       <TableCell>
//                         <Link
//                           href={`/product/{item.slug}`}
//                           className="flex items-center"
//                         >
//                           <Image
//                             src={item.image}
//                             alt={item.name}
//                             width={50}
//                             height={50}
//                           />
//                           <span className="px-2">{item.name}</span>
//                         </Link>
//                       </TableCell>
//                       <TableCell>
//                         <span className="px-2">{item.qty}</span>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         ${item.price.toString()}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//         <div>
//           <Card>
//             <CardContent className="p-4 gap-4 space-y-4">
//               <div className="flex justify-between">
//                 <div>سفارشها</div>
//                 <div>{itemsPrice.toString()}</div>
//               </div>
//               <div className="flex justify-between">
//                 <div>مالیات</div>
//                 <div>{taxPrice.toString()}</div>
//               </div>
//               <div className="flex justify-between">
//                 <div>هزینه ارسال</div>
//                 <div>{shippingPrice.toString()}</div>
//               </div>
//               <div className="flex justify-between">
//                 <div>مجموع</div>
//                 <div>{totalPrice.toString()}</div>
//               </div>

//               {/* PayPal Payment */}
//               {/* {!isPaid && paymentMethod === 'PayPal' && (
//                 <div>
//                   <PayPalScriptProvider options={{ clientId: paypalClientId }}>
//                     <PrintLoadingState />
//                     <PayPalButtons
//                       createOrder={handleCreatePayPalOrder}
//                       onApprove={handleApprovePayPalOrder}
//                     />
//                   </PayPalScriptProvider>
//                 </div>
//               )} */}

//               {/* Stripe Payment */}
//               {/* {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
//                 <StripePayment
//                   priceInCents={Number(order.totalPrice) * 100}
//                   orderId={order.id}
//                   clientSecret={stripeClientSecret}
//                 />
//               )} */}
//               {zarinpalResponse.Status === 'OK' ||
//               searchParams?.get('paid') === 'OK' ? (
//                 <Badge className="bg-indigo-500 w-full h-12">Paid </Badge>
//               ) : (
//                 <form
//                   action={zarinpalPaymentAction}
//                   className="bg-white p-2 rounded-md"
//                 >
//                   {/* {clientSecret && <PaymentElement />} */}
//                   {/* {errorMessage && (
//         <div className="tetx-sm text-red-500">{errorMessage}</div>
//       )} */}
//                   <button
//                     disabled={pending}
//                     className="cursor-pointer text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
//                   >
//                     {pending ? 'Processing' : 'Pay'}
//                   </button>
//                 </form>
//               )}

//               {/* Cash On Delivery */}
//               {isAdmin && !isPaid && <MarkAsPaidButton />}
//               {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </>
//   )
// }

// export default OrderDetailsTable

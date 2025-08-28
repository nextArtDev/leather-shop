'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  useRef,
} from 'react'

import { Order, OrderItem, ShippingAddress } from '@/lib/generated/prisma'
// import {
//   zarinpalPayment,
//   zarinpalPaymentApproval,
// } from '@/app/(home)/lib/actions/payment'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
// import {
//   deliverOrder,
//   updateOrderToPaidCOD,
// } from '@/lib/actions/admin/order.actions'
import { toast } from 'sonner'
import {
  zarinpalPayment,
  zarinpalPaymentApproval,
} from '@/lib/home/actions/payment1'
import { deliverOrder, updateOrderToPaidCOD } from '@/lib/home/actions/order'
import { formatDateTime, formatId } from '@/lib/utils'

// Types
interface ZarinpalResponse {
  Authority: string
  Status: string
}

interface OrderDetailsTableProps {
  order: Order & { items: OrderItem[] } & {
    shippingAddress: ShippingAddress & { province: { name: string } } & {
      city: { name: string }
    }
  } & { user: { name: string; phoneNumber: string } }
  isAdmin: boolean
}

// Helper function to safely parse date
const parseDate = (date: Date | string | null): Date | null => {
  if (!date) return null
  if (date instanceof Date) return date
  if (typeof date === 'string') return new Date(date)
  return null
}

// Constants
const PAYMENT_STATUS = {
  OK: 'OK',
  NOK: 'NOK',
} as const

const OrderDetailsTable = ({ order, isAdmin }: OrderDetailsTableProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Use ref to track the current order ID and prevent stale closures
  const currentOrderIdRef = useRef(order.id)
  const paymentProcessedRef = useRef<Set<string>>(new Set())

  // Always use the prop data directly - don't maintain local state
  // const {
  //   id,
  //   shippingAddress,
  //   orderitems,
  //   itemsPrice,
  //   shippingPrice,
  //   taxPrice,
  //   totalPrice,
  //   isDelivered,
  //   isPaid,
  //   paidAt: rawPaidAt,
  //   deliveredAt: rawDeliveredAt,
  // } = order

  const id = order.id
  const shippingAddress = order.shippingAddress
  const orderitems = order.items
  const itemsPrice = order.subTotal
  const shippingPrice = order.shippingFees
  // const taxPrice= order
  const totalPrice = order.total
  const isDelivered = order.orderStatus === 'Delivered'
  const isPaid = order.paymentStatus === 'Paid'
  const rawPaidAt = order.updatedAt
  // const deliveredAt= order.orderStatus.
  // } = order

  // Safely parse dates
  const paidAt = parseDate(rawPaidAt)
  // const deliveredAt = parseDate(deliveredAt)

  // State for payment callback handling - RESET when order changes
  const [zarinpalResponse, setZarinpalResponse] = useState<ZarinpalResponse>({
    Authority: '',
    Status: '',
  })

  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // CRITICAL: Reset ALL payment-related state when order ID changes
  useEffect(() => {
    // Only reset if the order ID actually changed
    if (currentOrderIdRef.current !== id) {
      currentOrderIdRef.current = id

      // Reset all payment-related state
      setZarinpalResponse({
        Authority: '',
        Status: '',
      })
      setIsProcessingPayment(false)

      // Clear URL parameters immediately when switching orders
      const hasPaymentParams =
        searchParams?.get('Authority') || searchParams?.get('Status')
      if (hasPaymentParams) {
        router.replace(pathname, { scroll: false })
      }
    }
  }, [id, pathname, router, searchParams])

  // Debug logging

  // Payment action state
  const [actionState, zarinpalPaymentAction, isPending] = useActionState(
    zarinpalPayment.bind(null, pathname, id),
    {
      errors: {},
      payment: {},
    }
  )

  // Memoized values - FORCE recalculation based on actual database state
  const isPaymentSuccessful = useMemo(() => {
    // Only consider callback successful if:
    // 1. It's for the current order
    // 2. The order isn't already paid in the database
    // 3. We have valid callback data
    const hasValidCallback =
      zarinpalResponse.Status === PAYMENT_STATUS.OK &&
      zarinpalResponse.Authority &&
      !isPaid && // Only show as successful if not already paid in DB
      currentOrderIdRef.current === id // Ensure it's for the current order

    // Database state takes precedence
    return isPaid || (hasValidCallback && isProcessingPayment)
  }, [
    isPaid,
    zarinpalResponse.Status,
    zarinpalResponse.Authority,
    isProcessingPayment,
    id,
  ])

  const formattedShippingAddress = useMemo(() => {
    if (!shippingAddress) return ''
    return `${shippingAddress.province.name}، ${shippingAddress.city.name}، ${shippingAddress.address1}، ${shippingAddress.zip_code}`
  }, [shippingAddress])

  // Refetch order data to ensure we have the latest state
  const refetchOrder = useCallback(async () => {
    try {
      console.log('Refetching order data for:', id)
      router.refresh()
    } catch (error) {
      console.error('Failed to refetch order:', error)
    }
  }, [router, id])

  // Payment verification callback
  const verifyPayment = useCallback(async () => {
    // Ensure we're working with the current order
    if (currentOrderIdRef.current !== id) {
      return
    }

    if (!zarinpalResponse.Authority || !zarinpalResponse.Status) {
      return
    }

    // Prevent duplicate processing
    const paymentKey = `${id}-${zarinpalResponse.Authority}`
    if (paymentProcessedRef.current.has(paymentKey)) {
      return
    }

    // Skip if already paid
    if (isPaid) {
      return
    }

    paymentProcessedRef.current.add(paymentKey)
    setIsProcessingPayment(true)

    try {
      const result = await zarinpalPaymentApproval(
        pathname,
        id,
        zarinpalResponse.Authority,
        zarinpalResponse.Status
      )

      if (result?.errors?._form) {
        toast(result.errors._form[0])
      } else if (result?.success) {
        if (result.alreadyPaid) {
          toast('سفارش قبلاً پرداخت شده بود')
        } else {
          toast.success('پرداخت با موفقیت انجام شد', {
            position: 'top-center',
          })
        }

        // Clean up URL parameters and refresh data
        router.replace(pathname, { scroll: false })

        // Wait a bit then refresh to get updated data
        setTimeout(() => {
          refetchOrder()
        }, 1000)
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      toast.error('خطا در تأیید پرداخت')
      // Remove from processed set on error to allow retry
      paymentProcessedRef.current.delete(paymentKey)
    } finally {
      setIsProcessingPayment(false)
    }
  }, [
    pathname,
    id,
    zarinpalResponse.Authority,
    zarinpalResponse.Status,
    router,
    refetchOrder,
    isPaid,
  ])

  // Handle URL parameters for payment callback - ONLY for current order
  useEffect(() => {
    const authority = searchParams?.get('Authority')
    const status = searchParams?.get('Status')

    // Only process if:
    // 1. We have both authority and status
    // 2. This is for the current order
    // 3. We don't already have response data
    // 4. Order is not already paid
    if (
      authority &&
      status &&
      currentOrderIdRef.current === id &&
      !zarinpalResponse.Authority &&
      !zarinpalResponse.Status &&
      !isPaid
    ) {
      setZarinpalResponse({
        Authority: authority,
        Status: status,
      })
    } else if (authority && status && isPaid) {
      // If order is already paid, clean up URL immediately
      console.log('Order already paid, cleaning up URL parameters')
      router.replace(pathname, { scroll: false })
    }
  }, [
    searchParams,
    id,
    zarinpalResponse.Authority,
    zarinpalResponse.Status,
    isPaid,
    router,
    pathname,
  ])

  // Verify payment when response is set and it's for the current order
  useEffect(() => {
    if (
      zarinpalResponse.Authority &&
      zarinpalResponse.Status &&
      currentOrderIdRef.current === id &&
      !isPaid
    ) {
      verifyPayment()
    }
  }, [verifyPayment, zarinpalResponse, id, isPaid])

  // Handle payment URL redirect
  useEffect(() => {
    if (actionState.payment?.url && currentOrderIdRef.current === id) {
      router.push(actionState.payment.url)
    }
  }, [actionState.payment?.url, router, id])

  // Show error messages
  useEffect(() => {
    if (actionState.errors?._form) {
      toast.error(actionState.errors._form[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionState.errors, toast])

  return (
    <div key={`order-${id}`} className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">سفارش {formatId(id)}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4">
          {/* Payment Status Card */}
          <PaymentStatusCard isPaid={isPaid} paidAt={paidAt} />

          {/* Shipping Address Card */}
          <ShippingAddressCard
            shippingAddress={shippingAddress}
            formattedAddress={formattedShippingAddress}
            isDelivered={isDelivered}
            // deliveredAt={deliveredAt}
          />

          {/* Order Items Card */}
          <OrderItemsCard orderItems={orderitems} />
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <OrderSummaryCard
            itemsPrice={+itemsPrice}
            // taxPrice={+taxPrice}
            shippingPrice={+shippingPrice}
            totalPrice={+totalPrice}
            isPaymentSuccessful={!!isPaymentSuccessful}
            isPending={isPending}
            zarinpalPaymentAction={zarinpalPaymentAction}
            isAdmin={isAdmin}
            isPaid={isPaid}
            isDelivered={isDelivered}
            orderId={id}
            paidAt={paidAt}
            isProcessingPayment={isProcessingPayment}
          />
        </div>
      </div>
    </div>
  )
}

// Rest of the component code remains the same...
const PaymentStatusCard = ({
  isPaid,
  paidAt,
}: {
  isPaid: boolean
  paidAt: Date | null
}) => {
  // console.log('PaymentStatusCard:', {
  //   isPaid,
  //   paidAt,
  //   paidAtType: typeof paidAt,
  // })

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl mb-4">وضعیت پرداخت</h2>
        {isPaid ? (
          <Badge variant="secondary">
            {paidAt
              ? `پرداخت در ${formatDateTime(paidAt).dateTime}`
              : 'پرداخت شده'}
          </Badge>
        ) : (
          <Badge variant="destructive">پرداخت نشده</Badge>
        )}
      </CardContent>
    </Card>
  )
}

const ShippingAddressCard = ({
  shippingAddress,
  formattedAddress,
  isDelivered,
}: // deliveredAt,
{
  shippingAddress: ShippingAddress
  formattedAddress: string
  isDelivered: boolean
  // deliveredAt: Date | null
}) => (
  <Card>
    <CardContent className="p-4">
      <h2 className="text-xl mb-4">آدرس ارسال</h2>
      {shippingAddress && (
        <>
          <p className="mb-2 font-medium">{shippingAddress.name}</p>
          <p className="mb-4 text-gray-600">{formattedAddress}</p>
        </>
      )}
      {isDelivered ? (
        <Badge variant="secondary">
          {/* {deliveredAt
            ? `تحویل شده در ${formatDateTime(deliveredAt).dateTime}`
            : 'تحویل شده'} */}
        </Badge>
      ) : (
        <Badge variant="destructive">تحویل نشده</Badge>
      )}
    </CardContent>
  </Card>
)

const OrderItemsCard = ({ orderItems }: { orderItems: OrderItem[] }) => (
  <Card>
    <CardContent className="p-4">
      <h2 className="text-xl mb-4">سفارشها</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>سفارش</TableHead>
              <TableHead>تعداد</TableHead>
              <TableHead className="text-right">هزینه</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={`${item.productSlug}-${item.productId}`}>
                <TableCell>
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="flex items-center hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <span className="px-2 text-sm">{item.name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="px-2">{item.quantity}</span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
)

const OrderSummaryCard = ({
  itemsPrice,
  // taxPrice,
  shippingPrice,
  totalPrice,
  // isPaymentSuccessful,
  isPending,
  zarinpalPaymentAction,
  isAdmin,
  isPaid,
  isDelivered,
  orderId,
  paidAt,
  isProcessingPayment,
}: {
  itemsPrice: number
  // taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaymentSuccessful: boolean
  isPending: boolean
  zarinpalPaymentAction: (formData: FormData) => void
  isAdmin: boolean
  isPaid: boolean
  isDelivered: boolean
  orderId: string
  paidAt: Date | null
  isProcessingPayment: boolean
}) => {
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition()

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(orderId)
            if (res.success) {
              toast.success(
                typeof res?.message === 'string'
                  ? res.message
                  : 'عملیات با موفقیت انجام شد'
              )
            } else {
              toast.error(
                typeof res?.message === 'string'
                  ? res.message
                  : 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!'
              )
            }
          })
        }
      >
        {isPending ? 'در حال انجام...' : 'تغییر به پرداخت شده'}
      </Button>
    )
  }

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition()

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(orderId)
            if (res.success) {
              toast.success(
                typeof res?.message === 'string'
                  ? res.message
                  : 'عملیات با موفقیت انجام شد'
              )
            } else {
              toast.error(
                typeof res?.message === 'string'
                  ? res.message
                  : 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!'
              )
            }
          })
        }
      >
        {isPending ? 'در حال انجام...' : 'تغییر به تحویل داده شده'}
      </Button>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>

        <SummaryRow label="سفارشها" value={itemsPrice.toString()} />
        {/* <SummaryRow label="مالیات" value={taxPrice.toString()} /> */}
        <SummaryRow label="هزینه ارسال" value={shippingPrice.toString()} />

        <hr className="my-4" />

        <SummaryRow label="مجموع" value={totalPrice.toString()} isTotal />

        {isPaid && paidAt ? (
          <Badge className="bg-green-500 hover:bg-green-600 w-full justify-center h-12">
            پرداخت شده در {formatDateTime(paidAt).dateTime}
          </Badge>
        ) : isPaid ? (
          <Badge className="bg-green-500 hover:bg-green-600 w-full justify-center h-12">
            پرداخت شده
          </Badge>
        ) : isProcessingPayment ? (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 w-full justify-center h-12">
            در حال تأیید پرداخت...
          </Badge>
        ) : (
          <form action={zarinpalPaymentAction} className="space-y-2">
            <Button
              type="submit"
              disabled={isPending || isProcessingPayment}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'در حال پردازش...' : 'پرداخت'}
            </Button>
          </form>
        )}

        {isAdmin && !isPaid && <MarkAsPaidButton />}
        {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
      </CardContent>
    </Card>
  )
}

const SummaryRow = ({
  label,
  value,
  isTotal = false,
}: {
  label: string
  value: string
  isTotal?: boolean
}) => (
  <div className={`flex justify-between ${isTotal ? 'font-bold text-lg' : ''}`}>
    <div>{label}</div>
    <div>{value}</div>
  </div>
)

export default OrderDetailsTable

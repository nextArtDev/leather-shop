import { columns } from './components/columns'
import { Plus } from 'lucide-react'

import { notFound } from 'next/navigation'
import CouponDetails from './components/coupon-details'
import prisma from '@/lib/prisma'
import DataTable from '../../components/data-table'

export default async function SellerCouponsPage() {
  const coupons = await prisma.coupon.findMany()
  if (!coupons) return notFound()

  return (
    <section className="px-1">
      <DataTable
        actionButtonText={
          <>
            <Plus size={15} />
            ایجاد کوپن تخفیف
          </>
        }
        modalChildren={<CouponDetails />}
        newTabLink={`/dashboard/coupons/new`}
        filterValue="code"
        data={coupons}
        columns={columns}
        searchPlaceholder="جست‌وجوی کد کوپن..."
      />
    </section>
  )
}

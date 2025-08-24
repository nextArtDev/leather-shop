import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// import { getOrderSummary } from '@/lib/actions/order.actions';

import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react'
import { Metadata } from 'next'

// import Charts from './components/charts'
import { currentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

const AdminOverviewPage = async () => {
  const user = await currentUser()

  if (user?.role !== 'ADMIN') {
    throw new Error('User is not authorized')
  }
  // console.log(user)

  // const summary = await getOrderSummary()

  return (
    <div className="space-y-2 mx-2">
      <h1 className="h2-bold">دشبورد</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع فروش</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {summary.totalSales._sum.totalPrice?.toString() || 0} */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">اقلام فروش</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {formatNumber(summary.ordersCount)} */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">خریداران</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {formatNumber(summary.usersCount)} */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">محصولات</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {formatNumber(summary.productsCount)} */}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>خلاصه</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <Charts
              data={
                {
                  // salesData: summary.salesData,
                }
              }
            /> */}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>فروشهای اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>خریدار</TableHead>
                  <TableHead>تاریخ</TableHead>
                  <TableHead>مجموع</TableHead>
                  <TableHead>اقدام</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {summary.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.user?.name ? order.user.name : 'Deleted User'}
                    </TableCell>
                    <TableCell>
                     
                      {order.createdAt.toLocaleDateString('fa-IR', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{+order.totalPrice}</TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">جزئیات</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminOverviewPage

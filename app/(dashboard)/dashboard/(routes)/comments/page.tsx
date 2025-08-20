import { format } from 'date-fns-jalali'

import { Separator } from '@/components/ui/separator'

import { Columns, CommentColumn } from './components/columns'
import { DataTable } from './components/DataTable'
import { Heading } from './components/Heading'
import { getAllReviews } from '../../lib/queries'

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50
  //  id: string
  //  title: string
  //  description: string
  //  isVerifiedPurchase: boolean
  //  rating: number
  //  isFeatured: boolean
  //  isPending: boolean
  //  likes: number
  //  userId: string
  //  productId: string
  //  createdAt: Date
  //  updatedAt: Date
  const comments = await getAllReviews({ page, pageSize })

  const formattedComments: CommentColumn[] = comments!.review.map((item) => ({
    id: item.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    name: item.user?.name!,
    title: item.title,
    description: item.description,
    isPending: item.isPending,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`کامنت‌ها (${formattedComments?.length})`}
          description="کامنتها را مدیریت کنید."
        />

        <Separator />
        {comments?.review?.length && !!formattedComments && (
          <DataTable
            searchKey="comment"
            columns={Columns}
            data={formattedComments}
            pageNumber={page ? +page : 1}
            pageSize={pageSize}
            isNext={comments.isNext}
          />
        )}
        <Separator />
      </div>
    </div>
  )
}

export default page

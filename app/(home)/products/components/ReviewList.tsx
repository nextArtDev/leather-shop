import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Card,
} from '@/components/ui/card'
import { ProductReview } from '@/lib/types/home'

import { User, Calendar } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ReviewForm from './ReviewForm'
import { Review } from '@/lib/generated/prisma'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'

type Props = {
  reviews: ProductReview[]
  productId: string
  productSlug: string
  numReviews: number
  userId?: string | null
  userReview: Review | null
}

const ReviewList = ({
  reviews,
  productId,
  productSlug,
  numReviews,
  userReview,
  userId,
}: Props) => {
  return (
    <div>
      <div className="space-y-4">
        {reviews.length === 0 && <div>No reviews yet</div>}
        {userId ? (
          <ReviewForm
            userId={userId}
            productId={productId}
            initialData={userReview}
          />
        ) : (
          <div>
            لطفا
            <Link
              className="text-blue-700 px-2"
              href={`/sign-in?callbackUrl=/products/${productSlug}`}
            >
              وارد حساب خود شوید
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            // <Card key={review.id}>
            //   <CardHeader>
            //     <div className="flex-between">
            //       <CardTitle>{review.title}</CardTitle>
            //     </div>
            //     <CardDescription>{review.description}</CardDescription>
            //   </CardHeader>
            //   <CardContent>
            //     <div className="flex space-x-4 text-sm text-muted-foreground">
            //       {/* <Rating value={review.rating} /> */}
            //       <div className="flex items-center">
            //         <User className="mr-1 h-3 w-3" />
            //         {review.user ? review.user.name : 'User'}
            //       </div>
            //       <div className="flex items-center">
            //         <Calendar className="mr-1 h-3 w-3" />
            //         {/* {formatDateTime(review.createdAt).dateOnly} */}
            //       </div>
            //     </div>
            //   </CardContent>
            // </Card>
            <TestimonialCarousel key={review.id} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ReviewList

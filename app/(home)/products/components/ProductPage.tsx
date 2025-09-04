import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'

import ProductStatements from '@/components/product/product-detail/ProductStatemeents'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ProductColor,
  ProductDetails,
  ProductReview,
  ProductSize,
  RelatedProduct,
} from '@/lib/types/home'
import { FC } from 'react'
import ReviewList from './ReviewList'
import { Review } from '@/lib/generated/prisma'
import { SingleStarRating } from '@/components/home/testemonial/SingleStartRating'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import FAQItem from '../../faq/components/FAQItem'
import { Badge } from '@/components/ui/badge'
import RelatedProductCarousel from '@/components/product/related-products-carousel'
import Countdown from './count-down'
import ProductProperties from './ProductProperties'

type ProductPageProp = {
  data: NonNullable<ProductDetails>
  userId?: string | null
  reviews: ProductReview[]
  productAverageRating: { rating: number; count: number } | null
  userReview: Review | null
  sizeId: string
  relatedProducts: RelatedProduct[] | null
}
const ProductPage: FC<ProductPageProp> = ({
  data,
  reviews,
  productAverageRating,

  userId,
  userReview,
  sizeId,
  relatedProducts,
}) => {
  // console.log({ reviews, numReviews })
  const {
    description,
    sku,
    images,
    variantImages,
    sizes,
    colors,
    brand,
    // subCategory,
    id,
    name,
    slug,
    weight,
    shippingFeeMethod,
    questions,
    specs,
    keywords,
    isSale,
    saleEndDate,
    // rating,
    // sales,
    // views,
    // isFeatured,
    // createdAt,
    // updatedAt,
    // category,
    // offerTag,
    // freeShipping,
  } = data
  //   console.log(specs, name)
  // const pathname = usePathname()
  // const { replace, refresh } = useRouter()
  // const searchParams = useSearchParams()
  // const params = new URLSearchParams(searchParams)

  // let updatedSizeId = sizeId

  // useEffect(() => {
  //   params.set('sizeId', sizeId)
  //   replace(`${pathname}?${params.toString()}`, {
  //     scroll: false,
  //   })
  //   return () => refresh()
  // }, [sizeId])
  // updatedSizeId = searchParams.get('sizeId')
  const currentSize = sizes.find((s) => sizeId === s.id)

  return (
    <section className="pb-24 w-full h-full">
      <div className="max-w-2xl px-4 mx-auto  flex flex-col gap-4">
        <article className=" ">
          <ProductDetailCarousel images={[...images, ...variantImages]} />
        </article>

        {/* <ProductDetails /> */}
        <article className="grid grid-row-5 gap-4">
          <div className="flex gap-2">
            {productAverageRating && (
              <>
                <SingleStarRating rating={productAverageRating.rating} />
                {productAverageRating.rating}
                <p>{' از'}</p>
                {productAverageRating.count}
                <p>{' نظر'}</p>
              </>
            )}
          </div>
          <p className="text-sm font-semibold">{brand}</p>
          <p className="text-base font-bold">
            {/* medium handbag with double flap in grained leather */}
            {name}
          </p>

          <Separator />
          <article className="flex items-center justify-evenly">
            <div className="flex-1 flex flex-col gap-2 items-start">
              <p className="text-sm font-semibold">رنگ</p>
              <div className="flex gap-1">
                {colors.map((clr: ProductColor) => (
                  <Button
                    size={'icon'}
                    key={clr.id}
                    style={{ background: clr.name }}
                    className={`rounded-none size-8 cursor-pointer`}
                  />
                ))}
              </div>
            </div>
            <Separator orientation="vertical" className="self-center mx-2" />
            <div className="flex-1 flex flex-col gap-2 items-start">
              <p className="text-sm font-semibold">سایز</p>
              <ul className="flex flex-wrap gap-1">
                {sizes.map((size: ProductSize) => (
                  <li key={size.id}>
                    <Link
                      // href={`/products/${slug}/?sizeId=${size.id}`}
                      href={{
                        pathname: `/products/${slug}`,
                        query: { sizeId: `${size.id}` },
                      }}
                      replace
                      scroll={false}
                      className={cn(
                        'rounded-sm  cursor-pointer',
                        buttonVariants({
                          variant: size.id === sizeId ? 'default' : 'outline',
                        }),
                        size.quantity <= 0 &&
                          'opacity-50 cursor-not-allowed pointer-events-none'
                      )}
                    >
                      {size.size}
                      {size.quantity <= 0 && (
                        <span className="ml-1 text-xs text-red-500">
                          ناموجود
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </article>
        <Separator />
        <article>
          {isSale && saleEndDate && (
            <div className="mt-4 pb-2">
              <Countdown targetDate={saleEndDate} />
            </div>
          )}
        </article>
        <span className="text-green-600 flex gap-1 text-sm items-center">
          <span
            className={cn(
              'w-2 h-2 animate-pulse rounded-full',
              currentSize && currentSize.quantity > 0
                ? 'bg-green-600'
                : 'bg-red-600'
            )}
          ></span>
          {currentSize && currentSize.quantity > 0 ? 'موجود' : 'اتمام موجودی'}
          {/* Show remaining quantity */}
          {currentSize && currentSize.quantity > 0 && (
            <span className="text-xs text-gray-500">
              ({currentSize.quantity} عدد باقی مانده)
            </span>
          )}
        </span>
        <article className="sticky top-2">
          {!!sizes.length && currentSize && currentSize.quantity > 0 && (
            <AddToCardBtn
              sizeId={sizeId}
              weight={weight}
              size={currentSize.size}
              discount={currentSize.discount}
              price={currentSize.price}
              stockQuantity={currentSize.quantity}
              productId={id}
              slug={slug}
              name={name}
              qty={1}
              shippingFeeMethod={shippingFeeMethod}
              // stock={stock}
              image={images.map((image) => image.url)[0]}
            />
          )}
        </article>

        {currentSize && currentSize.quantity <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-600 font-medium">این سایز موجود نیست</p>
            <p className="text-sm text-red-500 mt-1">
              لطفاً سایز دیگری انتخاب کنید
            </p>
          </div>
        )}
        <Link
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'max-w-sm mx-auto '
          )}
          href={'/cart'}
        >
          سبد خرید
        </Link>
        <Separator />
        <article className="flex flex-col gap-6 items-start py-12">
          <div className="flex flex-col gap-4 justify-around">
            {/* <p className="text-sm">{name}</p> */}
            {description && (
              <div className="flex  gap-3">
                <p className="font-semibold ">توضیحات:</p>
                <p
                  dangerouslySetInnerHTML={{ __html: description }}
                  className="font-semibold  text-justify"
                />
              </div>
            )}
            {sku && (
              <p dir="ltr" className="text-xs">
                SKU:{sku}
              </p>
            )}

            {!!keywords && (
              <div className="flex gap-3">
                <h1 className="font-semibold ">کلمات کلیدی:</h1>
                {keywords.split(',').map((k, i) => (
                  <Badge key={i} variant={'outline'}>
                    #{k}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Separator />
          <div className="w-full h-full flex  flex-col gap-4  ">
            <h1 className="font-semibold">ویژگی‌ها و ابعاد:</h1>

            {currentSize && (
              <ProductProperties
                size={currentSize}
                weight={weight ? weight : undefined}
                specs={
                  !!specs.filter((s) => s.name.trim().length > 0).length
                    ? specs
                    : undefined
                }
              />
            )}
          </div>
        </article>
        <Separator />
        <ProductStatements />
        <Separator />
        {!!questions.filter((q) => q.question.trim().length > 0).length && (
          <div className="flex items-start w-full mx-auto max-w-2xl space-y-2">
            {questions.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                index={index}
                className="rounded-sm w-full"
              />
            ))}
          </div>
        )}
        <Separator />
        <ReviewList
          reviews={reviews}
          productId={id}
          userId={userId}
          productSlug={slug}
          // numReviews={numReviews}
          userReview={userReview}
        />

        <Separator />
      </div>
      <Separator />
      {!!relatedProducts?.length && (
        <section className="  flex gap-6 flex-col justify-center items-center py-8">
          <h2 className="font-bold text-2xl ">محصولات مرتبط</h2>
          <RelatedProductCarousel items={relatedProducts} />
        </section>
      )}
    </section>
  )
}

export default ProductPage

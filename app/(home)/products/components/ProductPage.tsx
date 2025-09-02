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
} from '@/lib/types/home'
import { FC } from 'react'
import ReviewList from './ReviewList'
import { Review } from '@/lib/generated/prisma'
import { SingleStarRating } from '@/components/home/testemonial/SingleStartRating'
// import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import FAQItem from '../../faq/components/FAQItem'

// const images = [
//   { id: '1', url: bag },
//   { id: '2', url: bag2 },
//   { id: '3', url: bag3 },
// ]
// const bestSellersItems = [
//   {
//     id: '1',
//     title: 'small handbag in grained leather',
//     imageSrc: '/images/bag.webp',
//     category: 'Juliette',
//     link: '/products',
//     price: 750,
//   },
//   {
//     id: '2',
//     title: 'medium handbag with double flap in grained leather',
//     imageSrc: '/images/bag-2.webp',
//     category: 'Emilie',
//     link: '/products',
//     price: 690,
//   },
//   {
//     id: '3',
//     title: 'Louise small tote bag in grained leather',
//     imageSrc: '/images/bag-3.webp',
//     category: 'Louise',
//     link: '/products',
//     price: 570,
//   },
//   {
//     id: '4',
//     title: 'medium-sized handbag in grained leather',
//     imageSrc: '/images/bag-4.webp',
//     category: 'Emilie',
//     link: '/products',
//     price: 580,
//   },
//   {
//     id: '5',
//     title: 'medium handbag in smooth leather and nubuck',
//     imageSrc: '/images/bag-5.webp',
//     category: 'Juliette',
//     link: '/products',
//     price: 670,
//   },
// ]
type ProductPageProp = {
  data: NonNullable<ProductDetails>
  userId?: string | null
  reviews: ProductReview[]
  productAverageRating: { rating: number; count: number } | null
  userReview: Review | null
  sizeId: string
}
const ProductPage: FC<ProductPageProp> = ({
  data,
  reviews,
  productAverageRating,

  userId,
  userReview,
  sizeId,
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
    subCategory,
    id,
    name,
    slug,
    weight,
    shippingFeeMethod,
    questions,
    specs,
    // keywords,
    // rating,
    // sales,
    // views,
    // isFeatured,
    // isSale,
    // saleEndDate,
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
        <ProductDetailCarousel images={[...images, ...variantImages]} />

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
          <p className="text-sm font-semibold">{subCategory.name}</p>
          <p className="text-base font-bold">
            {/* medium handbag with double flap in grained leather */}
            {brand}
          </p>

          <Separator />

          <p className="text-sm font-semibold">رنگها</p>
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
          <Separator />

          <p className="text-sm font-semibold">سایزها</p>
          <ul className="flex gap-1">
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
                    <span className="ml-1 text-xs text-red-500">ناموجود</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
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

        <article className="flex flex-col gap-6 items-start">
          <div className="flex flex-col gap-4 justify-around">
            {/* <p className="text-sm">{name}</p> */}
            <p
              dangerouslySetInnerHTML={{ __html: description }}
              className="font-bold line-clamp-2 text-justify"
            />

            <p dir="ltr" className="text-xs">
              SKU:{sku}
            </p>
          </div>

          <div className="w-full h-full flex  flex-wrap gap-2  items-start  ">
            {!!sizes.length && (
              <article className="mx-auto px-4 py-8 w-fit max-w-sm">
                <h1 className="text-xl font-bold w-full text-center">ابعاد</h1>
                <Separator className="my-1" />
                <div className=" my-2">
                  {sizes.map((size, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-32 gap-1 place-content-center place-items-center w-full h-full py-1"
                    >
                      <span className="col-span-10 place-self-right text-center  ">
                        <p className="font-semibold">عرض</p>
                        {size.width}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="col-span-1 h-2 place-self-right "
                      />
                      <span className="col-span-10 grid-flow-dense text-center">
                        <p className="font-semibold">ارتفاع</p>
                        {size.height}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="col-span-1 h-2 place-self-right "
                      />
                      <span className="col-span-10 grid-flow-dense text-center">
                        <p className="font-semibold">طول</p>
                        {size.length}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            )}
            {/* specs */}

            {!!specs.length && (
              <article className="mx-auto py-8 w-fit max-w-md">
                <h1 className="text-xl font-bold w-full text-center">
                  خصوصیات
                </h1>
                <Separator className="my-1" />
                <div className=" my-2">
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-21 gap-1 place-content-center place-items-center w-full h-full py-1"
                    >
                      <span className="col-span-10 place-self-right text-right font-semibold">
                        {spec.name}
                      </span>
                      <Separator
                        orientation="vertical"
                        className="col-span-1 h-2 place-self-right "
                      />
                      <span className="col-span-10 w-full min-w-[70px]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </div>
        </article>
        <ProductStatements />
        <ReviewList
          reviews={reviews}
          productId={id}
          userId={userId}
          productSlug={slug}
          // numReviews={numReviews}
          userReview={userReview}
        />
        <Separator />
        {!!questions.length && (
          <div className="mx-auto max-w-2xl space-y-2">
            {questions.map((faq, index) => (
              <FAQItem
                key={index}
                {...faq}
                index={index}
                className="rounded-sm"
              />
            ))}
          </div>
        )}
      </div>
      <section className="  flex gap-6 flex-col justify-center items-center py-8">
        <h2 className="font-bold text-2xl ">You may also like</h2>
        {/* <MainPageCarousel items={bestSellersItems} /> */}
      </section>
    </section>
  )
}

export default ProductPage

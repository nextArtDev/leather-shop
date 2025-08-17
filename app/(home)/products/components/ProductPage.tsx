import ProductDetailCarousel from '@/components/product/product-detail-carousel'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'

import ProductStatements from '@/components/product/product-detail/ProductStatemeents'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ProductColor, ProductDetails, ProductSize } from '@/lib/types/home'
import { FC } from 'react'

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
}
const ProductPage: FC<ProductPageProp> = ({ data }) => {
  const {
    description,
    sku,
    images,
    variantImages,
    sizes,
    colors,
    brand,
    subCategory,
    // specs,
    // id,
    // name,
    // slug,
    // rating,
    // sales,
    // numReviews,
    // shippingFeeMethod,
    // views,
    // isFeatured,
    // isSale,
    // saleEndDate,
    // keywords,
    // weight,
    // createdAt,
    // updatedAt,
    // questions,
    // reviews,
    // category,
    // offerTag,
    // freeShipping,
  } = data
  //   console.log(specs, name)

  return (
    <section className="pb-24 w-full h-full">
      <div className="max-w-2xl px-4 mx-auto  flex flex-col gap-4">
        <ProductDetailCarousel images={[...images, ...variantImages]} />
        {/* <ProductDetails /> */}
        <article className="grid grid-row-4 gap-4">
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
          <div className="flex gap-1">
            {sizes.map((size: ProductSize) => (
              <Button
                className="rounded-sm  cursor-pointer"
                variant={'outline'}
                key={size.id}
              >
                {size.size}
              </Button>
            ))}
          </div>
        </article>
        <AddToCardBtn />
        <span className="text-green-600 flex gap-1 text-sm items-center">
          <span className="w-2 h-2 animate-pulse rounded-full bg-green-600"></span>
          {sizes.map((s: ProductSize) => s.quantity)[0] > 1
            ? 'موجود'
            : 'اتمام موجودی'}
        </span>
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
          <div
            dir="lrt"
            className="flex flex-end flex-col gap-4 text-sm md:text-base"
          >
            <p className="font-semibold">Dimensions</p>
            {/* <article className="flex gap-4 justify-between">
              <span className="flex gap-2">
                <strong>Width</strong>{' '}
                {specs.map((spec: ProductSpec) => spec.value)[0].split('*')[0]}{' '}
                cm
              </span>
              <span className="flex gap-2">
                <strong>Height</strong>{' '}
                {specs.map((spec: ProductSpec) => spec.value)[0].split('*')[1]}{' '}
                cm
              </span>
              <span className="flex gap-2">
                {' '}
                <strong>Depth</strong>{' '}
                {specs.map((spec: ProductSpec) => spec.value)[0].split('*')[2]}{' '}
                cm
              </span>
            </article> */}
          </div>
        </article>
        <ProductStatements />
        <Separator />
      </div>
      <section className="  flex gap-6 flex-col justify-center items-center py-8">
        <h2 className="font-bold text-2xl ">You may also like</h2>
        {/* <MainPageCarousel items={bestSellersItems} /> */}
      </section>
    </section>
  )
}

export default ProductPage

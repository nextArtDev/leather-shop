import Link from 'next/link'
// import {
//   getAllCategories,
//   getAllProducts,
// } from '../../lib/actions/product.actions'
import { Button, buttonVariants } from '@/components/ui/button'
// import ProductCard from '../../components/shared/product/product-card'
import ProductFilterPage from './components/CategoryFilters'
import { getAllCategories } from '@/app/(dashboard)/dashboard/lib/queries'
import { searchProducts } from '@/lib/home/queries/products'
import ProductCard from '@/components/product/product-card'

export interface FilterOption {
  value: string
  label: string
}

export interface FilterCategory {
  id: 'category' | 'price' | 'rating'
  name: string
  options: FilterOption[]
  selectionType?: 'single' | 'multiple'
}

export const filterData: FilterCategory[] = [
  {
    id: 'price',
    name: 'قیمت',
    selectionType: 'single',
    options: [
      {
        label: '100 - 1000',
        value: '100000-1000000',
      },
      {
        label: '1000 - 5000',
        value: '1000001-5000000',
      },
      {
        label: '5000 - 10000',
        value: '5000001-10000000',
      },
      {
        label: '10000 - 20000',
        value: '10000001-20000000',
      },
      {
        label: '20000 - 50000',
        value: '20000001-50000000',
      },
    ],
  },
  {
    id: 'rating',
    name: 'امتیاز',
    selectionType: 'single',
    options: [
      { value: '4', label: '4' },
      { value: '3', label: '3' },
      { value: '2', label: '2' },
      { value: '1', label: '1' },
    ],
  },
  // {
  //   id: 'category',
  //   name: 'دسته‌بندی',
  //   options: [
  //     { value: 'all-new-arrivals', label: 'All New Arrivals' },
  //     { value: 'tees', label: 'Tees' },
  //     { value: 'objects', label: 'Objects' },
  //     { value: 'sweatshirts', label: 'Sweatshirts' },
  //     { value: 'pants-and-shorts', label: 'Pants & Shorts' },
  //   ],
  // },
]
const prices = [
  {
    name: '100 - 1000',
    value: '100000-1000000',
  },
  {
    name: '1000 - 5000',
    value: '1000001-5000000',
  },
  {
    name: '5000 - 10000',
    value: '5000001-10000000',
  },
  {
    name: '10000 - 20000',
    value: '10000001-20000000',
  },
  {
    name: '20000 - 50000',
    value: '20000001-50000000',
  },
]

const ratings = [4, 3, 2, 1]

const sortOrders = [
  { name: 'جدیدترین', value: 'newest' },
  { name: 'قدمی‌ترین', value: 'oldest' },
  { name: 'ارزانترین', value: 'price_asc' },
  { name: 'گرانترین', value: 'price_desc' },
  { name: 'امتیاز', value: 'rating' },
]

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    price: string
    rating: string
  }>
}) {
  const {
    q = '',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams

  const isQuerySet = q && q !== '' && q.trim() !== ''
  const isCategorySet = category && category !== 'all' && category.trim() !== ''
  const isPriceSet = price && price !== 'all' && price.trim() !== ''
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== ''

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: دسته ${category}` : ''}
      ${isPriceSet ? `: قیمت ${price}` : ''}
      ${isRatingSet ? `: امتیاز ${rating}` : ''}`,
    }
  } else {
    return {
      title: 'جست‌وجوی محصول',
    }
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string
    category?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}) => {
  const {
    q = '',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams

  // Construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string
    p?: string
    s?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }

    if (c) params.category = c
    if (p) params.price = p
    if (s) params.sort = s
    if (r) params.rating = r
    if (pg) params.page = pg

    return `/search?${new URLSearchParams(params).toString()}`
  }

  // const products = await getAllProducts({
  //   query: q,
  //   category,
  //   price,
  //   rating,
  //   sort,
  //   page: Number(page),
  // })
  const products = await searchProducts({
    search: q,
    // categoryId: category,
    minPrice: +price,
    // maxPrice: +price,
    //     colors,
    // sizes,
    sortBy: sort,
    // page: Number(page),
  })
  console.log('{ searchProducts }', products.products)
  const categories = await getAllCategories({})

  const categoryOptions: FilterOption[] = categories.categories.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  return (
    <section className="w-full flex flex-col">
      <ProductFilterPage
        sortOptions={sortOrders}
        products={products}
        filterData={[
          ...filterData, // Original static filters

          {
            id: 'category' as const,
            name: 'دسته‌بندی',
            selectionType: 'single',
            options: categoryOptions,
          },
        ]}
      />

      <div className="grid md:grid-cols-5 md:gap-5">
        <div className="filter-links">
          {/* Category Links */}
          <div className="text-xl mb-2 mt-3">دسته</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${buttonVariants({ variant: 'outline' })} ${
                    (category === 'all' || category === '') &&
                    `font-bold ${buttonVariants({ variant: 'destructive' })} `
                  }`}
                  href={getFilterUrl({ c: 'all' })}
                >
                  همه
                </Link>
              </li>
              {categories.categories?.map((x) => (
                <li key={x.name}>
                  <Link
                    className={`${buttonVariants({ variant: 'outline' })} ${
                      category === x.id &&
                      `font-bold ${buttonVariants({ variant: 'destructive' })} `
                    }`}
                    href={getFilterUrl({ c: x.url })}
                  >
                    {x.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Price Links */}
          <div className="text-xl mb-2 mt-8">قیمت</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${buttonVariants({ variant: 'outline' })} ${
                    price === 'all' &&
                    `font-bold ${buttonVariants({ variant: 'destructive' })} `
                  }`}
                  href={getFilterUrl({ p: 'all' })}
                >
                  همه
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    className={`${buttonVariants({ variant: 'outline' })} ${
                      price === p.value &&
                      `font-bold ${buttonVariants({ variant: 'destructive' })} `
                    }`}
                    href={getFilterUrl({ p: p.value })}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Rating Links */}
          <div className="text-xl mb-2 mt-8">امتیاز خریداران</div>
          <div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${buttonVariants({ variant: 'outline' })} ${
                    rating === 'all' &&
                    `font-bold ${buttonVariants({ variant: 'destructive' })} `
                  }`}
                  href={getFilterUrl({ r: 'all' })}
                >
                  همه
                </Link>
              </li>
              {ratings.map((r) => (
                <li key={r}>
                  <Link
                    className={`${buttonVariants({ variant: 'outline' })} ${
                      rating === r.toString() &&
                      `font-bold ${buttonVariants({ variant: 'destructive' })} `
                    }`}
                    href={getFilterUrl({ r: `${r}` })}
                  >
                    {`شروع & پایان ${r}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="md:col-span-4 space-y-4">
          <div className="flex-between flex-col md:flex-row my-4">
            <div className="flex items-center">
              {q !== 'all' && q !== '' && 'Query: ' + q}
              {category !== 'all' &&
                category !== '' &&
                'دسته‌بندی: ' + category}
              {price !== 'all' && ' قیمت: ' + price}
              {rating !== 'all' && ' امتیاز: ' + rating + ' از - تا'}
              &nbsp;
              {(q !== 'all' && q !== '') ||
              (category !== 'all' && category !== '') ||
              rating !== 'all' ||
              price !== 'all' ? (
                <Button variant={'link'} asChild>
                  <Link href="/search">حذف</Link>
                </Button>
              ) : null}
            </div>
            <div>
              مرتب شده با{' '}
              {sortOrders.map((s) => (
                <Link
                  key={s.value}
                  className={`${buttonVariants({ variant: 'outline' })} mx-2 ${
                    sort == s.value &&
                    `font-bold ${buttonVariants({ variant: 'destructive' })} `
                  }`}
                  href={getFilterUrl({ s: s.value })}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {products.products.length === 0 && <div>محصولی پیدا نشد!</div>}
            {products.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPage

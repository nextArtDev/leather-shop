// Base types for common structures
export type ProductImage = {
  id: string
  url: string
  key: string
}

export type BasicProductImage = {
  url: string
}

export type ProductSize = {
  id: string
  size: string
  price: number
  discount: number
  quantity: number
}

export type BasicProductSize = {
  price: number
  discount: number
}

export type ProductColor = {
  id: string
  name: string
}

export type BasicProductColor = {
  name: string
}

export type CategoryInfo = {
  id: string
  name: string
  url: string
}

export type SubCategoryInfo = {
  id: string
  name: string
  url: string
}

// 1. Homepage Products Type
export type HomepageProduct = {
  id: string
  name: string
  description: string
  slug: string
  rating: number
  isFeatured: boolean
  isSale: boolean
  saleEndDate: string | null
  images: BasicProductImage[]
  sizes: BasicProductSize[]
  category: CategoryInfo
  subCategory: SubCategoryInfo
}

export type HomepageProductsResult = HomepageProduct[]

// 2. Best Sellers Type
export type BestSellerProduct = {
  id: string
  name: string
  slug: string
  rating: number
  sales: number
  images: BasicProductImage[]
  sizes: BasicProductSize[]
}

export type BestSellersResult = BestSellerProduct[]

// 3. New Products Type
export type NewProduct = {
  id: string
  name: string
  slug: string
  rating: number
  images: BasicProductImage[]
  sizes: BasicProductSize[]
}

export type NewProductsResult = NewProduct[]

// 4. Categories with Stats Type
export type CategoryWithStats = {
  id: string
  name: string
  url: string
  featured: boolean
  images: BasicProductImage[]
  _count: {
    products: number
  }
  subCategories: {
    id: string
    name: string
    url: string
    _count: {
      products: number
    }
  }[]
}

export type SubCategoryForHomePage = {
  id: string
  name: string
  url: string
}
export type CategoriesWithStatsResult = CategoryWithStats[]

// 5. Search Products Types
export type SearchProduct = {
  id: string
  name: string
  slug: string
  brand: string
  rating: number
  numReviews: number
  sales: number
  isSale: boolean
  saleEndDate: string | null
  images: BasicProductImage[]
  sizes: ProductSize[]
  colors: BasicProductColor[]
  category: CategoryInfo
  subCategory: SubCategoryInfo
}

export type SearchPagination = {
  total: number
  pages: number
  current: number
  hasNext: boolean
  hasPrev: boolean
}

export type SearchProductsResult = {
  products: SearchProduct[]
  pagination: SearchPagination
}

// 6. Product Details Types
export type ProductSpec = {
  name: string
  value: string
}

export type ProductQuestion = {
  question: string
  answer: string
}

export type ProductReview = {
  id: string
  title: string
  description: string
  isVerifiedPurchase: boolean
  isFeatured: boolean
  isPending: boolean

  rating: number

  likes: number
  createdAt: Date
  user: {
    name: string | null
    // avatar: string | null
  }
  images: BasicProductImage[]
}

export type OfferTag = {
  name: string
  url: string
}

export type FreeShippingCity = {
  city: {
    id: number
    name: string
    // Add other city fields as needed
  }
}

export type FreeShipping = {
  id: string
  productId: string
  createdAt: Date
  updatedAt: Date
  eligibleCities: FreeShippingCity[]
}

export type ProductDetails = {
  id: string
  name: string
  description: string
  slug: string
  brand: string
  rating: number
  sales: number
  numReviews: number
  shippingFeeMethod: 'ITEM' | 'WEIGHT' | 'FIXED'
  views: number
  isFeatured: boolean
  isSale: boolean
  saleEndDate: string | null
  sku: string
  keywords: string
  weight: number | null
  categoryId: string
  subCategoryId: string
  offerTagId: string | null
  createdAt: Date
  updatedAt: Date
  images: ProductImage[]
  variantImages: ProductImage[]
  sizes: ProductSize[]
  colors: ProductColor[]
  specs: ProductSpec[]
  questions: ProductQuestion[]
  reviews: ProductReview[]
  category: CategoryInfo
  subCategory: SubCategoryInfo
  offerTag: OfferTag | null
  freeShipping: FreeShipping | null
} | null // null if product not found

// 7. Related Products Type
export type RelatedProduct = {
  id: string
  name: string
  slug: string
  rating: number
  images: BasicProductImage[]
  sizes: BasicProductSize[]
}

export type RelatedProductsResult = RelatedProduct[]

// 8. Filters Data Types
export type PriceRange = {
  min: number
  max: number
}

export type FiltersData = {
  priceRange: PriceRange
  colors: string[]
  sizes: string[]
  brands: string[]
}

// Additional utility types for components

// For product cards/listings
export type ProductCardProps = {
  product:
    | HomepageProduct
    | BestSellerProduct
    | NewProduct
    | SearchProduct
    | RelatedProduct
  showCategory?: boolean
  showBrand?: boolean
  showRating?: boolean
  showSales?: boolean
}

// For category components
export type CategoryCardProps = {
  category: CategoryWithStats
  showProductCount?: boolean
  showSubCategories?: boolean
}

// For search/filter components
export type SearchFiltersProps = {
  filtersData: FiltersData
  onFiltersChange: (filters: SearchFilters) => void
  currentFilters: SearchFilters
}

export type SearchFilters = {
  search?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'sales'
}

// For pagination component
export type PaginationProps = {
  pagination: SearchPagination
  onPageChange: (page: number) => void
}

// For product reviews component
export type ProductReviewsProps = {
  reviews: ProductReview[]
  productRating: number
  totalReviews: number
}

// For product specifications component
export type ProductSpecsProps = {
  specs: ProductSpec[]
}

// For product Q&A component
export type ProductQAProps = {
  questions: ProductQuestion[]
}

// Example usage in components:

// Homepage component props
export type HomepageProps = {
  featuredProducts: HomepageProductsResult
  bestSellers: BestSellersResult
  newProducts: NewProductsResult
  categories: CategoriesWithStatsResult
}

// Search page component props
export type SearchPageProps = {
  searchResults: SearchProductsResult
  filtersData: FiltersData
  currentFilters: SearchFilters
}

// Product page component props
export type ProductPageProps = {
  product: ProductDetails
  relatedProducts: RelatedProductsResult
}

// Helper type for getting the actual return type from Prisma queries
// This is useful if you want to ensure type safety with actual Prisma return types
export type InferQueryResult<T> = T extends Promise<infer U> ? U : T

// Example of how to use with actual function:
// type ActualHomepageProductsType = InferQueryResult<ReturnType<typeof getHomepageProducts>>;

// Union types for different product contexts
export type AnyProductType =
  | HomepageProduct
  | BestSellerProduct
  | NewProduct
  | SearchProduct
  | RelatedProduct

// Generic product list props
export type ProductListProps<T extends AnyProductType> = {
  products: T[]
  title: string
  showViewAll?: boolean
  viewAllLink?: string
  loading?: boolean
  error?: string | null
}

//Cart
export type CartProductType = {
  productId: string
  slug: string
  name: string
  image: string
  sizeId: string
  size: string
  quantity: number
  price: number
  stock: number
  weight: number
  shippingMethod: string
  shippingFee: number
  extraShippingFee: number
}

// Payment
export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Processing = 'Processing',
  Shipped = 'Shipped',
  OutforDelivery = 'OutforDelivery',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
  Refunded = 'Refunded',
  Returned = 'Returned',
  OnHold = 'OnHold',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Failed = 'Failed',
  Declined = 'Declined',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded',
  Chargeback = 'Chargeback',
}

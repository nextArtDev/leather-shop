import { Prisma } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import {
  CategoryWithStats,
  ProductDetails,
  SearchFilters,
  SubCategoryForHomePage,
} from '@/lib/types/home'
import { redirect } from 'next/navigation'

// Homepage Products (with basic info + first image)
export async function getHomepageProducts(limit: number = 12) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      slug: true,
      rating: true,
      isFeatured: true,
      isSale: true,
      saleEndDate: true,
      updatedAt: true,
      // Get only the first image for performance
      images: {
        take: 1,
        select: {
          id: true,
          url: true,
          key: true,
        },
      },
      // Get minimum size info for price display
      sizes: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
    where: {
      // Add any filtering conditions
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 2. BEST SELLERS SECTION
export async function getBestSellers(limit: number = 8) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      sales: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      sizes: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    orderBy: {
      sales: 'desc',
    },
  })
}

// 3. NEW PRODUCTS SECTION
export async function getNewProducts(limit: number = 8) {
  return await prisma.product.findMany({
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      sizes: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// 4. CATEGORIES FOR NAVIGATION/HOMEPAGE
export async function getSubCategories(): Promise<SubCategoryForHomePage[]> {
  return await prisma.subCategory.findMany({
    where: { featured: true },
    // select: {
    //   id: true,
    //   name: true,
    //   url: true,

    // },
    include: {
      images: {
        select: {
          url: true,
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      updatedAt: true,
      featured: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      // Get product count for each category
      _count: {
        select: {
          products: true,
        },
      },
      subCategories: {
        select: {
          id: true,
          name: true,
          url: true,
          images: {
            select: { url: true },
            take: 1,
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
        take: 5,
        // orderBy:{

        // }
        // orderBy: {Prisma.sql`RANDOM()`}
      },
    },
    orderBy: {
      featured: 'desc',
    },
  })
  // for (const category of categories) {
  //   category.subCategories = shuffleArray(category.subCategories).slice(0, 5) // Get up to 5 random subcategories
  // }
  //return categories;
}

// 5. SEARCH/FILTER PAGE - More comprehensive
export async function searchProducts({
  search,
  categoryId,
  subCategoryId,
  minPrice,
  maxPrice,
  sortBy,
  page = 1,
  limit = 20,
  colors,
  sizes,
}: {
  search?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' | 'sales'
  page?: number
  limit?: number
  colors?: string[]
  sizes?: string[]
}) {
  const skip = (page - 1) * limit

  // Build where clause
  const where: Prisma.ProductWhereInput = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { brand: { contains: search } },
      { keywords: { contains: search } },
    ]
  }

  if (categoryId) where.categoryId = categoryId
  if (subCategoryId) where.subCategoryId = subCategoryId

  // Build conditions array for complex filtering
  const conditions: Prisma.ProductWhereInput[] = []

  // Price filtering
  if (minPrice || maxPrice) {
    conditions.push({
      sizes: {
        some: {
          price: {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          },
        },
      },
    })
  }

  // Size filtering
  if (sizes && sizes.length > 0) {
    conditions.push({
      sizes: {
        some: {
          size: {
            in: sizes,
          },
        },
      },
    })
  }

  // Color filtering
  if (colors && colors.length > 0) {
    conditions.push({
      colors: {
        some: {
          name: {
            in: colors,
          },
        },
      },
    })
  }

  // Apply all conditions
  if (conditions.length > 0) {
    if (conditions.length === 1) {
      // Single condition - merge directly
      Object.assign(where, conditions[0])
    } else {
      // Multiple conditions - use AND
      where.AND = conditions
    }
  }

  // Build orderBy for products
  let orderBy:
    | Prisma.ProductOrderByWithRelationInput
    | Prisma.ProductOrderByWithRelationInput[] = { createdAt: 'desc' }

  switch (sortBy) {
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'rating':
      orderBy = { rating: 'desc' }
      break
    case 'sales':
      orderBy = { sales: 'desc' }
      break
    case 'price_asc':
    case 'price_desc':
      // For price sorting, we'll handle it differently
      // We'll fetch products first, then sort them in JavaScript
      orderBy = { createdAt: 'desc' } // Default ordering, we'll sort after fetching
      break
    default:
      orderBy = { createdAt: 'desc' }
      break
  }

  // Order sizes within each product (always show lowest price first for display)
  const sizeOrderBy: Prisma.SizeOrderByWithRelationInput = { price: 'asc' }

  // For price sorting, we need to fetch more products and sort in JavaScript
  const isPriceSort = sortBy === 'price_asc' || sortBy === 'price_desc'
  const fetchSkip = isPriceSort ? 0 : skip // Don't skip if we're sorting by price

  const [allProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true, // You'll likely need this
        name: true,
        slug: true,
        brand: true,
        rating: true,
        numReviews: true,
        sales: true,
        isSale: true,
        saleEndDate: true,
        images: {
          select: {
            url: true,
          },
        },
        variantImages: {
          select: {
            url: true,
          },
        },
        sizes: {
          select: {
            size: true,
            price: true,
            discount: true,
            quantity: true,
          },
          orderBy: sizeOrderBy,
        },
        colors: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
            url: true,
          },
        },
        subCategory: {
          select: {
            name: true,
            url: true,
          },
        },
      },
      orderBy,
      skip: fetchSkip,
      take: isPriceSort ? undefined : limit, // Fetch all for price sorting
    }),
    prisma.product.count({ where }),
  ])

  let products = allProducts

  // Handle price sorting in JavaScript
  if (sortBy === 'price_asc' || sortBy === 'price_desc') {
    products = allProducts.sort((a, b) => {
      // Get minimum price for each product
      const minPriceA = Math.min(...a.sizes.map((size) => size.price))
      const minPriceB = Math.min(...b.sizes.map((size) => size.price))

      if (sortBy === 'price_asc') {
        return minPriceA - minPriceB
      } else {
        return minPriceB - minPriceA
      }
    })

    // Apply pagination after sorting
    products = products.slice(skip, skip + limit)
  }

  return {
    products,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      current: page,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  }
}

export async function updateSearchFilters(filters: Partial<SearchFilters>) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value.toString())
      }
    }
  })

  // Reset page when filters change
  params.set('page', '1')

  redirect(`/search?${params.toString()}`)
}
// 6. SINGLE PRODUCT PAGE - Full details
export async function getProductDetails(slug: string): Promise<ProductDetails> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        select: {
          // id: true,
          url: true,
          // key: true,
        },
      },
      variantImages: {
        select: {
          // id: true,
          url: true,
          // key: true,
        },
      },
      sizes: {
        select: {
          id: true,
          size: true,
          price: true,
          discount: true,
          quantity: true,
        },
        orderBy: {
          price: 'asc',
        },
      },
      colors: {
        select: {
          id: true,
          name: true,
        },
      },
      specs: {
        select: {
          name: true,
          value: true,
        },
      },
      questions: {
        select: {
          question: true,
          answer: true,
        },
      },
      reviews: {
        where: {
          isPending: false,
        },
        select: {
          id: true,
          isFeatured: true,
          isPending: true,
          isVerifiedPurchase: true,
          rating: true,
          title: true,
          description: true,

          likes: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              //   avatar: true,
            },
          },
          images: {
            select: {
              url: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      subCategory: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
      offerTag: {
        select: {
          name: true,
          url: true,
        },
      },
      freeShipping: {
        include: {
          eligibleCities: {
            include: {
              city: true,
            },
          },
        },
      },
    },
  })

  // Increment view count (do this async without blocking)
  if (product) {
    prisma.product
      .update({
        where: { id: product.id },
        data: { views: { increment: 1 } },
      })
      .catch(console.error)
  }

  return product
}

// 7. RELATED PRODUCTS
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 6
) {
  return await prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      rating: true,
      images: {
        take: 1,
        select: {
          url: true,
        },
      },
      sizes: {
        select: {
          price: true,
          discount: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 1,
      },
    },
    take: limit,
    orderBy: {
      rating: 'desc',
    },
  })
}

// 8. FILTERS DATA FOR SEARCH PAGE
export async function getFiltersData(
  categoryId?: string,
  subCategoryId?: string
) {
  const where: Prisma.ProductWhereInput = {}
  if (categoryId) where.categoryId = categoryId
  if (subCategoryId) where.subCategoryId = subCategoryId

  try {
    const [priceRange, colors, sizes, brands] = await Promise.all([
      // Get price range
      prisma.size.aggregate({
        where: {
          product: where,
        },
        _min: { price: true },
        _max: { price: true },
      }),
      // Get available colors
      prisma.color.findMany({
        where: {
          product: where,
        },
        select: {
          name: true,
        },
        distinct: ['name'],
      }),
      // Get available sizes
      prisma.size.findMany({
        where: {
          product: where,
          quantity: { gt: 0 },
        },
        select: {
          size: true,
        },
        distinct: ['size'],
      }),
      // Get brands
      prisma.product.findMany({
        where,
        select: {
          brand: true,
        },
        distinct: ['brand'],
      }),
    ])

    return {
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 1000000,
      },
      colors: colors.map((c) => c.name),
      sizes: sizes.map((s) => s.size),
      brands: brands.map((b) => b.brand),
    }
  } catch (error) {
    console.error('Error fetching filters data:', error)
    return {
      priceRange: { min: 0, max: 1000000 },
      colors: [],
      sizes: [],
      brands: [],
    }
  }
}

// export async function getAllProducts({
//   query,
//   limit = 10,
//   page,
//   category,
//   price,
//   rating,
//   sort,
// }: {
//   query: string
//   limit?: number
//   page: number
//   category?: string
//   price?: string
//   rating?: string
//   sort?: string
// }) {
//   // Query filter
//   const queryFilter: Prisma.ProductWhereInput =
//     query && query !== 'all'
//       ? {
//           name: {
//             contains: query,
//             // mode: 'insensitive',
//           } as Prisma.StringFilter,
//         }
//       : {}

//   // Category filter
//   const categoryFilter: Prisma.CategoryWhereInput =
//     category && category !== 'all'
//       ? {
//           category: {
//             contains: query,
//             // mode: 'insensitive',
//           } ,
//         }
//       : {}

//   // Price filter
//   const priceFilter: Prisma.SizeWhereInput =
//     price && price !== 'all'
//       ? {
//           price: {
//             gte: Number(price.split('-')[0]),
//             lte: Number(price.split('-')[1]),
//           },
//         }
//       : {}

//   // Rating filter
//   const ratingFilter =
//     rating && rating !== 'all'
//       ? {
//           rating: {
//             gte: Number(rating),
//           },
//         }
//       : {}

//   const data = await prisma.product.findMany({
//     where: {
//       ...queryFilter,
//       ...ratingFilter,
//     },
//     include: {
//       images: {
//         select: { url: true },
//       },
//       category: {
//         where: {
//           ...categoryFilter,
//         },
//       },
//       sizes: {
//         where: {
//           ...priceFilter,
//         },
//          orderBy:
//       sort === 'lowest'
//         ? { price: 'asc' }
//         :  { price: 'desc' }
//       },

//     },
//     orderBy:
//       // sort === 'lowest'
//       //   ? { price: 'asc' }
//       //   : sort === 'highest'
//       //   ? { price: 'desc' }:
//          sort === 'rating'
//         ? { rating: 'desc' }
//         : { createdAt: 'desc' },
//     skip: (page - 1) * limit,
//     take: limit,
//   })

//   const dataCount = await prisma.product.count()

//   return {
//     data,
//     totalPages: Math.ceil(dataCount / limit),
//   }
// }
export async function getAllCategories({}) {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      featured: true,
    },
    orderBy: {
      featured: 'desc',
    },
  })

  return {
    categories,
  }
}

export async function getSubCategoryBySlug({ slug }: { slug: string }) {
  return await prisma.subCategory.findFirst({
    where: {
      url: slug,
    },
    include: {
      images: {
        select: { url: true },
      },
      products: {
        select: {
          id: true, // You'll likely need this
          name: true,
          slug: true,
          brand: true,
          rating: true,
          numReviews: true,
          sales: true,
          isSale: true,
          saleEndDate: true,
          images: {
            select: {
              url: true,
            },
          },
          variantImages: {
            select: {
              url: true,
            },
          },
          sizes: {
            select: {
              size: true,
              price: true,
              discount: true,
              quantity: true,
            },
            orderBy: {
              discount: 'desc',
            },
          },
          colors: {
            select: {
              name: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },
  })
}

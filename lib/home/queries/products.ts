/* eslint-disable @typescript-eslint/no-explicit-any */
// 1. MAIN PAGE QUERIES - Fetch only what you display

import prisma from '@/lib/prisma'
import { CategoryWithStats, SubCategoryForHomePage } from '@/lib/types/home'

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
    select: {
      id: true,
      name: true,
      url: true,
    },
    orderBy: {
      featured: 'desc',
    },
  })
}
export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      url: true,
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
          _count: {
            select: {
              products: true,
            },
          },
        },
      },
    },
    orderBy: {
      featured: 'desc',
    },
  })
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
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { keywords: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (categoryId) where.categoryId = categoryId
  if (subCategoryId) where.subCategoryId = subCategoryId

  // Price filtering
  if (minPrice || maxPrice) {
    where.sizes = {
      some: {
        price: {
          ...(minPrice && { gte: minPrice }),
          ...(maxPrice && { lte: maxPrice }),
        },
      },
    }
  }

  // Color filtering
  if (colors && colors.length > 0) {
    where.colors = {
      some: {
        name: {
          in: colors,
        },
      },
    }
  }

  // Size filtering
  if (sizes && sizes.length > 0) {
    where.sizes = {
      some: {
        size: {
          in: sizes,
        },
      },
    }
  }

  // Build orderBy
  let orderBy: any = { createdAt: 'desc' }
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
    // Note: Price sorting is tricky with multiple sizes, handle separately
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        rating: true,
        numReviews: true,
        sales: true,
        isSale: true,
        saleEndDate: true,
        images: {
          take: 2, // Show primary + hover image
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
            price: 'asc',
          },
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
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

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

// 6. SINGLE PRODUCT PAGE - Full details
export async function getProductDetails(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        select: {
          id: true,
          url: true,
          key: true,
        },
      },
      variantImages: {
        select: {
          id: true,
          url: true,
          key: true,
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
          review: true,
          rating: true,
          variant: true,
          color: true,
          size: true,
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
  const where: any = {}
  if (categoryId) where.categoryId = categoryId
  if (subCategoryId) where.subCategoryId = subCategoryId

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
      max: priceRange._max.price || 1000,
    },
    colors: colors.map((c) => c.name),
    sizes: sizes.map((s) => s.size),
    brands: brands.map((b) => b.brand),
  }
}

import {
  Category,
  Color,
  FreeShipping,
  FreeShippingCity,
  Image,
  Product,
  Question,
  Size,
  Spec,
  SubCategory,
  Variant,
} from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { cache } from 'react'

export const getAllCategories = cache(
  async ({
    page = 1,
    pageSize = 100,
  }: {
    page?: number
    pageSize?: number
  }): Promise<{
    categories: (Category & { images: Image[] } & {
      subCategories: (SubCategory & { images: Image[] })[]
    })[]
    isNext: boolean
  }> => {
    const skipAmount = (page - 1) * pageSize
    const [categories, count] = await prisma.$transaction([
      prisma.category.findMany({
        where: {},

        include: {
          images: true,
          subCategories: {
            include: {
              images: true,
            },
          },
        },

        skip: skipAmount,
        take: pageSize,

        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.count({}),
    ])
    const isNext = count > skipAmount + categories.length
    return { categories, isNext }
  }
)

export const getCategoryById = cache(
  async (id: string): Promise<(Category & { images: Image[] }) | null> => {
    const category = await prisma.category.findFirst({
      where: {
        id,
      },
      include: {
        images: true,
      },
    })

    return category
  }
)

export const getAllSubCategories = cache(
  async ({
    page = 1,
    pageSize = 100,
  }: {
    page?: number
    pageSize?: number
  }): Promise<{
    subCategories: (SubCategory & { category: Category } & {
      images: Image[]
    })[]
    isNext: boolean
  }> => {
    const skipAmount = (page - 1) * pageSize
    const [subCategories, count] = await prisma.$transaction([
      prisma.subCategory.findMany({
        include: {
          images: true,
          category: true,
        },

        orderBy: {
          createdAt: 'desc',
        },

        skip: skipAmount,
        take: pageSize,
      }),
      prisma.category.count({}),
    ])
    const isNext = count > skipAmount + subCategories.length

    return { subCategories: subCategories, isNext }
  }
)

export const getSubCategoryById = async (
  id: string
): Promise<
  (SubCategory & { category: Category } & { images: Image[] }) | null
> => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      id,
    },
    include: {
      images: true,
      category: true,
    },
  })

  return subCategory
}

export const getCategoryList = cache(async (): Promise<Category[] | []> => {
  const categoryList = await prisma.category.findMany({})
  if (!categoryList.length) return []
  return categoryList
})

export const getAllProductsList = cache(async () => {
  try {
    // Retrieve all products associated with the store
    const products = await prisma.product.findMany({
      where: {},
      include: {
        category: true,
        subCategory: true,
        offerTag: true,
        images: { orderBy: { created_at: 'desc' } },
        variantImages: true,
        questions: true,
        specs: true,
        colors: true,
        sizes: true,
      },
    })
    // console.log({ products })
    return products
  } catch (error) {
    console.error(error)
  }
})

export const getAllOfferTags = cache(async () => {
  const offerTgas = await prisma.offerTag.findMany({
    where: {},
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      products: {
        _count: 'desc', // Order by the count of associated products in descending order
      },
    },
  })
  return offerTgas ?? []
})

export const getProductById = cache(
  (
    id: string
  ): Promise<
    | (Product & { images: Image[] | null } & { specs: Spec[] | null } & {
        questions: Question[] | null
      } & {
        variantImages: Image[] | null
        colors: Color[] | null
        sizes: Size[] | null
        specs: Spec[] | null
      })
    | null
  > => {
    const product = prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        variantImages: true,
        colors: true,
        sizes: true,
        specs: true,

        questions: true,
        images: true,
      },
    })

    return product
  }
)

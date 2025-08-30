import { getCategoriesWithStats } from '@/lib/home/queries/products'
import React from 'react'
import MainNav, { NavigationData } from './MainNav'

const Navbar = async () => {
  const allCategories = await getCategoriesWithStats()
  const navigation: NavigationData = {
    categories: allCategories.map((cat) => ({
      name: cat.name,
      featured: cat.subCategories.map((sub) => ({
        name: sub.name,
        href: `/sub-categories/${sub.url}`,
        imageSrc: sub.images[0]?.url || '', // Fallback if no image exists
        imageAlt: sub.name,
      })),
    })),
    pages: [
      { name: 'درباره ما', href: '#' },
      { name: 'ارتباط با ما', href: '#' },
    ],
  }
  //   console.log(navigation)
  return (
    <div>
      <MainNav navigation={navigation} />
    </div>
  )
}

export default Navbar

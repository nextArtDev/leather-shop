import { notFound } from 'next/navigation'
import React from 'react'
import { getSubCategoryBySlug } from '@/lib/home/queries/products'
import { Bounded } from '@/components/shared/Bounded'
import { FadeIn } from '@/components/shared/fade-in'
import Image from 'next/image'
import { RevealText } from '@/components/shared/reveal-text'
import Link from 'next/link'
import ProductGrid from '../../search/components/ProductGrid'

const SubcategoryDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  // const page = Number((await searchParams).page) || 1
  // const pageSize = 4

  const slug = (await params).slug

  const subcategory = await getSubCategoryBySlug({ slug })
  if (!subcategory) notFound()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <Bounded
        className={`relative w-full h-full  overflow-hidden bg-neutral-950 `}
      >
        <FadeIn
          vars={{ scale: 1, opacity: 0.5 }}
          className=" absolute inset-0 pt-12 max-h-svh origin-top lg:h-screen motion-safe:scale-125 motion-reduce:opacity-50 "
        >
          <Image
            src={subcategory.images.map((s) => s.url)[0]}
            priority
            fetchPriority="high"
            alt="hero image"
            fill
            className="object-cover origin-top "
          />
        </FadeIn>
        <div className="relative flex h-screen flex-col justify-center">
          <RevealText
            text={subcategory.name}
            id="hero-heading"
            className="font-display max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
            staggerAmount={0.2}
            duration={1.7}
          />
          {/* {subcategory.description&&  <FadeIn 
            className="mt-6 max-w-md translate-y-8  text-lg text-neutral-100"
            vars={{ delay: 1, duration: 1.3 }}
          >
            <p className=" ">
              {subcategory.description}
            </p>
          </FadeIn>} */}

          <FadeIn
            className="mt-8 translate-y-5"
            vars={{ delay: 1.7, duration: 1.1 }}
          >
            <Link
              href={`/categories/${subcategory.category.url}`}
              className=" w-fit inline-flex items-center justify-center px-12 py-4 text-center font-extrabold tracking-wider uppercase transition-colors duration-300  border border-white text-white hover:bg-white/20"
            >
              {subcategory.category.name}
            </Link>
          </FadeIn>
        </div>
      </Bounded>
      <div className="flex-1 w-full h-full">
        <ProductGrid products={subcategory.products} />
      </div>
    </div>
  )
}

export default SubcategoryDetailsPage

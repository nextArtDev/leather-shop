import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'
import Hero from '@/components/home/hero/hero'
import Commitments from '@/components/home/shared/Commitments'
import StoreStatement from '@/components/home/shared/StoreStatement'
import WorkVideo from '@/components/home/shared/WorkVideo'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import MainPageCarousel from '@/components/product/main-page-carousel'

import {
  getBestSellers,
  getCategoriesWithStats,
  getHomepageProducts,
  getHomePageReviews,
  getSubCategories,
} from '@/lib/home/queries/products'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  // Fetch data for dynamic meta information
  const [categories, reviews] = await Promise.all([
    getCategoriesWithStats(),
    getHomePageReviews(),
  ])

  const categoryNames = categories.map((cat) => cat.name).slice(0, 5)
  const avgRating = !!reviews?.length
    ? (
        reviews?.reduce((sum, review) => sum + review.rating, 0) /
        reviews?.length
      ).toFixed(1)
    : null

  const description = `Premium online store offering ${categoryNames.join(
    ', '
  )} and more. ${
    avgRating ? `Rated ${avgRating}/5 by ${reviews?.length} customers.` : ''
  } Fast shipping, quality products, and excellent customer service.`

  return {
    title: 'کارگاه چرم خارَک - چرم طبیعی دست‌ساز',
    description,
    keywords: [
      ...categoryNames.map((name) => name.toLowerCase()),
      'online store',
      'premium products',
      'fast shipping',
      'quality guarantee',
      'customer service',
      'best sellers',
      'new arrivals',
    ].join(', '),

    // Open Graph for social sharing
    openGraph: {
      type: 'website',
      title: 'کارگاه چرم خارَک - چرم طبیعی دست‌ساز',
      description,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'کارگاه چرم خارَک',
      images: [
        {
          url: '/hero-image.webp', // Your home page OG image
          width: 1200,
          height: 630,
          alt: 'کارگاه چرم خارَک - چرم طبیعی دست‌ساز',
        },
      ],
      locale: 'en_US',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'کارگاه چرم خارَک - چرم طبیعی دست‌ساز',
      description,
      images: ['/twitter-home.jpg'],
      creator: '@yourstorehandle',
      site: '@yourstorehandle',
    },

    // Additional metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL,
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      // bing: process.env.BING_SITE_VERIFICATION,
    },

    // Additional tags
    other: {
      'theme-color': '#eceae8', // Your brand color
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'msapplication-TileColor': '#eceae8',
    },
  }
}
export default async function Home() {
  // const [products, bestSellers, categories, subCategories, reviews] =
  //   await Promise.all([
  //     getHomepageProducts(),
  //     getBestSellers(),
  //     getCategoriesWithStats(),
  //     getSubCategories(),
  //     getHomePageReviews(),
  //   ])
  const [products, bestSellers, subCategories, reviews] = await Promise.all([
    getHomepageProducts(),
    getBestSellers(),
    // getCategoriesWithStats(),
    getSubCategories(),
    getHomePageReviews(),
  ])

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'کارگاه چرم خارَک',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description:
      'Premium online store offering quality products with fast shipping and excellent customer service',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567', // Your phone number
      contactType: 'Customer Service',
      email: 'support@yourstore.com', // Your email
      availableLanguage: ['English', 'Persian'],
    },
    sameAs: [
      'https://facebook.com/yourstore', // Your social media links
      'https://instagram.com/yourstore',
      'https://twitter.com/yourstore',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US', // Your country
      addressLocality: 'Your City',
      addressRegion: 'Your State',
      postalCode: '12345',
      streetAddress: 'Your Address',
    },
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'کارگاه چرم خارَک',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Reviews aggregate rating
  const reviewsData = !!reviews?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        itemReviewed: {
          '@type': 'Organization',
          name: 'کارگاه چرم خارَک',
          url: process.env.NEXT_PUBLIC_SITE_URL,
        },
        ratingValue: (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      }
    : null

  // Best sellers collection
  const bestSellersData =
    bestSellers && bestSellers.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Best Sellers',
          description: 'Our most popular products',
          numberOfItems: bestSellers.length,
          itemListElement: bestSellers.slice(0, 10).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: product.description,
              image: product.images?.[0]?.url,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
              ...(product.sizes.map((s) => s.price) && {
                offers: {
                  '@type': 'Offer',
                  price: product.sizes.map((s) => s.price)[0],
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                },
              }),
            },
          })),
        }
      : null

  // New arrivals collection
  const newArrivalsData =
    products && products.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'New Arrivals',
          description: 'Latest products in our collection',
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: product.description,
              image: product.images?.[0]?.url,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
              ...(product.sizes.map((s) => s.price) && {
                offers: {
                  '@type': 'Offer',
                  price: product.sizes.map((s) => s.price)[0],
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                },
              }),
            },
          })),
        }
      : null

  // Breadcrumb for home page
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL,
      },
    ],
  }
  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      {reviewsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewsData),
          }}
        />
      )}
      {bestSellersData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(bestSellersData),
          }}
        />
      )}
      {newArrivalsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(newArrivalsData),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <Hero subCategories={subCategories} />
      <div className="py-16">
        <StoreStatement />
      </div>
      {!!bestSellers && (
        <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
          <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
            پرفروش‌ترینها
          </h2>
          <MainPageCarousel items={bestSellers} />
        </section>
      )}
      <section className="w-full h-full flex flex-col gap-8 py-8 px-3 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8">
          جدیدترینها
        </h2>
        <MainPageCarousel items={products} />
      </section>
      <section className="py-12">
        <WorkVideo />
      </section>
      <section className="flex flex-col items-center gap-6 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center  py-8">
          تعهدات ما
        </h2>
        <Commitments />
      </section>
      <section className="flex flex-col w-full h-full gap-6  text-center py-12 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8  ">
          بیشتر{' '}
        </h2>
        <DiscoverMoreCarousel subCategories={subCategories} />
      </section>

      {!!reviews && (
        <TestimonialCarousel
          testimonials={reviews.map((review) => {
            const { title, description, user, createdAt, rating } = review
            return {
              title,
              description,
              user: user.name!,
              createdAt,
              rating,
            }
          })}
        />
      )}
    </div>
  )
}

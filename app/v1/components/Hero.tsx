import React from 'react'
import { Bounded } from '@/components/shared/Bounded'
import Image from 'next/image'
import heroImage from '../../../public/images/hero-image.jpg'
// import Link from 'next/link'
// import { RevealText } from '@/components/shared/reveal-text'

import { FadeIn } from '@/components/shared/fade-in'
import Link from 'next/link'

// const Hero = ({
//   subCategories,
// }: {
//   subCategories: SubCategoryForHomePage[]
// }) => {
const Hero = () => {
  return (
    <Bounded className={`relative  w-full h-full  overflow-hidden  `}>
      <FadeIn
        vars={{ scale: 1, opacity: 1 }}
        className=" absolute inset-0   origin-center lg:h-screen motion-safe:scale-125 motion-reduce:opacity-50 "
      >
        <Image
          src={heroImage}
          priority
          alt="hero image"
          fill
          className="object-cover origin-center "
        />
      </FadeIn>
      <div className="relative flex items-center h-screen flex-col justify-center ">
        {/* <RevealText
          text="Effortless Elegance"
          id="hero-heading"
          className="font-display max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
          staggerAmount={0.2}
          duration={1.7}
        /> */}
        <FadeIn
          // important factor to go up or down: translate-y-8
          className="mt-6 max-w-md translate-y-8  text-lg text-neutral-300"
          vars={{ delay: 1, duration: 1.3 }}
        >
          <p className="text-center  ">
            An expression of quiet luxury, Côte Royale is designed for the man
            who commands attention without seeking it. A reflection of nature’s
            raw beauty.
          </p>
        </FadeIn>

        <Link
          href={'/products'}
          className="z-30 h-16 mt-0 w-fit inline-flex items-center justify-center px-2 md:px-12  text-center font-extrabold tracking-wider uppercase transition-colors duration-300  border border-white text-white text-4xl hover:bg-white/20 overflow-hidden"
        >
          <FadeIn
            className=" translate-y-5"
            vars={{ delay: 1.7, duration: 1.1 }}
          >
            محصولات
          </FadeIn>
        </Link>
        {/* <FadeIn
          className="mt-8 translate-y-5"
          vars={{ delay: 2, duration: 1.1 }}
        >
          <article className="mt-12  text-secondary flex flex-wrap items-center justify-center">
            <ul className=" flex items-center justify-center w-full h-full  flex-wrap max-w-[70vw] mx-auto gap-x-2 md:gap-x-4">
              {subCategories?.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={sub.url}
                    className="bg-gradient-to-b from-background/5 to-background/30 backdrop-blur-[2px] border border-background rounded-none  px-2 py-1 text-center  "
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </FadeIn> */}
      </div>
    </Bounded>
  )
}

export default Hero

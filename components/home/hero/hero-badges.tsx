import Link from 'next/link'
import React from 'react'

const HeroLinks = () => {
  return (
    <section className="absolute w-full h-1/6 bottom-0 left-0 text-secondary flex items-center justify-center">
      <article className=" flex items-center justify-center w-full h-full  flex-wrap max-w-[70vw] mx-auto gap-x-2 md:gap-x-4">
        <Link
          href={''}
          className="bg-gradient-to-b from-background/5 to-background/30 backdrop-blur-[2px] border border-background rounded-none  px-2 py-1 text-center  "
        >
          Lorem ipsum
        </Link>
        <Link
          href={''}
          className="bg-gradient-to-b from-background/5 to-background/30 backdrop-blur-[2px] border border-background rounded-none  px-2 py-1 text-center  "
        >
          Lorem ipsum
        </Link>
        <Link
          href={''}
          className="bg-gradient-to-b from-background/5 to-background/30 backdrop-blur-[2px] border border-background rounded-none  px-2 py-1 text-center  "
        >
          Lorem ipsum
        </Link>
        <Link
          href={''}
          className="bg-gradient-to-b from-background/5 to-background/30 backdrop-blur-[2px] border border-background rounded-none  px-2 py-1 text-center  "
        >
          Lorem ipsum
        </Link>
        <Link
          href={''}
          className="bg-gradient-to-b from-background/5 to-background/30 backdrop-blur-[2px] border border-background rounded-none  px-2 py-1 text-center  "
        >
          Lorem ipsum
        </Link>
      </article>
    </section>
  )
}

export default HeroLinks

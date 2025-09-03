'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import pic3 from '../../../public/images/3.png'
import pic4 from '../../../public/images/4.png'
import Link from 'next/link'

// Register the GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Define the panel data
// const panels = [
//   { id: 1, color: 'bg-green-500', className: 'green' },
//   { id: 2, color: 'bg-orange-500', className: 'orange' },
//   { id: 3, color: 'bg-purple-500', className: 'purple' },
//   { id: 4, color: 'bg-blue-500', className: 'blue' },
// ]
const panels = [
  {
    id: 1,
    color: 'bg-transparent',
    imgSrc: pic3,
    className: 'green',
  },
  {
    id: 2,
    color: 'bg-transparent',
    imgSrc: pic4,
    className: 'orange',
  },
  {
    id: 3,
    color: 'bg-transparent',
    imgSrc: pic3,
    className: 'purple',
  },
  //   {
  //     id: 4,
  //     color: 'bg-transparent',
  //     imgSrc: pic4,
  //     className: 'blue',
  //   },
]

// Main SideUp Component
const SideUp = () => {
  const container = useRef<HTMLDivElement>(null)

  // useGSAP hook for managing GSAP animations in React
  useGSAP(
    () => {
      // This is a direct translation of the original GSAP code
      // using the modern useGSAP hook.

      // Set default animation properties
      gsap.defaults({ ease: 'none', duration: 1 })

      // Create a timeline for the panel animations
      const tl = gsap.timeline()

      // Animate panels sliding in from different directions
      tl.from('.orange', { xPercent: -70 })
        .from('.purple', { xPercent: 100 })
        .from('.blue', { yPercent: -70 })

      // Create the ScrollTrigger to pin the container and scrub the timeline
      ScrollTrigger.create({
        animation: tl,
        trigger: container.current, // Use the ref for the trigger element
        start: 'top top',
        end: '+=100%', // End after scrolling 300% of the viewport height
        scrub: true, // Smoothly scrub the animation on scroll
        pin: true, // Pin the container during the animation
        anticipatePin: 1, // Helps prevent jumps on fast scrolls
      })
    },
    { scope: container }
  ) // Scope the animations to the container element

  return (
    <>
      <div
        ref={container}
        className="relative w-full max-w-[96vw] mx-auto h-[70vh] md:h-screen top-8 md:top-12 overflow-hidden"
      >
        {panels.map((panel, index) => (
          <section
            key={panel.id}
            // The first panel needs to be positioned relatively to be visible initially.
            // Subsequent panels are absolute to stack on top of each other for the animation.
            className={`panel absolute w-full h-full flex items-center justify-center ${panel.color} ${panel.className}`}
            style={{ zIndex: index }} // Use z-index to stack panels correctly
          >
            <Link
              href={''}
              className={`relative w-full h-4/5   grid grid-cols-${panels.length} `}
            >
              <figure
                className={`relative col-span-1 col-start-${
                  index + 1
                } col-end-${
                  index + 2
                }  text-white text-[30vw] font-black  select-none`}
                style={{
                  gridColumnStart: index + 1,
                  gridColumnEnd: index + 2,
                }}
              >
                {/* {panel.id} */}
                <Image
                  unoptimized
                  src={panel.imgSrc}
                  fill
                  alt=""
                  className="object-contain"
                />
              </figure>
              <div
                style={{
                  left: `${index * 35 + 5}%`,
                }}
                className=" absolute h-full !text-[2vw] w-fit top-[80%] md:top-[90%]"
              >
                <p className=" bg-white/5 text-white font-bold text-sm md:text-lg text-center rounded-none px-2.5 py-1.5">
                  Category {index + 1}
                </p>
              </div>
            </Link>
          </section>
        ))}
        {/* The first panel is duplicated here but set to relative positioning to establish the container's space  bg-green-500*/}
        {/* <section className="panel relative w-full h-full flex items-center justify-center bg-transparent green">
          <h2 className="text-white text-[30vw] font-black opacity-20 select-none">
            1
          </h2>
        </section> */}
        {/* <figure
          className={`panel relative w-full h-full flex items-center justify-center bg-transparent`}
        >
      
          <Image src={pic1} fill alt="" className="object-contain" />
        </figure> */}
      </div>
    </>
  )
}

export default SideUp

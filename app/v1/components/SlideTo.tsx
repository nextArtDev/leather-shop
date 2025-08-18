'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import pic3 from '../../../public/images/3.png'
import pic4 from '../../../public/images/4.png'
import Image from 'next/image'

// Register the GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const layeredPanels = [
  {
    id: 1,
    color: 'bg-transparent',
    imgSrc: pic4,
    className: 'green',
  },
  {
    id: 2,
    color: 'bg-transparent',
    imgSrc: pic3,
    className: 'orange',
  },
  {
    id: 3,
    color: 'bg-transparent',
    imgSrc: pic4,
    className: 'purple',
  },
  {
    id: 4,
    color: 'bg-transparent',
    imgSrc: pic3,
    className: 'blue',
  },
]
const SlideTop = () => {
  const container = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(
        '.panel',
        container.current
      )

      gsap.set(panels, {
        zIndex: (i, target, targets) => targets.length - i,
        yPercent: (i) => (i % 3 === 0 ? (2 - i) * 100 : 0),
        xPercent: (i) => (i % 3 === 0 ? 0 : (3 - i) * -1 * 100),
        opacity: 0,
      })

      // Animate all panels except for the very last one.
      // We animate them moving up (yPercent: -100) to reveal the one underneath.
      //   gsap.to(panels.slice(0, -1), {
      gsap.to(panels, {
        yPercent: 0,
        xPercent: 0,
        ease: 'none',
        opacity: 1,
        stagger: 0.5, // Create a 0.5s delay between each panel animation
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=150%',
          scrub: true,
          pin: true,
        },
      })
    },
    { scope: container }
  )

  return (
    <section dir="ltr" className="w-full h-full">
      <div
        ref={container}
        className="isolate relative   w-full h-[60vh] md:h-[90vh] grid grid-cols-6 p-2"
      >
        {layeredPanels.map((panel, index) => (
          <section
            key={panel.id}
            className={`panel absolute  w-full h-full  ${panel.color} ${panel.className}`}
            style={{
              gridColumnStart: index + 1,
              gridColumnEnd: index + 2,
            }}
          >
            <figure className=" relative w-full h-full">
              {/* <h2 className="text-white text-[30vw] font-black opacity-20 select-none">
              {panel.content}
              </h2> */}
              <Image
                src={panel.imgSrc}
                fill
                alt=""
                className="object-contain"
              />
            </figure>
          </section>
        ))}
      </div>
    </section>
  )
}

export default SlideTop

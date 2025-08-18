'use client'

import { useRef } from 'react'
// import { asText, Content } from "@prismicio/client";
// import { SliceComponentProps } from "@prismicio/react";
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Bounded } from '@/components/shared/Bounded'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ScrollTextProps = {
  scrollText: { eyebrow: string; text: string }
}

const ScrollText = ({ scrollText }: ScrollTextProps) => {
  const componentRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const words = scrollText.text.split(' ')

  useGSAP(
    () => {
      const component = componentRef.current
      const textElement = textRef.current
      const contentElement = contentRef.current
      const letters = textElement?.querySelectorAll('span')

      if (!component || !textElement || !letters || !contentElement) return

      // Set initial blur and color
      gsap.set(contentElement, { filter: 'blur(40px)' })
      gsap.set(letters, {
        color: 'hsla(221.99999999999997, 9.803921568627452%, 20%, 0.692)',
      })

      gsap.to(contentElement, {
        filter: 'blur(0px)',
        duration: 1,
        scrollTrigger: {
          trigger: component,
          start: 'top 75%',
          end: 'top top',
          scrub: 2,
          //   markers:true
        },
      })

      const colorTl = gsap.timeline({
        scrollTrigger: {
          trigger: component,
          start: 'top top',
          end: 'bottom -100%',
          pin: true,
          scrub: 2,
        },
      })

      colorTl.to(letters, {
        color: 'white',
        stagger: {
          each: 0.01,
          from: 'start',
          ease: 'power1.inOut',
        },
      })

      colorTl.to(
        '.glow-background',
        {
          opacity: 1,
          ease: 'power2.inOut',
          duration: 1,
        },
        0
      )
    },
    { scope: componentRef }
  )

  return (
    <Bounded
      ref={componentRef}
      //   data-slice-type={slice.slice_type}
      //   data-slice-variation={slice.variation}
      className="isolate relative outline-dashed outline-[#3b2b17] outline-[2px] -outline-offset-4 flex h-[80vh] md:h-screen items-center justify-center "
    >
      <div className="glow-background absolute inset-0 z-0 h-full w-full opacity-0"></div>
      {/* <div className="absolute inset-0 bg-[url('/royal/noisetexture.jpg')] opacity-30 mix-blend-multiply"></div> */}
      <div
        style={{
          backgroundImage: 'url(/images/whiteleather.svg)',
          backgroundRepeat: 'repeat',
          // backgroundSize: '200px 200px',
          backgroundBlendMode: 'multiply',
          backgroundColor: '#6b4a23',
        }}
        className="absolute inset-0  opacity-60"
      ></div>

      <div ref={contentRef}>
        <div className="mb-2 text-center text-sm tracking-wider text-neutral-200 uppercase md:mb-8 md:text-base">
          {scrollText.eyebrow}
        </div>

        {/* Paragraph */}
        <div ref={textRef} className="text-center">
          <p className="font-display flex flex-wrap justify-center text-4xl leading-tight text-balance uppercase md:text-5xl">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="inline">
                {word.split('').map((char, charIndex) => (
                  <span key={`${char}-${charIndex}`} className="inline">
                    {char}
                  </span>
                ))}
                {index < words.length - 1 ? (
                  <span className="inline">&nbsp;</span>
                ) : null}
              </span>
            ))}
          </p>
        </div>
      </div>
    </Bounded>
  )
}

export default ScrollText

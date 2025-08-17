'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const NavBar = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!container?.current) return
      gsap.set('.menu', {
        opacity: 0,
        visibility: 'hidden',
      })

      gsap.set('.nav-icons', {
        color: '#FFF',
      })

      gsap.set('.logo', {
        fontSize: '8rem',
        yPercent: 150,
      })

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=120',
          scrub: 0.1,
          markers: false,
        },
      })

      heroTl.to(
        '.menu',
        {
          opacity: 1,
          visibility: 'visible',
          ease: 'power2.out',
          duration: 0.15, // Slightly faster
        },
        0
      )

      heroTl.to(
        '.nav-icons',
        {
          color: '#000',
          ease: 'power1.out',
          duration: 0.08,
        },
        0
      )

      heroTl.to(
        '.logo',
        {
          fontSize: '2rem',
          yPercent: 0,
          color: 'black',
          ease: 'power2.out',
          duration: 0.8,
        },
        0
      )

      heroTl.to(
        container.current,
        {
          background: '#ffffff35',
          backdropFilter: 'blur(12px)',
          ease: 'power1.out',
          duration: 0.25,
        },
        0
      )

      heroTl.to(
        '.LeftText',
        {
          color: '#000',
          ease: 'power1.out',
          duration: 0.08,
        },
        0
      )
    },
    { scope: container }
  )

  return (
    <nav
      dir="ltr"
      ref={container}
      className="navbar bg-transparent fixed top-0 left-0 z-50 w-full h-20   md:p-9 p-3 flex justify-between items-center "
    >
      <article className="LeftText hidden flex-1 md:block text-white">
        LOGO
      </article>

      {/* <p className="logo !text-white bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent font-bold  [text-shadow:_0_3px_2px_rgb(240_240_240_/_1)] transform  tracking-wide flex-1 mx-auto !max-w-[98vw]  md:text-center mix-blend-difference ">
        SEPIDAR
      </p> */}
      <p className="logo !text-white bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text  font-bold  [text-shadow:_0_3px_2px_rgb(240_240_240_/_1)] transform  tracking-wide flex-1 mx-auto !max-w-[98vw] scale-50 md:scale-100 md:text-center mix-blend-difference ">
        SEPIDAR
      </p>

      <article className="menu flex flex-1 justify-end gap-2 opacity-0 md:opacity-100">
        <span className="nav-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14C14.76 14 17 11.16 17 9C17 6.24 14.76 4 12 4C9.24 4 7 6.24 7 9C7 11.76 9.24 14 12 14ZM12 5.5C13.93 5.5 15.5 7.07 15.5 9C15.5 10.93 13.93 12.5 12 12.5C10.07 12.5 8.5 10.93 8.5 9C8.5 7.07 10.07 5.5 12 5.5ZM18.75 18V20H17.25V18C17.25 17.31 16.69 16.75 16 16.75H8C7.31 16.75 6.75 17.31 6.75 18V20H5.25V18C5.25 16.48 6.48 15.25 8 15.25H16C17.52 15.25 18.75 16.48 18.75 18Z" />
          </svg>
        </span>
        <span className="nav-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.75 14C14.51 14 16.75 11.76 16.75 9C16.75 6.24 14.51 4 11.75 4C8.99 4 6.75 6.24 6.75 9C6.75 11.76 8.99 14 11.75 14ZM5 20V18C5 16.48 6.23 15.25 7.75 15.25H15.75C17.27 15.25 18.5 16.48 18.5 18V20H5Z" />
          </svg>
        </span>
        <span className="nav-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.0002 7H15.7502V5.75C15.7502 4.79 14.9702 4 14.0002 4H9.99023C9.03023 4 8.24023 
						4.78 8.24023 5.75V7H5.99023C4.89023 7 3.99023 7.89 3.99023 9V18C3.99023 19.1 4.88023 20 
						5.99023 20H17.9902C19.0902 20 19.9902 19.11 19.9902 18V9C19.9902 7.9 19.1002 7 17.9902 
						7H18.0002ZM9.75023 5.75C9.75023 5.61 9.86023 5.5 10.0002 5.5H14.0102C14.1502 5.5 14.2602 
						5.61 14.2602 5.75V7H9.76023V5.75H9.75023ZM18.5002 18.01C18.5002 18.28 18.2802 18.51 18.0002 
						18.51H6.00023C5.73023 18.51 5.50023 18.29 5.50023 18.01V9.01C5.50023 8.74 5.72023 8.51 6.00023 
						8.51H8.25023V10.01H9.75023V8.51H14.2502V10.01H15.7502V8.51H18.0002C18.2702 8.51 18.5002 8.73 
						18.5002 9.01V18.01Z"
            />
          </svg>
        </span>
        <span className="nav-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6.5H4V5H20V6.5ZM20 11.25H4V12.75H20V11.25ZM20 17.5H4V19H20V17.5Z" />
          </svg>
        </span>
      </article>
    </nav>
  )
}

export default NavBar

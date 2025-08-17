'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import Steel from './Steel'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const leatherTextureStyle = {
  backgroundImage: 'url(/images/whiteleather.svg)',
  backgroundRepeat: 'repeat',
  // backgroundSize: '200px 200px',
  backgroundBlendMode: 'multiply',
}

const CoverLayer = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.trigger',
        start: 'top top',
        // end: '+=100vh',
        end: '250% top',
        scrub: 1.5,
        pin: true,
        pinSpacing: '100vh',
      },
    })
    tl.to('.top-box', {
      opacity: 1,
    })
    tl.from('.quarte-red', {
      clipPath: 'polygon(0 0, 0% 0, 0% 40%, 0 40%)',
      ease: 'power1.in',
    })
      .from(
        '.quarter-blue',
        {
          clipPath: 'polygon(70% 40%, 100% 0%, 100% 0%, 70% 40%)',
          ease: 'power1.in',
        },
        '<+0.5'
      )
      .from(
        '.quarter-yellow',
        {
          clipPath: 'polygon(70% 100%, 70% 100%, 70% 70%, 70% 70%)',
          ease: 'power1.in',
        },
        '<+0.5'
      )
      .from(
        '.quarter-green',
        {
          clipPath: 'polygon(0 100%, 0% 100%, 40% 70%, 40% 70%)',
          ease: 'power1.in',
        },
        '<+0.5'
      )
      .from(
        '.center-green-box',
        {
          opacity: 0,
          scale: 3,
          // rotation: 45,
          ease: 'power1.in',
          duration: 0.6,
        },
        '80%'
      )
  })

  return (
    <section
      dir="ltr"
      className=" top-box opacity-0 z-20 w-full h-screen absolute inset-0"
    >
      <article className="size-full max-h-screen bg-transparent video-box flex flex-wrap relative">
        <article
          style={{
            position: 'absolute',
            height: '100vh',
            top: '0',
            left: '0',
            clipPath: 'polygon(0% 40%, 0 100%, 40% 70%, 40% 40%)',
            backgroundColor: '#6b4a23',
            ...leatherTextureStyle,
            backgroundBlendMode: 'multiply',
          }}
          className="quarter-green outline-dashed outline-[2px] -outline-offset-4 outline-[#d1c7bb] p-4 h-full w-full"
        />

        {/* Red - Top triangle */}
        <article
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            clipPath: 'polygon(0 0, 100% 0, 70% 40%, 0 40%)',
            // backgroundColor: '#981e1e',
            backgroundColor: '#f37932',
            ...leatherTextureStyle,
            backgroundBlendMode: 'multiply',
          }}
          className="quarte-red outline-dashed outline-[2px] -outline-offset-4 outline-[#d1c7bb] shadow-lg h-full w-full"
        />

        {/* Blue - Right triangle */}
        <article
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            clipPath: 'polygon(70% 40%, 100% 0%, 100% 100%, 70% 100%)',
            // backgroundColor: '#2c5282',
            backgroundColor: '#A16F49',
            ...leatherTextureStyle,
            backgroundBlendMode: 'multiply',
          }}
          className="quarter-blue outline-dashed outline-[2px] -outline-offset-4 outline-[#d1c7bb] shadow-lg h-full w-full"
        />

        {/* Yellow - Bottom triangle */}
        <article
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translate(-50%, 0)',
            clipPath: 'polygon(0% 100%, 70% 100%, 70% 70%, 40% 70%)',
            // backgroundColor: '#f37932',
            backgroundColor: '#F5F5DC',
            ...leatherTextureStyle,
            backgroundBlendMode: 'multiply',
          }}
          className="quarter-yellow relative outline-dashed outline-[2px] -outline-offset-4 outline-[#d1c7bb] shadow-lg h-full w-full"
        ></article>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center',
            // width: '100px',
            // height: '100px',
            // backgroundColor: '#22c55e',
            // borderRadius: '12px',
            zIndex: 10,
            // ...leatherTextureStyle,
            // backgroundBlendMode: 'multiply',
          }}
          className="center-green-box  "
        >
          <Steel className="w-[45vw] h-[32vh] mt-20 !rounded-xl">
            <p className=" text-4xl text-amber-600 -mt-20 ">چرم سپیده</p>
          </Steel>
        </div>
      </article>
    </section>
  )
}

export default CoverLayer

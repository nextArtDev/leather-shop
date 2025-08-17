/* eslint-disable @next/next/no-img-element */
'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useMediaQuery } from 'react-responsive'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(useGSAP, ScrollTrigger)

const VideoPin = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px)',
  })

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.vd-pin-section',
        start: '-5% top',
        end: '150% top',
        scrub: 1.5,
        pin: true,
      },
    })

    tl.to('.video-box', {
      clipPath: 'circle(100% at 50% 50%)',
      ease: 'power1.inOut',
    })
  })

  return (
    <section className="relative vd-pin-section md:h-[110vh] h-dvh overflow-hidden md:!-translate-y-[15%] md:mt-0 mt-20">
      <div
        className="  absolute inset-0  !rounded-lg flex flex-col md:flex-row gap-4 mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
        style={{
          textShadow: '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
          backgroundImage: 'url(/images/whiteleather.svg)',
          backgroundRepeat: 'repeat',
          // backgroundSize: '280px 450px',
          backgroundBlendMode: 'multiply',
          backgroundColor: '#7e4a28',
          filter: 'drop-shadow(0 0 0.15rem #44291755)',
          boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
        }}
      />
      <div
        // style={{
        //   clipPath: isMobile
        //     ? 'circle(100% at 50% 50%)'
        //     : 'circle(6% at 50% 50%)',
        // }}
        style={{
          clipPath: 'circle(6% at 50% 50%)',
        }}
        className="  size-full video-box relative w-full h-full "
      >
        <video
          src="/videos/Bags And Small Leather Goods For Women - Le Tanneur.webm"
          playsInline
          muted
          loop
          autoPlay
          className="size-full absolute inset-0 object-cover"
        />

        <div className=" abs-center md:scale-100 scale-200">
          {/* <img src="/images/circle-text.svg" alt="" className="spin-circle" /> */}
          <div className="play-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[9vw] flex justify-center items-center bg-[#ffffff1a] backdrop-blur-xl rounded-full">
            <img
              src="/images/play.svg"
              alt=""
              className="size-[3vw] ml-[.5vw]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoPin

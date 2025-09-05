import Image from 'next/image'
import React from 'react'
import img from '../../../public/images/hero-image.webp'
import Link from 'next/link'
// import brderImage from '../../../public/images/border.webp'
// import brderImage1 from '../../../public/images/border-rounded.webp'
import CoverLayer from './CoverLayer'
const HeroLeather = () => {
  return (
    <section className="relative w-full  trigger  h-screen ">
      <div className="absolute inset-0">
        <CoverLayer />
      </div>
      <div
        className="isolate  absolute inset-0 h-5/11 !rounded-t-lg  flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b]  outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
        style={{
          textShadow: '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
          backgroundImage: 'url(/images/whiteleather.svg)',
          backgroundRepeat: 'repeat',
          // backgroundSize: '280px 450px',
          backgroundBlendMode: 'multiply',
          backgroundColor: '#855943',
          filter: 'drop-shadow(0 0 0.15rem #442917)',
          boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
        }}
      />
      <div
        className="   absolute inset-0 h-1/11 top-5/11   flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b]  outline-[0.125rem] outline-dashed outline-[#c2a38f88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
        style={{
          textShadow: '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
          backgroundImage: 'url(/images/whiteleather.svg)',
          backgroundRepeat: 'repeat',
          // backgroundSize: '280px 450px',
          backgroundBlendMode: 'overlay',
          backgroundColor: '#eed49b',
          filter: 'drop-shadow(0 0 0.15rem #44291755)',
          boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
        }}
      />
      <div
        className="   absolute inset-0 h-5/11 top-6/11 !rounded-b-lg flex flex-col md:flex-row gap-4  mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b]  outline-[0.125rem] outline-dashed outline-[#87431b88] -outline-offset-[5px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
        style={{
          textShadow: '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
          backgroundImage: 'url(/images/whiteleather.svg)',
          backgroundRepeat: 'repeat',
          // backgroundSize: '280px 450px',
          backgroundBlendMode: 'multiply',
          backgroundColor: '#87431b',
          filter: 'drop-shadow(0 0 0.15rem #44291755)',
          boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
        }}
      />

      <div className="isolate relative w-full h-full flex flex-col items-center justify-center gap-4 p-4 pt-16">
        {/* <Image
          src={brderImage}
          alt="Leather"
          width={350}
          height={350}
          className="absolute mix-blend-lighten bottom-1 left-1 object-cover  aspect-square"
        /> */}
        <article
          className="relative mx-auto w-2/3 max-w-md aspect-square h-2/3
 "
        >
          <figure className="relative aspect-square rounded-full  border border-[#87431b] outline-[0.1rem] outline-dashed outline-[#d3d3d389] outline-offset-[2px]">
            <div className="relative scale-90 w-full h-full rounded-full overflow-hidden">
              <Image
                src={img}
                alt="Leather"
                fill
                className="object-cover origin-center "
              />
            </div>

            {/* Border frame around it */}
            {/* <Image
              src="/images/border-rounded.webp"
              alt="Border Frame"
              fill
              className="pointer-events-none select-none origin-center scale-125 mix-blend-multiply"
            /> */}
          </figure>
        </article>
        <article className="w-full flex flex-col items-center justify-center gap-4    ">
          <p
            style={{
              color: 'rgba(60,30,0,0.3)',
              textShadow: '3px 3px 0px rgba(255,255,255,0.9)',
            }}
            className="isolate text-center px-1 max-w-md mx-auto "
          >
            An expression of quiet luxury, Côte Royale is designed for the man.
          </p>
          <div className="flex items-center !text-base justify-center gap-6 w-full h-full flex-wrap">
            <Link href={'/'} className="relative w-fit">
              <div
                className="  absolute inset-0 rounded-[.5rem] flex flex-col md:flex-row gap-4 max-w-xl mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.06rem] outline-dashed outline-[#d3d3d389] -outline-offset-[2px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
                style={{
                  textShadow:
                    '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
                  backgroundImage: 'url(/images/whiteleather.svg)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '150px 150px',
                  backgroundBlendMode: 'multiply',
                  backgroundColor: '#855b43',
                  filter: 'drop-shadow(0 0 0.15rem #44291755)',
                  boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
                }}
              />
              <p
                style={{
                  textShadow:
                    '-3px -2px 3px #868675, -5px 0px 4px rgba(66, 72, 43, 1), 5px 3px 1px rgba(124, 98, 8, 1)',
                }}
                className="isolate px-4 py-1.5 text-white mix-blend-luminosity"
              >
                lorem ipsom
              </p>
            </Link>
            <Link href={'/'} className="relative w-fit">
              <div
                className="  absolute inset-0   !rounded-[.5rem] flex flex-col md:flex-row gap-4 max-w-xl mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.06rem] outline-dashed outline-[#c2a38f88] -outline-offset-[2px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
                style={{
                  textShadow:
                    '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
                  backgroundImage: 'url(/images/whiteleather.svg)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '150px 150px',
                  backgroundBlendMode: 'multiply',
                  backgroundColor: '#7e4a28',
                  filter: 'drop-shadow(0 0 0.15rem #44291755)',
                  boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
                }}
              />
              <p
                style={{
                  textShadow:
                    '-3px -2px 3px #868675, -5px 0px 4px rgba(66, 72, 43, 1), 5px 3px 1px rgba(124, 98, 8, 1)',
                }}
                className="isolate px-4 py-1.5 text-white mix-blend-luminosity"
              >
                lorem ipsom
              </p>
            </Link>
            <Link href={'/'} className="relative w-fit">
              <div
                className="  absolute inset-0 rounded-[.5rem] flex flex-col md:flex-row gap-4 max-w-xl mx-auto p-2 !textLight   text-[#eed49b]  border border-[#87431b] outline-[0.06rem] outline-dashed outline-[#d3d3d388] -outline-offset-[2px] bg-gradient-to-b  from-[#e2a57f] via-[#855b43e0]   to-[#87431b]    shadow-[1px_1px_10px_#522910,_-1px_-1px_10px_#aa5522]   "
                style={{
                  //   textShadow:
                  //     '1px 1px 1px #c2a38f, 0 0 2px #948378, 0 0 0.2px #d3d3d3',
                  textShadow:
                    '-3px -2px 3px rgba(135, 135, 10, 1), -5px 0px 4px rgba(66, 72, 43, 1), 5px 3px 1px rgba(124, 98, 8, 1)',
                  backgroundImage: 'url(/images/whiteleather.svg)',
                  backgroundRepeat: 'repeat',
                  backgroundSize: '150px 150px',
                  backgroundBlendMode: 'multiply',
                  backgroundColor: '#aa5522',
                  filter: 'drop-shadow(0 0 0.15rem #44291755)',
                  boxShadow: '2px 2px 4px #87431b,-2px -2px 4px #633d26',
                }}
              />
              <p
                style={{
                  textShadow:
                    '-3px -2px 3px #868675, -5px 0px 4px rgba(66, 72, 43, 1), 5px 3px 1px rgba(124, 98, 8, 1)',
                }}
                className="isolate px-4 py-1.5 text-white mix-blend-luminosity"
              >
                lorem ipsom
              </p>
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

export default HeroLeather

{
  /* <svg
    className="absolute inset-0 w-full h-full mix-blend-luminosity"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <clipPath id="heroClip" clipPathUnits="objectBoundingBox">
        <ellipse cx="0.5" cy="0.5" rx="0.4" ry="0.4" />
      </clipPath>
    </defs>

  
    <foreignObject
      x="0"
      y="0"
      width="100%"
      height="100%"
      clipPath="url(#heroClip)"
    >
      <Image src={img} alt="Leather" fill className="object-cover" />
    </foreignObject>

    <ellipse
      cx="50"
      cy="50"
      rx="41" // a bit larger than 35
      ry="41" //Dashed border (slightly larger ellipse)
      fill="none"
      stroke="#94837888"
      strokeWidth="0.5"
      strokeDasharray="1 .5"
    />
  </svg> */
}

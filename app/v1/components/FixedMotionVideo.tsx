'use client'
import React, { useRef, useEffect, ReactNode } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

type SupportedEdgeUnit = 'px' | 'vw' | 'vh' | '%'
type EdgeUnit = `${number}${SupportedEdgeUnit}`
type NamedEdges = 'start' | 'end' | 'center'
type EdgeString = NamedEdges | EdgeUnit | `${number}`
type Edge = EdgeString | number
type ProgressIntersection = [number, number]
type Intersection = `${Edge} ${Edge}`
export type ScrollOffset = Array<Edge | Intersection | ProgressIntersection>

export default function FixedVideoPlay({
  videoUrl,
  children,
  offset = ['start end', 'end start'],
  transform = ['-40%', '40%'],
  overlayClassNames = 'bg-black/30',
  className,
}: {
  videoUrl: string
  children: ReactNode
  offset?: ScrollOffset
  transform?: string[]
  overlayClassNames?: string
  className?: string
}) {
  const sectionRef = useRef(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isInView = useInView(sectionRef, { amount: 0.2, once: false })

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isInView])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: offset,
  })
  const y = useTransform(scrollYProgress, [0, 1], transform)

  return (
    <section
      ref={sectionRef}
      className={` relative flex items-center justify-center h-[500px] md:h-[700px] overflow-hidden  ${className}`}
    >
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

      <motion.div
        className="absolute inset-5 z-0 outline-[0.125rem] outline-dashed outline-[#c2a38f88] outline-offset-[7px] rounded-md"
        style={{ y }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-md"
        />
      </motion.div>
      <div className={` absolute inset-0 z-10  ${overlayClassNames}`} />

      <div className="relative z-20">{children}</div>
    </section>
  )
}

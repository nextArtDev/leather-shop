import React from 'react'
import FixedVideoPlay from './FixedVideoPlay'

type Props = {}

const WorkVideo = (props: Props) => {
  return (
    <section className="w-full flex flex-col items-center justify-center mx-auto gap-8  text-center">
      <div className="container w-[90vw] m-w-xl flex flex-col gap-4">
        <h2 className="text-xl md:text-3xl font-bold uppercase">
          Savoir-faire
        </h2>
        <p>
          We are experts in leather goods, which require precise workmanship,
          and we pay particular attention to the choice of our raw materials.
          Our collections are made using only full-grain leather, which is the
          highest quality of leather.
        </p>
      </div>
      <FixedVideoPlay
        className="w-full"
        videoUrl="/videos/Bags And Small Leather Goods For Women - Le Tanneur.webm"
      >
        {' '}
      </FixedVideoPlay>
    </section>
  )
}

export default WorkVideo

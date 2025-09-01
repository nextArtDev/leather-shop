import React from 'react'
import FixedVideoPlay from './FixedVideoPlay'

const WorkVideo = () => {
  return (
    <section className="w-full py-12 flex flex-col items-center justify-center mx-auto gap-12  text-center">
      <div className="container w-[90vw] m-w-xl flex flex-col gap-4">
        <h2 className="text-xl md:text-3xl font-bold uppercase py-8">
          {/* Savoir-faire */}
          هنرِ ساخت: اصالت در هر دوخت
        </h2>
        <p className="max-w-md mx-auto text-pretty text-center">
          {/* We are experts in leather goods, which require precise workmanship,
          and we pay particular attention to the choice of our raw materials.
          Our collections are made using only full-grain leather, which is the
          highest quality of leather. */}
          ما در ساخت مصنوعات چرمی، که نیازمند ظرافتی مثال‌زدنی است، متخصص هستیم
          و توجهی ویژه به انتخاب مواد اولیه خود داریم. تمامی مجموعه‌های ما تنها
          از چرم تمام‌دانه — که اصیل‌ترین و مرغوب‌ترین نوع چرم طبیعی است — ساخته
          می‌شوند.
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

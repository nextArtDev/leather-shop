import { FadeIn } from '@/components/shared/fade-in'
import { RevealText } from '@/components/shared/reveal-text'
import React from 'react'

const StoreStatement = () => {
  return (
    <section className="flex flex-col items-center justify-center py-12 gap-4 w-[90vw] max-w-md mx-auto">
      <RevealText
        // text="Effortless Elegance"
        text="آغاز داستان ما"
        id="store-statements"
        className="text-xl md:text-3xl font-bold pt-6"
        staggerAmount={0.2}
        duration={0.8}
      />
      {/* French Savoir-faire since 1898 */}
      {/* <h2 className="text-xl md:text-3xl font-bold ">
        آغاز داستان ما
      </h2> */}
      <FadeIn className=" translate-y-8 " vars={{ delay: 0.6, duration: 0.6 }}>
        <p className="text-center text-pretty md:text-lg">
          {/* Since 1898, we have been dreaming up, designing and crafting premium and
        essential bags and accessories that have stood the test of the years,
        with their truly timeless design. */}
          کارگاه کوچک ما، جایی است که رویاهای چرمی به واقعیت می‌پیوندند. ما با
          اشتیاقی وافر و چشمداشت به فردایی درخشان، کار خود را با طراحی و ساخت
          کیف‌ها و اکسسوری‌ها آغاز کرده‌ایم. بر این باوریم که طراحی بی‌زمان و
          کیفیت استثنایی، هسته اصلی خلق محصولاتی هستند که قرار است برای سال‌ها
          همراه همیشگی شما باشند.
        </p>
      </FadeIn>
    </section>
  )
}

export default StoreStatement

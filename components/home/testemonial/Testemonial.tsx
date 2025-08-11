'use client'

import { AnimatePresence, motion, stagger } from 'framer-motion'
import { Dot } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SingleStarRating } from './SingleStartRating'

const testimonials1 = [
  {
    text: 'First testimonial goes here. Praising your product or service and expressing satisfaction.',
    author: 'Ansub',
    rating: 4,
  },
  {
    text: 'Another testimonial goes here. Praising your product or service and expressing satisfaction.',
    author: 'Lex Collins',

    rating: 3,
  },
  {
    text: 'Third testimonial goes here. Praising your product or service and expressing satisfaction.',
    author: 'Alex Jones',
    rating: 5,
  },
  {
    text: 'Fourth testimonial goes here. Praising your product or service and expressing satisfaction.',
    author: 'John Doe',
    rating: 4,
  },
]
interface TestimonialCarouselProps {
  testimonials?: {
    text: string
    author: string
    rating: number
    created_time: Date
  }[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestimonialCarousel = ({ testimonials }: TestimonialCarouselProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTestimonial(
        (prevTestimonial) => (prevTestimonial + 1) % testimonials1.length
      )
    }, 9000) // Change Time here

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  // const { text, author, rating, created_time } =
  const { text, author, rating } = testimonials1[currentTestimonial]

  const variants = {
    initial: { opacity: 0, y: '100%', scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: '100%', scale: 0.9 },
  }
  const dotVariants = {
    active: { scale: 0.8, backgroundColor: '#202221' },
    inactive: { scale: 0.4, backgroundColor: '#8d8f8985' },
  }

  return (
    <section className="w-full mx-auto py-12 md:py-24 max-w-2xl">
      <article className="relative overflow-hidden  px-8 py-10  w-[90vw] max-w-[90vh]  ">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentTestimonial}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            className=" flex w-full flex-col items-center justify-center"
            transition={{
              // type: 'spring',
              // stiffness: 200,
              // damping: 20,
              // duration: 0.5,
              // delay: 0.1,
              duration: 0.25,
              delayChildren: stagger(0.25),
            }}
          >
            <motion.div variants={variants} className="pb-4 flex gap-2 ">
              {/* <StarRating value={rating} disabled /> */}
              <SingleStarRating rating={rating} />
              <span className="font-semibold">{rating}</span>/5
            </motion.div>
            <motion.p
              variants={variants}
              className="m-0 text-center  text-sm md:text-base font-medium tracking-tight line-clamp-7 md:line-clamp-5"
            >
              &quot;{text}&quot;
            </motion.p>
            <motion.div variants={variants} className="mx-auto mt-5">
              <div className="flex flex-col items-center justify-center space-x-3">
                {/* <div className="font-regular text-sm text-gray-900/80">
                  {author}
                </div> */}

                <div className="flex justify-center items-center">
                  <span className=" text-[1rem] ">{author}</span>
                  <Dot className="" />

                  <span className=" text-xs md:text-sm ">
                    {/* {formatTimeToNow(new Date(created_time))} */}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <div className="mt-8 flex justify-center">
            {testimonials1.map((_, index) => (
              <motion.div
                key={index}
                className="mx-0.5 h-2  w-2  cursor-pointer "
                variants={dotVariants}
                animate={index === currentTestimonial ? 'active' : 'inactive'}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </AnimatePresence>
      </article>
    </section>
  )
}

export default TestimonialCarousel

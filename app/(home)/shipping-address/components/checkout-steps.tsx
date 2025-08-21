import React from 'react'
import { cn } from '@/lib/utils'

const CheckoutSteps = ({ current = 0 }) => {
  return (
    <div className="sticky top-2 md:top-10 z-10  flex-between  flex-row space-x-2 space-y-2 mb-10">
      {['عضویت', 'آدرس ارسال', 'ثبت سفارش'].map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              'p-2 w-56 text-muted-foreground bg-muted-foreground/20 backdrop-blur-sm rounded-full border border-indigo-600 text-center text-xs md:text-sm',
              index === current ? 'bg-indigo-600 text-secondary' : ''
            )}
          >
            {step}
          </div>
          {step !== 'ثبت سفارش' && (
            <hr className="w-16 border-t border-indigo-600 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutSteps

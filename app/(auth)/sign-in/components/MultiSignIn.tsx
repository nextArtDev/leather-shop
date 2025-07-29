'use client'

import React, { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Shield,
  User,
  MapPin,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'

// Define schemas for each step
const phoneSchema = z.object({
  phone: z.string().min(10, 'شماره موبایل معتبر وارد کنید'),
})

const otpSchema = z.object({
  code: z
    .string()
    .min(6, 'کد تایید باید ۶ رقم باشد')
    .max(6, 'کد تایید باید ۶ رقم باشد'),
})

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر وارد کنید').optional().or(z.literal('')),
})

const addressSchema = z.object({
  address: z.string().min(5, 'آدرس باید حداقل ۵ کاراکتر باشد'),
  city: z.string().min(2, 'نام شهر باید حداقل ۲ کاراکتر باشد'),
  postalCode: z.string().min(5, 'کد پستی باید حداقل ۵ رقم باشد'),
})

// Combined form schema
const completeFormSchema = z.object({
  ...phoneSchema.shape,
  ...otpSchema.shape,
  ...personalInfoSchema.shape,
  ...addressSchema.shape,
})

type CompleteFormData = z.infer<typeof completeFormSchema>

interface MultiStepPhoneAuthProps {
  className?: string
  onComplete?: (data: CompleteFormData) => void
}

export default function MultiStepPhoneAuth({
  className,
  onComplete,
}: MultiStepPhoneAuthProps) {
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CompleteFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpKey, setOtpKey] = useState(0)

  // Define the steps
  const steps = [
    {
      id: 'phone',
      title: 'تایید شماره موبایل',
      description: 'شماره موبایل خود را وارد کنید',
      schema: phoneSchema,
      icon: Phone,
      fields: [
        {
          name: 'phone',
          label: 'شماره موبایل',
          type: 'phone',
          placeholder: '09123456789',
        },
      ],
    },
    {
      id: 'otp',
      title: 'کد تایید',
      description: 'کد ارسال شده را وارد کنید',
      schema: otpSchema,
      icon: Shield,
      fields: [
        {
          name: 'code',
          label: 'کد تایید',
          type: 'otp',
          placeholder: '••••••',
        },
      ],
    },
  ]

  // Get current step schema
  const currentStepSchema = steps[step].schema

  // Setup form with current step schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: formData,
  })

  // Calculate progress
  const progress = ((step + 1) / steps.length) * 100

  // Handle phone submission (step 0)
  const handlePhoneSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const result = await authClient.phoneNumber.sendOtp({
          phoneNumber: data.phone,
        })

        if (!result.error) {
          const updatedData = { ...formData, ...data }
          setFormData(updatedData)
          setStep(1)
          setOtpValue('')
          setOtpKey((prev) => prev + 1)
          reset(updatedData)
          toast.success('کد تایید ارسال شد')
        } else {
          toast.error(result.error.message || 'خطا در ارسال کد')
        }
      } catch (error) {
        console.error('Phone submission error', error)
        toast.error('خطا در ارسال کد تایید')
      }
    })
  }

  // Handle OTP submission (step 1)
  const handleOtpSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const result = await authClient.phoneNumber.verify({
          phoneNumber: formData.phone!,
          code: data.code,
        })

        if (!result.error) {
          const updatedData = { ...formData, ...data }
          setFormData(updatedData)
          setStep(2)
          reset(updatedData)
          toast.success('تایید موفقیت‌آمیز')
        } else {
          toast.error(result.error.message || 'کد وارد شده اشتباه است')
        }
      } catch (error) {
        console.error('OTP verification error', error)
        toast.error('خطا در تایید کد')
      }
    })
  }

  // Handle regular form steps (steps 2+)
  const handleRegularSubmit = (data: any) => {
    const updatedData = { ...formData, ...data }
    setFormData(updatedData)

    if (step < steps.length - 1) {
      setStep(step + 1)
      reset(updatedData)
    } else {
      // Final submission
      setIsSubmitting(true)
      setTimeout(() => {
        if (onComplete) {
          onComplete(updatedData as CompleteFormData)
        }
        setIsComplete(true)
        setIsSubmitting(false)
        toast.success('ثبت‌نام با موفقیت انجام شد')
      }, 1500)
    }
  }

  // Handle form submission based on current step
  const handleFormSubmit = (data: any) => {
    if (step === 0) {
      handlePhoneSubmit(data)
    } else if (step === 1) {
      handleOtpSubmit(data)
    } else {
      handleRegularSubmit(data)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 0) {
      if (step === 1) {
        // If going back from OTP, don't go to phone step directly
        // Instead, allow resending OTP
        setOtpValue('')
        setOtpKey((prev) => prev + 1)
      } else {
        setStep(step - 1)
        reset(formData)
      }
    }
  }

  // Handle resend OTP
  const handleResendOtp = () => {
    startTransition(async () => {
      try {
        const result = await authClient.phoneNumber.sendOtp({
          phoneNumber: formData.phone!,
        })

        if (!result.error) {
          setOtpValue('')
          setOtpKey((prev) => prev + 1)
          toast.success('کد تایید مجدداً ارسال شد')
        } else {
          toast.error('خطا در ارسال مجدد کد')
        }
      } catch (error) {
        toast.error('خطا در ارسال مجدد کد')
      }
    })
  }

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  }

  return (
    <div
      className={cn(
        'bg-card/40 mx-auto w-full max-w-md rounded-lg p-6 shadow-lg',
        className
      )}
      dir="rtl"
    >
      {!isComplete ? (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium">
                مرحله {step + 1} از {steps.length}
              </span>
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="mb-8 flex justify-between">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.id} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold',
                      i < step
                        ? 'bg-primary text-primary-foreground'
                        : i === step
                        ? 'bg-primary text-primary-foreground ring-primary/30 ring-2'
                        : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {i < step ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="mt-1 hidden text-xs sm:block text-center">
                    {s.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold">{steps[step].title}</h2>
                <p className="text-muted-foreground text-sm">
                  {steps[step].description}
                </p>
                {step === 1 && formData.phone && (
                  <p className="text-sm text-blue-600 mt-2">
                    کد تایید به شماره {formData.phone} ارسال شد
                  </p>
                )}
              </div>

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                {steps[step].fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>

                    {field.type === 'phone' ? (
                      <div dir="ltr">
                        <PhoneInput
                          placeholder={field.placeholder}
                          defaultCountry="IR"
                          disabled={isPending}
                          className={cn(
                            errors[field.name] && 'border-destructive'
                          )}
                          onChange={(value) => {
                            setValue(field.name, value)
                          }}
                          onBlur={register(field.name).onBlur}
                        />
                      </div>
                    ) : field.type === 'otp' ? (
                      <div dir="ltr" className="flex justify-center">
                        <InputOTP
                          key={otpKey}
                          maxLength={6}
                          value={otpValue}
                          onChange={(value) => {
                            const numericValue = value
                              .replace(/\D/g, '')
                              .slice(0, 6)
                            setOtpValue(numericValue)
                            setValue('code', numericValue)
                          }}
                          disabled={isPending}
                          autoComplete="one-time-code"
                          inputMode="numeric"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        {...register(field.name)}
                        disabled={isPending || isSubmitting}
                        className={cn(
                          errors[field.name] && 'border-destructive'
                        )}
                      />
                    )}

                    {errors[field.name] && (
                      <p className="text-destructive text-sm text-center">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                ))}

                {/* OTP Resend Button */}
                {step === 1 && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOtp}
                      disabled={isPending}
                      className="text-sm"
                    >
                      ارسال مجدد کد تایید
                    </Button>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={step === 0 || isPending}
                    className={cn(step === 0 && 'invisible')}
                  >
                    <ArrowRight className="ml-2 h-4 w-4" /> قبلی
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      isPending ||
                      isSubmitting ||
                      (step === 1 && otpValue.length !== 6)
                    }
                  >
                    {step === steps.length - 1 ? (
                      isSubmitting ? (
                        'در حال ثبت...'
                      ) : (
                        'تکمیل ثبت‌نام'
                      )
                    ) : isPending ? (
                      step === 0 ? (
                        'در حال ارسال...'
                      ) : (
                        'در حال بررسی...'
                      )
                    ) : (
                      <>
                        <ArrowLeft className="mr-2 h-4 w-4" /> بعدی
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="py-10 text-center"
        >
          <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">ثبت‌نام موفقیت‌آمیز!</h2>
          <p className="text-muted-foreground mb-6">
            ثبت‌نام شما با موفقیت انجام شد. به زودی با شما تماس خواهیم گرفت.
          </p>
          <Button
            onClick={() => {
              setStep(0)
              setFormData({})
              setIsComplete(false)
              setOtpValue('')
              setOtpKey(0)
              reset({})
            }}
          >
            شروع مجدد
          </Button>
        </motion.div>
      )}
    </div>
  )
}

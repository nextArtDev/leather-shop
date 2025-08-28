'use client'

import { Button } from '@/components/ui/button'
import {
  CropIcon,
  RotateCcwIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Slot } from 'radix-ui'
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
  type ReactCropProps,
} from 'react-image-crop'
import { Swiper, SwiperSlide } from 'swiper/react'
import type SwiperType from 'swiper'
import { Pagination } from 'swiper/modules'
import { cn } from '@/lib/utils'

import 'react-image-crop/dist/ReactCrop.css'
import 'swiper/css'
import 'swiper/css/pagination'

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
): PercentCrop =>
  centerCrop(
    aspect
      ? makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          mediaWidth,
          mediaHeight
        )
      : { x: 0, y: 0, width: 90, height: 90, unit: '%' },
    mediaWidth,
    mediaHeight
  )

const getCroppedPngImage = async (
  imageSrc: HTMLImageElement,
  scaleFactor: number,
  pixelCrop: PixelCrop,
  maxImageSize: number
): Promise<string> => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Context is null, this should never happen.')
  }

  const scaleX = imageSrc.naturalWidth / imageSrc.width
  const scaleY = imageSrc.naturalHeight / imageSrc.height

  ctx.imageSmoothingEnabled = false
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    imageSrc,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  )

  const croppedImageUrl = canvas.toDataURL('image/png')
  const response = await fetch(croppedImageUrl)
  const blob = await response.blob()

  if (blob.size > maxImageSize) {
    return await getCroppedPngImage(
      imageSrc,
      scaleFactor * 0.9,
      pixelCrop,
      maxImageSize
    )
  }

  return croppedImageUrl
}

type ImageInput = File | string

type ImageSliderCropContextType = {
  images: ImageInput[]
  maxImageSize: number
  currentIndex: number
  crops: (PercentCrop | undefined)[]
  completedCrops: (PixelCrop | null)[]
  imgRefs: RefObject<(HTMLImageElement | null)[]>
  onCrop?: (croppedImages: { [index: number]: string }) => void
  reactCropProps: Omit<ReactCropProps, 'onChange' | 'onComplete' | 'children'>
  setCurrentIndex: (index: number) => void
  handleChange: (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop,
    index: number
  ) => void
  handleComplete: (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop,
    index: number
  ) => Promise<void>
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>, index: number) => void
  applyCrop: (index?: number) => Promise<void>
  applyAllCrops: () => Promise<void>
  resetCrop: (index?: number) => void
  resetAllCrops: () => void
}

const ImageSliderCropContext = createContext<ImageSliderCropContextType | null>(
  null
)

const useImageSliderCrop = () => {
  const context = useContext(ImageSliderCropContext)
  if (!context) {
    throw new Error(
      'ImageSliderCrop components must be used within ImageSliderCrop'
    )
  }
  return context
}

export type ImageSliderCropProps = {
  images: ImageInput[]
  maxImageSize?: number
  onCrop?: (croppedImages: { [index: number]: string }) => void
  children: ReactNode
  onChange?: ReactCropProps['onChange']
  onComplete?: ReactCropProps['onComplete']
  className?: string
} & Omit<ReactCropProps, 'onChange' | 'onComplete' | 'children'>

export const ImageSliderCrop = ({
  images,
  maxImageSize = 1024 * 1024 * 5,
  onCrop,
  children,
  onChange,
  onComplete,
  className,
  ...reactCropProps
}: ImageSliderCropProps) => {
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [crops, setCrops] = useState<(PercentCrop | undefined)[]>(
    new Array(images.length).fill(undefined)
  )
  const [completedCrops, setCompletedCrops] = useState<(PixelCrop | null)[]>(
    new Array(images.length).fill(null)
  )
  const [initialCrops, setInitialCrops] = useState<(PercentCrop | undefined)[]>(
    new Array(images.length).fill(undefined)
  )

  useEffect(() => {
    imgRefs.current = imgRefs.current.slice(0, images.length)
    setCrops(new Array(images.length).fill(undefined))
    setCompletedCrops(new Array(images.length).fill(null))
    setInitialCrops(new Array(images.length).fill(undefined))
  }, [images.length])

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>, index: number) => {
      const { width, height } = e.currentTarget
      const newCrop = centerAspectCrop(width, height, reactCropProps.aspect)

      setCrops((prev) => {
        const updated = [...prev]
        updated[index] = newCrop
        return updated
      })

      setInitialCrops((prev) => {
        const updated = [...prev]
        updated[index] = newCrop
        return updated
      })
    },
    [reactCropProps.aspect]
  )

  const handleChange = (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop,
    index: number
  ) => {
    setCrops((prev) => {
      const updated = [...prev]
      updated[index] = percentCrop
      return updated
    })
    onChange?.(pixelCrop, percentCrop)
  }

  const handleComplete = async (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop,
    index: number
  ) => {
    setCompletedCrops((prev) => {
      const updated = [...prev]
      updated[index] = pixelCrop
      return updated
    })
    onComplete?.(pixelCrop, percentCrop)
  }

  const applyCrop = async (index?: number) => {
    const targetIndex = index ?? currentIndex
    const imgRef = imgRefs.current[targetIndex]
    const completedCrop = completedCrops[targetIndex]

    if (!(imgRef && completedCrop)) {
      return
    }

    const croppedImage = await getCroppedPngImage(
      imgRef,
      1,
      completedCrop,
      maxImageSize
    )

    onCrop?.({ [targetIndex]: croppedImage })
  }

  const applyAllCrops = async () => {
    const croppedImages: { [index: number]: string } = {}

    for (let i = 0; i < images.length; i++) {
      const imgRef = imgRefs.current[i]
      const completedCrop = completedCrops[i]

      if (imgRef && completedCrop) {
        const croppedImage = await getCroppedPngImage(
          imgRef,
          1,
          completedCrop,
          maxImageSize
        )
        croppedImages[i] = croppedImage
      }
    }

    if (Object.keys(croppedImages).length > 0) {
      onCrop?.(croppedImages)
    }
  }

  const resetCrop = (index?: number) => {
    const targetIndex = index ?? currentIndex
    const initialCrop = initialCrops[targetIndex]

    if (initialCrop) {
      setCrops((prev) => {
        const updated = [...prev]
        updated[targetIndex] = initialCrop
        return updated
      })

      setCompletedCrops((prev) => {
        const updated = [...prev]
        updated[targetIndex] = null
        return updated
      })
    }
  }

  const resetAllCrops = () => {
    setCrops([...initialCrops])
    setCompletedCrops(new Array(images.length).fill(null))
  }

  const contextValue: ImageSliderCropContextType = {
    images,
    maxImageSize,
    currentIndex,
    crops,
    completedCrops,
    imgRefs,
    onCrop,
    reactCropProps,
    setCurrentIndex,
    handleChange,
    handleComplete,
    onImageLoad,
    applyCrop,
    applyAllCrops,
    resetCrop,
    resetAllCrops,
  }

  return (
    <ImageSliderCropContext.Provider value={contextValue}>
      <div className={cn('relative', className)}>{children}</div>
    </ImageSliderCropContext.Provider>
  )
}

export type ImageSliderCropContentProps = {
  style?: CSSProperties
  className?: string
  showControls?: boolean
}

export const ImageSliderCropContent = ({
  style,
  className,
  showControls = true,
}: ImageSliderCropContentProps) => {
  const {
    images,
    currentIndex,
    crops,
    handleChange,
    handleComplete,
    onImageLoad,
    imgRefs,
    reactCropProps,
    setCurrentIndex,
  } = useImageSliderCrop()

  const [swiper, setSwiper] = useState<null | SwiperType>(null)
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: currentIndex === images.length - 1,
  })

  const [imageSrcs, setImageSrcs] = useState<string[]>([])

  // Check if cropping is active (has aspect ratio)
  const isCropping = !!reactCropProps.aspect

  // Load all images (handle both Files and URLs)
  useEffect(() => {
    const loadImages = async () => {
      const srcs = await Promise.all(
        images.map((image) => {
          if (typeof image === 'string') {
            // It's already a URL
            return Promise.resolve(image)
          } else {
            // It's a File, need to convert to data URL
            return new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.addEventListener('load', () =>
                resolve(reader.result?.toString() || '')
              )
              reader.readAsDataURL(image)
            })
          }
        })
      )
      setImageSrcs(srcs)
    }

    loadImages()
  }, [images])

  useEffect(() => {
    const updateSlideConfig = () => {
      if (swiper) {
        setSlideConfig({
          isBeginning: swiper.isBeginning,
          isEnd: swiper.isEnd,
        })
      }
    }

    if (swiper) {
      swiper.on('slideChange', () => {
        setCurrentIndex(swiper.activeIndex)
        updateSlideConfig()
      })

      // Initial update
      updateSlideConfig()
    }

    return () => {
      if (swiper) {
        swiper.off('slideChange')
      }
    }
  }, [swiper, setCurrentIndex])

  const shadcnStyle = {
    '--rc-border-color': 'var(--color-border)',
    '--rc-focus-color': 'var(--color-primary)',
  } as CSSProperties

  const activeStyles =
    'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300'
  const inactiveStyles = 'hidden text-gray-400'

  return (
    <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-sm sm:rounded-md">
      {showControls && !isCropping && (
        <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.preventDefault()
              swiper?.slidePrev()
            }}
            className={cn(activeStyles, 'left-3 transition', {
              [inactiveStyles]: slideConfig.isBeginning,
              'hover:bg-primary-300 text-primary-800 opacity-100':
                !slideConfig.isBeginning,
            })}
            aria-label="previous image"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-700" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              swiper?.slideNext()
            }}
            className={cn(activeStyles, 'right-3 transition', {
              [inactiveStyles]: slideConfig.isEnd,
              'hover:bg-primary-300 text-primary-800 opacity-100':
                !slideConfig.isEnd,
            })}
            aria-label="next image"
          >
            <ChevronRight className="h-4 w-4 text-zinc-700" />
          </button>
        </div>
      )}

      <Swiper
        pagination={{
          renderBullet: (_, className) => {
            return `<span class="rounded-full transition ${className}"></span>`
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className="h-full w-full"
        onSlideChange={(swiper) => {
          setCurrentIndex(swiper.activeIndex)
          setSlideConfig({
            isBeginning: swiper.isBeginning,
            isEnd: swiper.isEnd,
          })
        }}
        allowTouchMove={!isCropping}
        allowSlideNext={!isCropping}
        allowSlidePrev={!isCropping}
        touchStartPreventDefault={false}
      >
        {imageSrcs.map((imgSrc, i) => (
          <SwiperSlide key={`slide-${i}`} className="relative h-full w-full">
            <div
              className="h-full w-full"
              style={{
                touchAction: isCropping ? 'none' : 'auto',
                pointerEvents: 'auto',
              }}
              onMouseDown={(e) => isCropping && e.stopPropagation()}
              onTouchStart={(e) => isCropping && e.stopPropagation()}
            >
              <ReactCrop
                className={cn('h-full w-full', className)}
                crop={crops[i]}
                onChange={(pixelCrop, percentCrop) =>
                  handleChange(pixelCrop, percentCrop, i)
                }
                onComplete={(pixelCrop, percentCrop) =>
                  handleComplete(pixelCrop, percentCrop, i)
                }
                style={{
                  ...shadcnStyle,
                  ...style,
                  pointerEvents: isCropping ? 'auto' : 'none',
                }}
                disabled={!isCropping}
                {...reactCropProps}
              >
                {imgSrc && (
                  <img
                    alt={`crop image ${i + 1}`}
                    className="w-full h-full object-contain"
                    onLoad={(e) => onImageLoad(e, i)}
                    ref={(el) => {
                      imgRefs.current[i] = el
                    }}
                    src={imgSrc}
                    draggable={false}
                    style={{
                      userSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </ReactCrop>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export type ImageSliderCropApplyProps = ComponentProps<'button'> & {
  asChild?: boolean
  applyAll?: boolean
}

export const ImageSliderCropApply = ({
  asChild = false,
  children,
  onClick,
  applyAll = false,
  ...props
}: ImageSliderCropApplyProps) => {
  const { applyCrop, applyAllCrops } = useImageSliderCrop()

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (applyAll) {
      await applyAllCrops()
    } else {
      await applyCrop()
    }
    onClick?.(e)
  }

  if (asChild) {
    return (
      <Slot.Root onClick={handleClick} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <Button onClick={handleClick} size="icon" variant="ghost" {...props}>
      {children ?? <CropIcon className="size-4" />}
    </Button>
  )
}

export type ImageSliderCropResetProps = ComponentProps<'button'> & {
  asChild?: boolean
  resetAll?: boolean
}

export const ImageSliderCropReset = ({
  asChild = false,
  children,
  onClick,
  resetAll = false,
  ...props
}: ImageSliderCropResetProps) => {
  const { resetCrop, resetAllCrops } = useImageSliderCrop()

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (resetAll) {
      resetAllCrops()
    } else {
      resetCrop()
    }
    onClick?.(e)
  }

  if (asChild) {
    return (
      <Slot.Root onClick={handleClick} {...props}>
        {children}
      </Slot.Root>
    )
  }

  return (
    <Button onClick={handleClick} size="icon" variant="ghost" {...props}>
      {children ?? <RotateCcwIcon className="size-4" />}
    </Button>
  )
}

// Usage example component
export const ImageSliderCropExample = ({
  images,
}: {
  images: ImageInput[]
}) => {
  const [croppedImages, setCroppedImages] = useState<{
    [index: number]: string
  }>({})

  const handleCrop = (images: { [index: number]: string }) => {
    setCroppedImages((prev) => ({ ...prev, ...images }))
    console.log('Cropped images:', images)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <ImageSliderCrop
        images={images}
        onCrop={handleCrop}
        aspect={1} // Square crop
        className="w-full"
      >
        <ImageSliderCropContent />
        <div className="flex justify-center gap-2 mt-4">
          <ImageSliderCropApply>Apply Current</ImageSliderCropApply>
          <ImageSliderCropApply applyAll>Apply All</ImageSliderCropApply>
          <ImageSliderCropReset>Reset Current</ImageSliderCropReset>
          <ImageSliderCropReset resetAll>Reset All</ImageSliderCropReset>
        </div>
      </ImageSliderCrop>

      {/* Display cropped images */}
      {Object.keys(croppedImages).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Cropped Images:</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(croppedImages).map(([index, src]) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <img
                  src={src}
                  alt={`Cropped image ${parseInt(index) + 1}`}
                  className="w-full h-32 object-cover"
                />
                <p className="text-sm text-center py-1">
                  Image {parseInt(index) + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

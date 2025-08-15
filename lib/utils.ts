import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'
import * as locale from 'date-fns/locale/fa-IR'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDistanceLocale = {
  lessThanXSeconds: 'همین الان',
  xSeconds: 'همین الان',
  halfAMinute: 'همین الان',
  lessThanXMinutes: '{{count}} دقیقه',
  xMinutes: '{{count}} دقیقه',
  aboutXHours: '{{count}} ساعت',
  xHours: '{{count}} ساعت',
  xDays: '{{count}} روز',
  aboutXWeeks: '{{count}} هفته',
  xWeeks: '{{count}} هفته',
  aboutXMonths: '{{count}} ماه',
  xMonths: '{{count}} ماه',
  aboutXYears: '{{count}} سال',
  xYears: '{{count}} سال',
  overXYears: '{{count}} سال',
  almostXYears: '{{count}} سال',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return '' + result
    } else {
      if (result === 'همین الان') return result
      return result + ' پیش '
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export interface Schedule {
  time: string | null

  day: string | null
}

export const getCurrentStartOfDay = (schedule: Schedule[]): Date => {
  const today = new Date()

  const currentDay = today
    .toLocaleString('en-US', { weekday: 'long' })
    .toLowerCase()

  const foundSchedule = schedule.find((item) => item.day === currentDay)

  if (foundSchedule && foundSchedule.time) {
    const [hours, minutes] = foundSchedule.time.split(':').map(Number)

    today.setHours(hours, minutes, 0, 0)
  } else {
    today.setHours(0, 0, 0, 0)
  }

  return today
}

export const getCurrentTime = (): string => {
  const now = new Date()
  const hours: string = String(now.getHours()).padStart(2, '0')
  const minutes: string = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const compareTimeStrings = (time1: string, time2: string) => {
  const [hour1, minute1] = time1.split(':').map(Number)
  const [hour2, minute2] = time2.split(':').map(Number)

  return hour1 > hour2 || (hour1 === hour2 && minute1 > minute2)
}

//Price Post

interface CourierInfo {
  courier_code: string
  service_type: string
  payment_type: string
}

interface ParcelProperties {
  height: number
  width: number
  length: number
  box_type_id: number
  total_weight: number
  total_value: number
}
export interface ShippingCalculationRequest {
  courier: CourierInfo
  from_city_code: number
  to_city_code: number
  parcel_properties: ParcelProperties
  has_collection?: boolean
  has_distribution?: boolean
  value_added_service?: number[]
}

export interface ShippingCalculationResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

// Predefined courier options (you can expand this based on Postex documentation)
export const COURIER_CODES = {
  POSTEX: 'postex',
  POST: 'post',
  TIPAX: 'tipax',
  CHAPAR: 'chapar',
}

export const SERVICE_TYPES = {
  NORMAL: 'normal',
  EXPRESS: 'express',
  SUPER_EXPRESS: 'super_express',
}

export const PAYMENT_TYPES = {
  PREPAID: 'prepaid',
  POSTPAID: 'postpaid',
  COD: 'cod', // Cash on Delivery
}

export const BOX_TYPES = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
  EXTRA_LARGE: 4,
  CUSTOM: 5,
}
export function validateShippingRequest(
  request: ShippingCalculationRequest
): string | null {
  if (!request.courier?.courier_code) {
    return 'Courier code is required'
  }

  if (!request.courier?.service_type) {
    return 'Service type is required'
  }

  if (!request.courier?.payment_type) {
    return 'Payment type is required'
  }

  if (!request.from_city_code || request.from_city_code <= 0) {
    return 'Valid from city code is required'
  }

  if (!request.to_city_code || request.to_city_code <= 0) {
    return 'Valid to city code is required'
  }

  if (!request.parcel_properties) {
    return 'Parcel properties are required'
  }

  const { parcel_properties } = request

  if (!parcel_properties.height || parcel_properties.height <= 0) {
    return 'Valid parcel height is required'
  }

  if (!parcel_properties.width || parcel_properties.width <= 0) {
    return 'Valid parcel width is required'
  }

  if (!parcel_properties.length || parcel_properties.length <= 0) {
    return 'Valid parcel length is required'
  }

  if (!parcel_properties.total_weight || parcel_properties.total_weight <= 0) {
    return 'Valid total weight is required'
  }

  if (!parcel_properties.box_type_id || parcel_properties.box_type_id <= 0) {
    return 'Valid box type ID is required'
  }

  if (parcel_properties.total_value < 0) {
    return 'Total value cannot be negative'
  }

  return null
}

// Helper function to create a shipping request with sensible defaults
export function createShippingRequest({
  courierCode = COURIER_CODES.POSTEX,
  serviceType = SERVICE_TYPES.NORMAL,
  paymentType = PAYMENT_TYPES.PREPAID,
  fromCityCode,
  toCityCode,
  dimensions,
  weight,
  value = 0,
  boxTypeId = BOX_TYPES.MEDIUM,
  hasCollection = true,
  hasDistribution = true,
  valueAddedServices = [],
}: {
  courierCode?: string
  serviceType?: string
  paymentType?: string
  fromCityCode: number
  toCityCode: number
  dimensions: { height: number; width: number; length: number }
  weight: number
  value?: number
  boxTypeId?: number
  hasCollection?: boolean
  hasDistribution?: boolean
  valueAddedServices?: number[]
}): ShippingCalculationRequest {
  return {
    courier: {
      courier_code: courierCode,
      service_type: serviceType,
      payment_type: paymentType,
    },
    from_city_code: fromCityCode,
    to_city_code: toCityCode,
    parcel_properties: {
      height: dimensions.height,
      width: dimensions.width,
      length: dimensions.length,
      box_type_id: boxTypeId,
      total_weight: weight,
      total_value: value,
    },
    has_collection: hasCollection,
    has_distribution: hasDistribution,
    value_added_service: valueAddedServices,
  }
}

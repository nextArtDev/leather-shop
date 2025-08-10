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

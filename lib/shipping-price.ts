// --- Data Structures based on Iran's Geography ---

// A simple list of provinces in Persian
const provinces: string[] = [
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'اردبیل',
  'اصفهان',
  'البرز',
  'ایلام',
  'بوشهر',
  'تهران',
  'چهارمحال و بختیاری',
  'خراسان جنوبی',
  'خراسان رضوی',
  'خراسان شمالی',
  'خوزستان',
  'زنجان',
  'سمنان',
  'سیستان و بلوچستان',
  'فارس',
  'قزوین',
  'قم',
  'کردستان',
  'کرمان',
  'کرمانشاه',
  'کهگیلویه و بویراحمد',
  'گلستان',
  'گیلان',
  'لرستان',
  'مازندران',
  'مرکزی',
  'هرمزگان',
  'همدان',
  'یزد',
]

// Adjacency list for provinces to determine shipping category
const provinceAdjacency: Record<string, string[]> = {
  'آذربایجان شرقی': ['آذربایجان غربی', 'اردبیل', 'زنجان'],
  'آذربایجان غربی': ['آذربایجان شرقی', 'کردستان', 'زنجان'],
  اردبیل: ['آذربایجان شرقی', 'زنجان', 'گیلان'],
  اصفهان: [
    'یزد',
    'فارس',
    'کهگیلویه و بویراحمد',
    'چهارمحال و بختیاری',
    'لرستان',
    'مرکزی',
    'قم',
    'سمنان',
    'خراسان جنوبی',
  ],
  البرز: ['تهران', 'قزوین', 'مازندران', 'مرکزی'],
  ایلام: ['خوزستان', 'لرستان', 'کرمانشاه'],
  بوشهر: ['خوزستان', 'کهگیلویه و بویراحمد', 'فارس', 'هرمزگان'],
  تهران: ['البرز', 'مازندران', 'سمنان', 'قم', 'مرکزی'],
  'چهارمحال و بختیاری': ['اصفهان', 'کهگیلویه و بویراحمد', 'خوزستان', 'لرستان'],
  'خراسان جنوبی': [
    'خراسان رضوی',
    'یزد',
    'کرمان',
    'سیستان و بلوچستان',
    'اصفهان',
    'سمنان',
  ],
  'خراسان رضوی': ['خراسان شمالی', 'خراسان جنوبی', 'سمنان', 'یزد'],
  'خراسان شمالی': ['خراسان رضوی', 'سمنان', 'گلستان'],
  خوزستان: [
    'ایلام',
    'لرستان',
    'چهارمحال و بختیاری',
    'کهگیلویه و بویراحمد',
    'بوشهر',
  ],
  زنجان: [
    'آذربایجان شرقی',
    'آذربایجان غربی',
    'اردبیل',
    'گیلان',
    'قزوین',
    'کردستان',
    'همدان',
  ],
  سمنان: [
    'تهران',
    'قم',
    'اصفهان',
    'یزد',
    'خراسان رضوی',
    'خراسان جنوبی',
    'خراسان شمالی',
    'گلستان',
    'مازندران',
  ],
  'سیستان و بلوچستان': ['خراسان جنوبی', 'کرمان', 'هرمزگان'],
  فارس: ['اصفهان', 'یزد', 'کرمان', 'هرمزگان', 'بوشهر', 'کهگیلویه و بویراحمد'],
  قزوین: ['گیلان', 'مازندران', 'البرز', 'مرکزی', 'همدان', 'زنجان'],
  قم: ['تهران', 'سمنان', 'اصفهان', 'مرکزی'],
  کردستان: ['آذربایجان غربی', 'زنجان', 'همدان', 'کرمانشاه'],
  کرمان: ['یزد', 'خراسان جنوبی', 'سیستان و بلوچستان', 'هرمزگان', 'فارس'],
  کرمانشاه: ['کردستان', 'همدان', 'لرستان', 'ایلام'],
  'کهگیلویه و بویراحمد': [
    'چهارمحال و بختیاری',
    'اصفهان',
    'فارس',
    'بوشهر',
    'خوزستان',
  ],
  گلستان: ['مازندران', 'سمنان', 'خراسان شمالی'],
  گیلان: ['اردبیل', 'زنجان', 'قزوین', 'مازندران'],
  لرستان: [
    'کرمانشاه',
    'همدان',
    'مرکزی',
    'اصفهان',
    'چهارمحال و بختیاری',
    'خوزستان',
    'ایلام',
  ],
  مازندران: ['گیلان', 'قزوین', 'البرز', 'تهران', 'سمنان', 'گلستان'],
  مرکزی: ['قزوین', 'البرز', 'تهران', 'قم', 'اصفهان', 'لرستان', 'همدان'],
  هرمزگان: ['سیستان و بلوچستان', 'کرمان', 'فارس', 'بوشهر'],
  همدان: ['کردستان', 'زنجان', 'قزوین', 'مرکزی', 'لرستان', 'کرمانشاه'],
  یزد: ['سمنان', 'خراسان رضوی', 'خراسان جنوبی', 'کرمان', 'فارس', 'اصفهان'],
}

// List of metropolitan cities for surcharge calculation (excluding Tehran/Karaj which have a separate rule)
const metropolitanCities: Record<
  string,
  { isCapital: boolean; type: 'tehran_alborz' | 'metro' }
> = {
  تهران: { isCapital: true, type: 'tehran_alborz' },
  کرج: { isCapital: true, type: 'tehran_alborz' },
  مشهد: { isCapital: true, type: 'metro' },
  اصفهان: { isCapital: true, type: 'metro' },
  تبریز: { isCapital: true, type: 'metro' },
  شیراز: { isCapital: true, type: 'metro' },
  اهواز: { isCapital: true, type: 'metro' },
  قم: { isCapital: true, type: 'metro' },
}
type GeographicCategory =
  | 'درون استانی'
  | 'برون استانی همجوار'
  | 'برون استانی غیر همجوار'

interface PackageDimensions {
  lengthCm: number
  widthCm: number
  heightCm: number
}

interface ShippingArgs {
  originProvince: string
  destinationProvince: string
  destinationCity: string
  actualWeightInGrams: number
  productValueInRials: number
  dimensions: PackageDimensions
  includePickupService?: boolean // Optional: whether to add pickup fee
  handlingFeeInRials?: number // Optional: your fixed handling fee
}

interface CostBreakdown {
  chargeableWeightInGrams: number
  baseRate: number
  insuranceFee: number
  metropolitanSurcharge: number
  nonStandardDimensionSurcharge: number
  pickupFee: number
  handlingFee: number
  finalCost: number
  notes: string[]
}

// --- Main Calculation Function (Final Version) ---

export function calculateComprehensiveShippingCost(
  args: ShippingArgs
): CostBreakdown {
  const {
    originProvince,
    destinationProvince,
    destinationCity,
    actualWeightInGrams,
    productValueInRials,
    dimensions,
    includePickupService = false,
    handlingFeeInRials = 0,
  } = args

  const notes: string[] = []

  // ;[cite_start] // 1. Determine Chargeable Weight (Actual vs. Volumetric) [cite: 136]
  const volumetricWeightInGrams =
    ((dimensions.lengthCm * dimensions.widthCm * dimensions.heightCm) / 6000) *
    1000
  const chargeableWeightInGrams = Math.max(
    actualWeightInGrams,
    volumetricWeightInGrams
  )
  if (volumetricWeightInGrams > actualWeightInGrams) {
    notes.push(
      `وزن حجمی (${Math.round(
        volumetricWeightInGrams / 1000
      )}kg) بیشتر از وزن واقعی بود و ملاک محاسبه قرار گرفت.`
    )
  }

  // 2. Determine Geographic Category
  let category: GeographicCategory
  if (originProvince === destinationProvince) {
    category = 'درون استانی'
  } else if (provinceAdjacency[originProvince]?.includes(destinationProvince)) {
    category = 'برون استانی همجوار'
  } else {
    category = 'برون استانی غیر همجوار'
  }

  // ;[cite_start] // 3. Calculate Base Rate for Pish-taz Service [cite: 127]
  let baseRate = 0
  const chargeableWeightInKg = Math.ceil(chargeableWeightInGrams / 1000)

  if (chargeableWeightInGrams <= 500) {
    const rates = {
      'درون استانی': 215000,
      'برون استانی همجوار': 265000,
      'برون استانی غیر همجوار': 375000,
    }
    baseRate = rates[category]
  } else if (chargeableWeightInGrams <= 1000) {
    const rates = {
      'درون استانی': 280000,
      'برون استانی همجوار': 400000,
      'برون استانی غیر همجوار': 457500,
    }
    baseRate = rates[category]
  } else {
    baseRate = {
      'درون استانی': 280000,
      'برون استانی همجوار': 400000,
      'برون استانی غیر همجوار': 457500,
    }[category]
    const additionalKgRates = {
      'درون استانی': 85000,
      'برون استانی همجوار': 90000,
      'برون استانی غیر همجوار': 105400,
    }
    const additionalKgs = chargeableWeightInKg - 1
    baseRate += additionalKgs * additionalKgRates[category]
  }

  // 4. Calculate Surcharges based on the Base Rate
  // 4a. [cite_start]Metropolitan Surcharge [cite: 159]
  let metropolitanSurcharge = 0
  const destCityInfo = metropolitanCities[destinationCity]
  const destProvince =
    destinationProvince === 'البرز' ? 'کرج' : destinationProvince // Handle Alborz

  if (destCityInfo?.type === 'tehran_alborz' || destProvince === 'تهران') {
    metropolitanSurcharge = baseRate * 0.2
  } else if (destCityInfo?.type === 'metro') {
    metropolitanSurcharge = baseRate * 0.15
  }

  // 4b. [cite_start]Non-Standard Dimension Surcharge [cite: 134]
  let nonStandardDimensionSurcharge = 0
  const standardLength = 35,
    standardWidth = 25,
    standardHeight = 18
  if (
    dimensions.lengthCm > standardLength ||
    dimensions.widthCm > standardWidth ||
    dimensions.heightCm > standardHeight
  ) {
    // A simple implementation: assume 100% surcharge for any dimension exceeding standard.
    // For a more precise rule, the volume ratio needs to be calculated.
    nonStandardDimensionSurcharge = baseRate * 1.0 // 100% surcharge
    notes.push(`بسته شامل جریمه ابعاد غیر استاندارد (۱۰۰٪ هزینه پایه) شد.`)
  }

  // 5. Calculate other Fees
  // 5a. [cite_start]Insurance Fee [cite: 140]
  let insuranceFee = 0
  if (productValueInRials > 0 && productValueInRials <= 300000000) {
    insuranceFee = productValueInRials * 0.002
  } else if (productValueInRials > 300000000) {
    // Add logic for higher value items based on the tariff if needed
    insuranceFee = productValueInRials * 0.0025 // Example for 300-500M bracket
  }

  // 5b. [cite_start]Pickup Fee [cite: 134]
  let pickupFee = 0
  if (includePickupService) {
    // Assuming origin is a metropolitan city for this example
    pickupFee = 165000
  }

  // 6. Final Calculation
  const finalCost =
    baseRate +
    insuranceFee +
    metropolitanSurcharge +
    nonStandardDimensionSurcharge +
    pickupFee +
    handlingFeeInRials

  return {
    chargeableWeightInGrams: Math.round(chargeableWeightInGrams),
    baseRate: Math.ceil(baseRate),
    insuranceFee: Math.ceil(insuranceFee),
    metropolitanSurcharge: Math.ceil(metropolitanSurcharge),
    nonStandardDimensionSurcharge: Math.ceil(nonStandardDimensionSurcharge),
    pickupFee: Math.ceil(pickupFee),
    handlingFee: Math.ceil(handlingFeeInRials),
    finalCost: Math.ceil(finalCost),
    notes: notes,
  }
}

// --- Example Usage ---

const myOrder = {
  originProvince: 'تهران',
  destinationProvince: 'فارس',
  destinationCity: 'شیراز',
  actualWeightInGrams: 1500, // 1.5 kg
  productValueInRials: 30000000, // 3 million Toman
  dimensions: {
    lengthCm: 40, // Non-standard length
    widthCm: 30, // Non-standard width
    heightCm: 20, // Non-standard height
  },
  includePickupService: true, // We want the post to pick it up from us
  handlingFeeInRials: 70000, // Our fixed handling fee is 7,000 Toman
}

const finalPriceDetails = calculateComprehensiveShippingCost(myOrder)

console.log('--- جزئیات هزینه ارسال ---')
console.log(`وزن محاسباتی: ${finalPriceDetails.chargeableWeightInGrams} گرم`)
console.log(
  `هزینه پایه پست (پیشتاز): ${finalPriceDetails.baseRate.toLocaleString()} ریال`
)
console.log(
  `هزینه بیمه (۰.۲٪): ${finalPriceDetails.insuranceFee.toLocaleString()} ریال`
)
console.log(
  `اضافه نرخ کلان‌شهر (شیراز): ${finalPriceDetails.metropolitanSurcharge.toLocaleString()} ریال`
)
console.log(
  `جریمه ابعاد غیر استاندارد: ${finalPriceDetails.nonStandardDimensionSurcharge.toLocaleString()} ریال`
)
console.log(
  `هزینه جمع‌آوری از محل: ${finalPriceDetails.pickupFee.toLocaleString()} ریال`
)
console.log(
  `هزینه پردازش و بسته‌بندی شما: ${finalPriceDetails.handlingFee.toLocaleString()} ریال`
)
console.log('---------------------------------')
console.log(
  `هزینه نهایی برای مشتری: ${finalPriceDetails.finalCost.toLocaleString()} ریال`
)
console.log('\nیادداشت‌ها:')
finalPriceDetails.notes.forEach((note) => console.log(`- ${note}`))

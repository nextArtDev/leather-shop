'use server'

import {
  COURIER_CODES,
  //   createShippingRequest,
  SERVICE_TYPES,
  ShippingCalculationRequest,
  ShippingCalculationResponse,
  validateShippingRequest,
} from '@/lib/utils'

export async function getProvinces() {
  const apiKey = process.env.POSTEX_API_KEY
  try {
    const response = await fetch(
      'https://api.postex.ir/api/v1/locality/provinces',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch provinces')
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getCityByProvinceCode(provinceCode: number) {
  const apiKey = process.env.POSTEX_API_KEY
  try {
    const response = await fetch(
      `https://api.postex.ir/api/v1/locality/cities/${provinceCode}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch provinces')
    }

    const data = await response.json()

    return data
  } catch (error) {
    return console.error(error)
  }
}
export async function getCityByCode(cityCode: number) {
  const apiKey = process.env.POSTEX_API_KEY
  try {
    const response = await fetch(
      `https://api.postex.ir/api/v1/locality/cities/${cityCode}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch provinces')
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

// Calculation Price
interface CourierData {
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

interface ShippingCalculationRequest {
  courier: CourierData
  from_city_code: number
  to_city_code: number
  parcel_properties: ParcelProperties
  has_collection: boolean
  has_distribution: boolean
  value_added_service: number[]
}

// Response types (you may need to adjust based on actual API response)
interface ShippingCalculationResponse {
  success: boolean
  data?: {
    price: number
    delivery_time?: string
    service_details?: any
  }
  error?: string
  message?: string
}

export async function calculateShippingPrice(
  requestData: ShippingCalculationRequest
): Promise<ShippingCalculationResponse> {
  const API_URL = 'https://api.postex.ir/api/v1/parcels/mark-ready'
  const API_KEY = process.env.POSTEX_API_KEY

  // Validate API key
  if (!API_KEY) {
    console.error('POSTEX_API_KEY environment variable is not set')
    return {
      success: false,
      error: 'API configuration error',
    }
  }

  // Validate required fields
  if (
    !requestData.courier?.courier_code ||
    !requestData.from_city_code ||
    !requestData.to_city_code ||
    !requestData.parcel_properties?.total_weight
  ) {
    return {
      success: false,
      error:
        'Missing required fields: courier_code, from_city_code, to_city_code, or total_weight',
    }
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)

      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        message: errorText,
      }
    }

    const data = await response.json()

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error('Fetch error:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// Helper function to create a shipping request with default values
function createShippingRequest(
  params: Partial<ShippingCalculationRequest>
): ShippingCalculationRequest {
  return {
    courier: {
      courier_code: params.courier?.courier_code || '',
      service_type: params.courier?.service_type || 'normal',
      payment_type: params.courier?.payment_type || 'prepaid',
    },
    from_city_code: params.from_city_code || 0,
    to_city_code: params.to_city_code || 0,
    parcel_properties: {
      height: params.parcel_properties?.height || 0,
      width: params.parcel_properties?.width || 0,
      length: params.parcel_properties?.length || 0,
      box_type_id: params.parcel_properties?.box_type_id || 0,
      total_weight: params.parcel_properties?.total_weight || 0,
      total_value: params.parcel_properties?.total_value || 0,
    },
    has_collection: params.has_collection ?? true,
    has_distribution: params.has_distribution ?? true,
    value_added_service: params.value_added_service || [],
  }
}

// Example usage function
export async function getShippingQuote(
  courierCode: string,
  fromCityCode: number,
  toCityCode: number,
  weight: number,
  dimensions: { height: number; width: number; length: number },
  value: number = 0
) {
  const shippingRequest = createShippingRequest({
    courier: {
      courier_code: courierCode,
      service_type: 'normal',
      payment_type: 'prepaid',
    },
    from_city_code: fromCityCode,
    to_city_code: toCityCode,
    parcel_properties: {
      height: dimensions.height,
      width: dimensions.width,
      length: dimensions.length,
      total_weight: weight,
      total_value: value,
      box_type_id: 1, // You may need to adjust this based on your box types
    },
  })

  return await calculateShippingPrice(shippingRequest)
}

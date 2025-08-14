export const getDominantColors = async (
  imageUrl: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = extractColorsFromImageData(imageData)
        resolve(colors)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

const extractColorsFromImageData = (imageData: ImageData): string[] => {
  const data = imageData.data
  const colorMap = new Map<string, number>()

  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    // Skip transparent pixels
    if (a < 128) continue

    // Convert to hex
    const hex = rgbToHex(r, g, b)
    colorMap.set(hex, (colorMap.get(hex) || 0) + 1)
  }

  // Sort by frequency and return top 5 colors
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color)
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export const getGridClassName = (count: number): string => {
  switch (count) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-2'
    case 3:
      return 'grid-cols-3'
    case 4:
      return 'grid-cols-2 grid-rows-2'
    case 5:
      return 'grid-cols-3 grid-rows-2'
    default:
      return 'grid-cols-3'
  }
}

// Extended File interface to include extracted colors
export interface FileWithColors extends File {
  extractedColors?: string[]
  selectedColors?: string[]
}

// Helper to create FileWithColors
export const createFileWithColors = (
  file: File,
  extractedColors: string[] = [],
  selectedColors: string[] = []
): FileWithColors => {
  const fileWithColors = file as FileWithColors
  fileWithColors.extractedColors = extractedColors
  fileWithColors.selectedColors = selectedColors
  return fileWithColors
}

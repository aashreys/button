export interface Size {

  name: string
  fontSize: number
  iconSize: number
  iconSpacing: number
  horizontalPadding: number
  verticalPadding: number
  cornerRadius: number
  strokeWidth: number
  shadowDepth: number
  outerPadding: number

}

export module Sizes {

  const SIZE_ATOMIC: Size = createSize('Atomic', 14)

  const SIZE_TINY: Size = createSize('Tiny', 21)

  const SIZE_SMALL: Size = createSize('Small', 32)

  const SIZE_MEDIUM: Size = createSize('Medium', 48)

  const SIZE_LARGE: Size = createSize('Large', 72)

  const SIZE_HUGE: Size = createSize('Huge', 108)

  const SIZE_TITANIC: Size = createSize('Titanic', 162)

  const SIZE_COLOSSAL: Size = createSize('Colossal', 243)

  const SIZE_PLANETARY: Size = createSize('Planetary', 546)

  const SIZE_GALACTIC: Size = createSize('Galactic', 820)

  const SIZE_COSMIC: Size = createSize('Cosmic', 1230)

  function createSize(name: string, size: number): Size {
    return {
      name: name,
      fontSize: size,
      iconSize: Math.ceil(size * 1.2),
      iconSpacing: Math.ceil(size * 0.4),
      horizontalPadding: size,
      verticalPadding: size / 2,
      cornerRadius: Math.ceil(size / 1.5),
      strokeWidth: Math.ceil(size / 12),
      shadowDepth: Math.ceil(size / 8),
      outerPadding: Math.ceil(size / 8)
    }
  }
  
  export function getDefaultSize(): Size {
    return SIZE_MEDIUM
  }

  export function getAllSizes(): Size[] {
    return [
      SIZE_ATOMIC,
      SIZE_TINY,
      SIZE_SMALL,
      SIZE_MEDIUM,
      SIZE_LARGE,
      SIZE_HUGE,
      SIZE_TITANIC,
      SIZE_COLOSSAL,
      SIZE_PLANETARY,
      SIZE_GALACTIC,
      SIZE_COSMIC
    ]
  }

  export function findSizeByName(name: string): Size | undefined {
    return Sizes.getAllSizes().find(size => size.name === name) as Size
  }

}
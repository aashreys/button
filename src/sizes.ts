export interface Size {

  name: string
  fontSize: number
  horizontalPadding: number
  verticalPadding: number
  cornerRadius: number
  strokeWidth: number

}

export module Sizes {

  const SIZE_SMALL: Size = createSize('Small', 16)

  const SIZE_MEDIUM: Size = createSize('Medium', 24)

  const SIZE_LARGE: Size = createSize('Large', 48)

  const SIZE_HUGE: Size = createSize('Extra Large', 64)

  const SIZE_TITANIC: Size = createSize('Titanic', 81)

  const SIZE_GARGANTUAN: Size = createSize('Gargantuan', 182)

  const SIZE_INTERPLANETARY: Size = createSize('Interplanetary', 410)

  const SIZE_INTERGALACTIC: Size = createSize('Intergalactic', 922)

  function createSize(name: string, size: number): Size {
    return {
      name: name,
      fontSize: size,
      horizontalPadding: size,
      verticalPadding: size / 2,
      cornerRadius: 1000,
      strokeWidth: Math.ceil(size / 8)
    }
  }
  
  export function getDefaultSize(): Size {
    return SIZE_LARGE
  }

  export function getAllSizes(): Size[] {
    return [
      SIZE_SMALL,
      SIZE_MEDIUM,
      SIZE_LARGE,
      SIZE_HUGE,
      SIZE_TITANIC,
      SIZE_GARGANTUAN,
      SIZE_INTERPLANETARY,
      SIZE_INTERGALACTIC
    ]
  }

}
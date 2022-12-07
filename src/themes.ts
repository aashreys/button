import { useInitialFocus } from "@create-figma-plugin/ui"

export interface Theme {

  name: string,
  primaryColor: HexCode,
  textColor: HexCode,
  hoverTextColor: HexCode

}

export module Themes {

  function createTheme(
    name: string, 
    primaryColor: HexCode, 
    textColor: HexCode,  
    hoverTextColor: HexCode): Theme {
      return {
        name: name,
        primaryColor: primaryColor,
        textColor: textColor,
        hoverTextColor: hoverTextColor
      }
  }

  const BLACK = createTheme('Black', '#1e1e1e', '#333333', '#ffffff')

  const GRAY = createTheme('Gray', '#b3b3b3', '#333333', '#ffffff')

  const RED = createTheme('Red', '#f14722', '#333333', '#ffffff')

  const ORANGE = createTheme('Orange', '#ffa629', '#333333', '#ffffff')

  const YELLOW = createTheme('Yellow', '#ffcd2a', '#333333', '#333333')

  const GREEN = createTheme('Green', '#13ae5c', '#333333', '#ffffff')

  const BLUE = createTheme('Blue', '#0b99ff', '#333333', '#ffffff')

  const VIOLET = createTheme('Violet', '#9748ff', '#333333', '#ffffff')

  const PURPLE = createTheme('Purple', '#7452FF', '#333333', '#ffffff')

  const WHITE = createTheme('White', '#ffffff', '#333333', '#333333')

  const DARK_GRAY = createTheme('Dark Gray', '#757575', '#333333', '#ffffff')

  const LIGHT_GRAY = createTheme('Light Gray', '#e6e6e6', '#333333', '#333333')

  const LIGHT_RED = createTheme('Light Red', '#ffc7c1', '#333333', '#333333')

  const LIGHT_ORANGE = createTheme('Light Orange', '#fcd19c', '#333333', '#333333')

  const LIGHT_YELLOW = createTheme('Light Yellow', '#ffe8a3', '#333333', '#333333')

  const LIGHT_GREEN = createTheme('Light Green', '#aff4c6', '#333333', '#333333')

  const LIGHT_BLUE = createTheme('Light Blue', '#bce3ff', '#333333', '#333333')

  const LIGHT_VIOLET = createTheme('Light Violet', '#e4ccff', '#333333', '#333333')

  export function getAllThemes(): Theme[] {
    return [
      BLACK,
      GRAY,
      RED,
      ORANGE,
      YELLOW,
      GREEN,
      BLUE,
      VIOLET,
      PURPLE,
      WHITE,
      DARK_GRAY,
      LIGHT_GRAY,
      LIGHT_RED,
      LIGHT_ORANGE,
      LIGHT_YELLOW,
      LIGHT_GREEN,
      LIGHT_BLUE,
      LIGHT_VIOLET
    ]
  }

  export function getDefaultTheme(): Theme {
    if (figma.editorType === 'figjam') {
      return PURPLE
    } else {
      return VIOLET
    }
  }

}
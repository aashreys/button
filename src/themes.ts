export interface Theme {

  name: string,
  strokeColor: HexCode,

}

export module Themes {

  const DEFAULT_PURPLE: Theme = {
    name: 'Purple',
    strokeColor: '#7452FF'
  }

  const VIOLET: Theme = {
    name: 'Violet',
    strokeColor: '#9748ff',
  }

  export function getAllThemes(): Theme[] {
    return [
      {
        name: 'Black',
        strokeColor: '#1e1e1e'
      },
      {
        name: 'Gray',
        strokeColor: '#b3b3b3'
      },
      {
        name: 'Red',
        strokeColor: '#f14722'
      },
      {
        name: 'Orange',
        strokeColor: '#ffa629'
      },
      {
        name: 'Yellow',
        strokeColor: '#ffcd2a'
      },
      {
        name: 'Green',
        strokeColor: '#13ae5c'
      },
      {
        name: 'Blue',
        strokeColor: '#0b99ff'
      },
      DEFAULT_PURPLE,
      VIOLET,
      {
        name: 'White',
        strokeColor: '#ffffff'
      },
      {
        name: 'Dark Gray',
        strokeColor: '#757575'
      },
      {
        name: 'Light Gray',
        strokeColor: '#e6e6e6'
      },
      {
        name: 'Light Red',
        strokeColor: '#ffc7c1'
      },
      {
        name: 'Light Orange',
        strokeColor: '#fcd19c'
      },
      {
        name: 'Light Yellow',
        strokeColor: '#ffe8a3'
      },
      {
        name: 'Light Green',
        strokeColor: '#aff4c6'
      },
      {
        name: 'Light Blue',
        strokeColor: '#bce3ff'
      },
      {
        name: 'Light Violet',
        strokeColor: '#e4ccff'
      }
    ]
  }

  export function getDefaultTheme(): Theme {
    return DEFAULT_PURPLE
  }

}
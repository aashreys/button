export interface Theme {

  name: string,
  color: HexCode

}

export module Themes {

  const DEFAULT_VIOLET: Theme = {
    name: 'Violet',
    color: '#9748ff',
  }

  export function getAllThemes(): Theme[] {
    return [
      {
        name: 'Black',
        color: '#1e1e1e'
      },
      {
        name: 'Gray',
        color: '#b3b3b3'
      },
      {
        name: 'Red',
        color: '#f14722'
      },
      {
        name: 'Orange',
        color: '#ffa629'
      },
      {
        name: 'Yellow',
        color: '#ffcd2a'
      },
      {
        name: 'Green',
        color: '#13ae5c'
      },
      {
        name: 'Blue',
        color: '#0b99ff'
      },
      DEFAULT_VIOLET,
      {
        name: 'White',
        color: '#ffffff'
      },
      {
        name: 'Dark Gray',
        color: '#757575'
      },
      {
        name: 'Light Gray',
        color: '#e6e6e6'
      },
      {
        name: 'Light Red',
        color: '#ffc7c1'
      },
      {
        name: 'Light Orange',
        color: '#fcd19c'
      },
      {
        name: 'Light Yellow',
        color: '#ffe8a3'
      },
      {
        name: 'Light Green',
        color: '#aff4c6'
      },
      {
        name: 'Light Blue',
        color: '#bce3ff'
      },
      {
        name: 'Light Violet',
        color: '#e4ccff'
      }
    ]
  }

  export function getDefaultTheme(): Theme {
    return DEFAULT_VIOLET
  }

}
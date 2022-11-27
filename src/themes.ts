export interface Theme extends WidgetPropertyMenuColorSelectorOption {}

export module Themes {

  const DEFAULT_VIOLET: Theme = {
    tooltip: 'Violet',
    option: '#9748ff',
  }

  export function getAllThemes(): Theme[] {
    return [
      {
        tooltip: 'Black',
        option: '#1e1e1e'
      },
      {
        tooltip: 'Gray',
        option: '#b3b3b3'
      },
      {
        tooltip: 'Red',
        option: '#f14722'
      },
      {
        tooltip: 'Orange',
        option: '#ffa629'
      },
      {
        tooltip: 'Yellow',
        option: '#ffcd2a'
      },
      {
        tooltip: 'Green',
        option: '#13ae5c'
      },
      {
        tooltip: 'Blue',
        option: '#0b99ff'
      },
      DEFAULT_VIOLET,
      {
        tooltip: 'White',
        option: '#ffffff'
      },
      {
        tooltip: 'Dark Gray',
        option: '#757575'
      },
      {
        tooltip: 'Light Gray',
        option: '#e6e6e6'
      },
      {
        tooltip: 'Light Red',
        option: '#ffc7c1'
      },
      {
        tooltip: 'Light Orange',
        option: '#fcd19c'
      },
      {
        tooltip: 'Light Yellow',
        option: '#ffe8a3'
      },
      {
        tooltip: 'Light Green',
        option: '#aff4c6'
      },
      {
        tooltip: 'Light Blue',
        option: '#bce3ff'
      },
      {
        tooltip: 'Light Violet',
        option: '#e4ccff'
      }
    ]
  }

  export function getDefaultTheme(): Theme {
    return DEFAULT_VIOLET
  }

}
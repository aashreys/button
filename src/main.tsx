/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable, useEffect } = widget
import { Theme, Themes } from './themes'
import { Size, Sizes } from './sizes'
import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { EVENT_LABEL_UPDATED, EVENT_URL_UPDATED, MSG_SET_URL, MSG_GOTO_LAYER, MSG_OPEN_LINK, MSG_GOTO_VIEW, MSG_GOTO_PAGE } from './constants'
import { LINK_ICON } from './link_icon'
import { TargetResolver as TargetFactory } from './targets/target_resolver'
import { EmptyTarget, Target, TargetType } from './targets/target'
import { Navigator } from './targets/navigator'

export default function () {
  figma.skipInvisibleInstanceChildren = true
  widget.register(Button)
}

export enum UrlType {
  EMPTY, FIGMA, WEB, NODE_NAV
}

function Button() {
  const [target, setTarget] = useSyncedState<Target>('target', new EmptyTarget())
  const [label, setLabel] = useSyncedState('label', '')
  const [theme, setTheme] = useSyncedState('theme', Themes.getDefaultTheme())
  const [size, setSize] = useSyncedState('size', Sizes.getDefaultSize())
  const resolver = new TargetFactory()
  const navigator = new Navigator()
  let listeners: (() => void)[] = []

  function showSettingsUi(message?: string, errorMessage?: string): Promise<void> {
    return new Promise<void>(() => {
      showUI(
        { title: 'Edit URL', height: 144, width: 240 },
        {
          label: label,
          url: target.url,
          message: message ? message : '',
          errorMessage: errorMessage ? errorMessage : ''
        }
      )
    })
  }

  useEffect(() => {
    addListeners()
    return () => removeListeners()
  })

  function addListeners() {
    listeners.push(
      on(EVENT_LABEL_UPDATED, (data) => { setLabel(data.label) }),
      on(EVENT_URL_UPDATED, (data) => {
        try {
          let target = resolver.fromUrl(data.url)
          setTarget(target)
          emit(EVENT_URL_UPDATED, {
            url: target.url,
            message: target.message,
          })
        }
        catch (e: any) {
          emit(EVENT_URL_UPDATED, {
            url: target.url,
            errorMessage: e.message
          })
        }
      })
    )
  }

  function removeListeners() {
    while (listeners.length > 0) {
      let removeCallback = listeners.pop()
      if (removeCallback) removeCallback()
    }
  }

  function closePlugin(message?: string) {
    figma.closePlugin(message)
  }

  function isLabelSet(): boolean {
    return label.length > 0
  }

  function handleClick(): Promise<void> {
    return new Promise<void>((resolve) => {
      navigator.navigateTo(target)
      .then(() => {
        closePlugin()
        resolve()
      })
      .catch((errorMessage?) => {
        showSettingsUi('', errorMessage)
        figma.notify(errorMessage ? errorMessage : '')
      })
    })
  }

  useStickable()

  usePropertyMenu(
    [
      {
        itemType: 'color-selector',
        tooltip: 'Select Color',
        propertyName: 'color',
        options: Themes.getAllThemes().map(theme => { return {
          tooltip: theme.name,
          option: theme.primaryColor
        }}),
        selectedOption: theme.primaryColor
      },
      {
        itemType: 'dropdown',
        tooltip: 'Select Size',
        propertyName: 'size',
        options: Sizes.getAllSizes().map(size => { return {
          option: size.name,
          label: size.name
        }}),
        selectedOption: size.name
      },
      {
        itemType: 'separator'
      },
      {
        itemType: 'action',
        tooltip: 'Edit URL',
        propertyName: 'edit',
        icon: LINK_ICON
      },
    ],
    (event) => { 
      if (event.propertyName === 'color') {
        let theme: Theme = Themes.getAllThemes().find(
          theme => theme.primaryColor === event.propertyValue
        ) as Theme
        setTheme(theme)
      }
      if (event.propertyName === 'size') {
        let size: Size = Sizes.getAllSizes().find(
          size => size.name === event.propertyValue
        ) as Size
        setSize(size)
      }
      if (event.propertyName === 'edit') {
        return showSettingsUi()
      }
    },
  )

  function getButtonLabel(): string {
    let type = target.type
    switch (type) {
      case TargetType.NODE: return isLabelSet() ? label : MSG_GOTO_LAYER
      case TargetType.PAGE: return isLabelSet() ? label : MSG_GOTO_PAGE
      case TargetType.VIEW: return isLabelSet() ? label : MSG_GOTO_VIEW
      case TargetType.WEB: return isLabelSet() ? label : MSG_OPEN_LINK
      case TargetType.EMPTY: 
      default: return MSG_SET_URL
    }
  }

  return (
    <AutoLayout
      name="Fill Container"
      overflow="visible"
      direction="vertical"
      spacing={16}
      padding={{ 
        top: 12,
        bottom: 12 + size.shadowDepth,
        left: 12,
        right: 12
      }}
      horizontalAlignItems="center"
    >
      <AutoLayout
        name="Label Container"
        effect={{
          type: "drop-shadow",
          color: target.type !== TargetType.EMPTY ? theme.primaryColor : "#d9d9d9",
          offset: { x: 0, y: size.shadowDepth },
          blur: 0,
          showShadowBehindNode: false,
        }}
        fill="#ffffff"
        hoverStyle={target.type !== TargetType.EMPTY ? {
          fill: theme.primaryColor
        } : {}}
        stroke={target.type !== TargetType.EMPTY ? theme.primaryColor : "#d9d9d9"}
        cornerRadius={size.cornerRadius}
        strokeWidth={size.strokeWidth}
        overflow="visible"
        padding={{
          vertical: size.verticalPadding,
          horizontal: size.horizontalPadding,
        }}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={handleClick}
      >
        <Text
          name="Label"
          fill={theme.textColor}
          hoverStyle={target.type !== TargetType.EMPTY ? {
            fill: theme.hoverTextColor
          } : {}}
          fontFamily="Inter"
          fontSize={size.fontSize}
          fontWeight={600}
        >
          { getButtonLabel() }
        </Text>
      </AutoLayout>
    </AutoLayout>
  )
}
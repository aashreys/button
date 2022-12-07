/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable, useEffect } = widget
import { Theme, Themes } from './themes'
import { Size, Sizes } from './sizes'
import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { EVENT_LABEL_UPDATED, EVENT_URL_UPDATED, EVENT_SELECTION_SET, EVENT_VIEW_SELECTED, EVENT_ENABLE_NODE_BUTTON, WINDOW_TITLE, EVENT_LAYOUT_UPDATED } from './constants'
import { TargetResolver as TargetFactory } from './targets/targetFactory'
import { Target, TargetType } from './targets/target'
import { EmptyTarget } from "./targets/EmptyTarget"
import { Navigator } from './targets/navigator'
import { SETTINGS_ICON } from './icons/settings_icon'

const WIDTH = 240
const HEIGHT = 144

export default function () {
  figma.skipInvisibleInstanceChildren = true
  widget.register(Button)
}

function Button() {
  const [target, setTarget] = useSyncedState<Target>('target', new EmptyTarget())
  const [label, setLabel] = useSyncedState('label', '')
  const [theme, setTheme] = useSyncedState('theme', Themes.getDefaultTheme())
  const [size, setSize] = useSyncedState('size', Sizes.getDefaultSize())
  const targetFactory = new TargetFactory()
  const navigator = new Navigator()
  const listeners: (() => void)[] = []

  function showSettingsUi(message?: string, errorMessage?: string): Promise<void> {
    return new Promise<void>(() => {
      showUI(
        { title: WINDOW_TITLE, height: HEIGHT, width: WIDTH },
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
          let newTarget = targetFactory.fromUrl(data.url)
          if (newTarget.url !== target.url) {
            /* Only update the target if it is 
            different from the current target */
            setTarget(newTarget)
            emit(EVENT_URL_UPDATED, {
              url: newTarget.url,
              message: newTarget.message,
            })
          }
        }
        catch (e: any) {
          emit(EVENT_URL_UPDATED, {
            url: target.url,
            errorMessage: e.message
          })
        }
      }),
      on(EVENT_SELECTION_SET, () => {
        let selection = figma.currentPage.selection
        if (selection.length > 0) {
          let nodeIds = selection.map((node) => { return node.id })
          let target = targetFactory.fromNodes(nodeIds)
          setTarget(target)
          emit(EVENT_URL_UPDATED, {
            url: target.url,
            message: target.message,
          })
        }
      }),
      on(EVENT_VIEW_SELECTED, () => {
        try {
          let target = targetFactory.fromView(
            figma.currentPage,
            figma.viewport.center.x,
            figma.viewport.center.y,
            figma.viewport.zoom,
          )
          setTarget(target)
          emit(EVENT_URL_UPDATED, {
            url: target.url,
            message: target.message,
          })
        } catch (e: any) {
          console.error(e.message)
        }
      }),
      on(EVENT_LAYOUT_UPDATED, (data) => {
        let height = data.height
        figma.ui.resize(WIDTH, height)
      })
    )
    figma.on('selectionchange', () => {
      let selection = figma.currentPage.selection
      try {
        emit(EVENT_ENABLE_NODE_BUTTON, { isEnabled: selection.length > 0 })
      } catch (e) {
        /* This event throws an error if selection changes 
        when no UI is open, so we ignore the error */
      }
    })
  }

  function removeListeners() {
    while (listeners.length > 0) {
      let removeCallback = listeners.pop()
      if (removeCallback) removeCallback()
    }
    figma.off('selectionchange', () => {})
  }

  function handleClick(): Promise<void> {
    return new Promise<void>((resolve) => {
      navigator.navigateTo(target)
      .then(() => {
        figma.closePlugin()
        resolve()
      })
      .catch((message: any) => {
        console.log('error: ' + message)
        message = message ? message : ''
        showSettingsUi('', message)
        figma.notify(message)
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
        icon: SETTINGS_ICON
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
    return label.length > 0 ? label : target.label
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
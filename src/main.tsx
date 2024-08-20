/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, SVG, useSyncedState, usePropertyMenu, useStickable, useWidgetNodeId, waitForTask } = widget
import { Theme, Themes } from './themes'
import { Sizes } from './sizes'
import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { EVENT_LABEL_UPDATED, EVENT_URL_UPDATED, EVENT_SELECTION_SET, EVENT_VIEW_SELECTED, EVENT_ENABLE_NODE_BUTTON, WINDOW_TITLE, MSG_SELECT_LAYERS, HEIGHT, WIDTH } from './constants'
import { TargetResolver as TargetFactory } from './targets/targetFactory'
import { Target, TargetType } from './targets/target'
import { EmptyTarget } from "./targets/EmptyTarget"
import { Navigator } from './targets/navigator'
import { SETTINGS_ICON } from './ui_icons/settings_icon'
import { Migration } from './migration'

export default function () {
  figma.skipInvisibleInstanceChildren = true
  widget.register(Button)
}

function Button() {
  /* Version used to manage migration updates to Button */
  const [version, setVersion] = useSyncedState('version', 1)

  /* Deprecated url value from initial release, replaced by target */
  const [deprecated_Url, set_deprecatedUrl] = useSyncedState('url', '')

  /* State variables */
  const [target, setTarget] = useSyncedState<Target>('target', new EmptyTarget())
  const [label, setLabel] = useSyncedState('label', '')
  const [theme, setTheme] = useSyncedState('theme', Themes.getDefaultTheme())
  const [size, setSize] = useSyncedState('size', Sizes.getDefaultSize())

  const targetFactory = new TargetFactory()
  const navigator = new Navigator()
  const listeners: (() => void)[] = []
  const widgetId = useWidgetNodeId()

  let notifyHandler: NotificationHandler | null = null

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
        tooltip: 'Open Settings',
        propertyName: 'settings',
        icon: SETTINGS_ICON
      },
    ],
    (event) => {
      beforeWidgetRun()
      if (event.propertyName === 'color') {
        let color = event.propertyValue?.toUpperCase()
        let theme: Theme = Themes.getAllThemes().find(theme => {
          return theme.primaryColor.toUpperCase() === color
        }) as Theme
        setTheme(theme)
      }
      if (event.propertyName === 'size') {
        let size = Sizes.findSizeByName(event.propertyValue as string)
        if (!size) size = Sizes.getDefaultSize()
        setSize(size)
      }
      if (event.propertyName === 'settings') {
        return showSettingsUi()
      }
    },
  )

  function beforeWidgetRun() {
    waitForTask(migrate(version))
  }

  function addListeners() {
    listeners.push(
      on(EVENT_LABEL_UPDATED, (data) => { setLabel(data.label) }),
      on(EVENT_URL_UPDATED, (data) => {
        try {
          let newTarget = targetFactory.fromUrl(data.url)
          setTarget(newTarget)
          if (newTarget.theme) setTheme(newTarget.theme)
          emit(EVENT_URL_UPDATED, { url: newTarget.url })
          notify(newTarget.message)
        }
        catch (e: any) {
          emit(EVENT_URL_UPDATED, { url: target.url })
          notify(e.message, true)
        }
      }),
      on(EVENT_SELECTION_SET, () => {
        let selection = figma.currentPage.selection.filter((node) => {
          return node.id !== widgetId
        })
        if (selection.length > 0) {
          let nodeIds = selection.map((node) => { return node.id })
          targetFactory.fromNodes(nodeIds).then(
            (target) => {
              setTarget(target)
              emit(EVENT_URL_UPDATED, { url: target.url })
              notify(target.message)
            }
          )
        }
        else {
          notify(MSG_SELECT_LAYERS)
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
          emit(EVENT_URL_UPDATED, { url: target.url })
          notify(target.message)
        } catch (e: any) {
          console.error(e.message)
        }
      })
    )
    figma.on('selectionchange', () => {
      let selection = figma.currentPage.selection
      try {
        emit(EVENT_ENABLE_NODE_BUTTON, { isEnabled: selection.length > 0 })
      } catch {
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
    figma.off('selectionchange', () => { })
  }

  function handleClick(): Promise<void> {
    beforeWidgetRun()
    return new Promise<void>((resolve) => {
      navigator.navigateTo(target)
        .then(() => {
          figma.closePlugin()
          resolve()
        })
        .catch((error?: any) => {
          showSettingsUi()
          if (error) notify(error, true)
        })
    })
  }

  function getButtonLabel(): string {
    if (target.type === TargetType.EMPTY) {
      return target.label
    } else {
      return label.length > 0 ? label : target.label
    }
  }

  function notify(message: string | undefined, isError?: boolean) {
    if (message && message.length > 0) {
      if (notifyHandler) notifyHandler.cancel()
      notifyHandler = figma.notify(message, { error: isError })
    }
  }

  async function migrate(currentVersion: number) {
    switch (currentVersion) {
      case 1:
        /* Migrate from url to targets */
        if (deprecated_Url.length > 0) {
          let target = await targetFactory.fromDeprecatedUrl(deprecated_Url)
          setTarget(target)
          set_deprecatedUrl('')
        }
      case 2:
        /* Migrate to new size format with outerPadding property */
        size
          ? setSize(Migration.getClosestSize(size.fontSize, Sizes.getAllSizes()))
          : setSize(Sizes.getDefaultSize())
        setVersion(Migration.LATEST_VERSION)
      case 3: 
      case 4:
       /* Do nothing for versions 3 and 4 since there is no change in the state schema between those and version 5. Versions 3 and 4 were necessary to work out the kinks in testing the new app based url targets based approach to theming. With version 5 all buttons will be on the latest state schema  */
      case 5:
        /* Migrate size to support new icon.size properties */
        let newSize = Sizes.findSizeByName(size.name as string)
        if (!newSize) newSize = Sizes.getDefaultSize()
        setSize(newSize)
        /* Migrate to new app based url targets */
        if (target.type === TargetType.WEB) {
          const newTarget = targetFactory.fromUrl(target.url)
          setTarget(newTarget)
          if (newTarget.theme) setTheme(newTarget.theme)
        }
      case Migration.LATEST_VERSION:
        console.log(`Successfully migrated to version ${Migration.LATEST_VERSION}`)
    }
  }

  function showSettingsUi(): Promise<void> {
    /* Don't resolve this promise so Setting UI stays open */
    return new Promise<void>(() => {
      removeListeners()
      addListeners()
      showUI(
        {
          title: WINDOW_TITLE,
          height: HEIGHT,
          width: WIDTH
        },
        {
          label: label,
          url: target.url
        }
      )
    })
  }

  return (
    <AutoLayout
      name="Widget"
      padding={{ 
        top: size.outerPadding,
        bottom: size.outerPadding + size.shadowDepth,
        left: size.outerPadding,
        right: size.outerPadding
      }}
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
        stroke={target.type !== TargetType.EMPTY ? theme.primaryColor : "#d9d9d9"}
        cornerRadius={size.cornerRadius}
        strokeWidth={size.strokeWidth}
        padding={{
          vertical: size.verticalPadding,
          horizontal: size.horizontalPadding,
        }}
        spacing={size.iconSpacing}
        onClick={handleClick}
      >
        {target.icon && 
          <SVG
          name="Icon"
          src={target.icon}
          height={size.iconSize}
          width={size.iconSize}
          />
        }
        <Text
          name="Label"
          fill={theme.textColor}
          fontFamily="Inter"
          fontSize={size.fontSize}
          fontWeight={600}
          href={target.type === TargetType.WEB ? target.url : ''}
        >
          { getButtonLabel() }
        </Text>
      </AutoLayout>
    </AutoLayout>
  )
}
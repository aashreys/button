/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable } = widget
import { createNodeNavigationUrl as createNodeNavUrl, formatUrl, getNodeIdFromUrl, getParentPage, getUrlType, isURLFromThisFile, smoothScroll } from './utils'
import { Theme, Themes } from './themes'
import { Size, Sizes } from './sizes'
import { emit, on, showUI } from '@create-figma-plugin/utilities'
import { EVENT_LABEL_UPDATED, EVENT_URL_UPDATED, MSG_SET_URL, MSG_GO_TO_LAYER, MSG_OPEN_LINK, MSG_LAYER_DELETED, MSG_NAV_TO_LAYER } from './constants'
import { LINK_ICON } from './link_icon'

export enum UrlType {
  WEB, FIGMA, NODE_NAV, EMPTY
}

export default function () {
  figma.skipInvisibleInstanceChildren = true
  widget.register(Button)
}

function Button() {
  const [url, setUrl] = useSyncedState('url', '')
  const [label, setLabel] = useSyncedState('label', '')
  const [theme, setTheme] = useSyncedState('theme', Themes.getDefaultTheme())
  const [size, setSize] = useSyncedState('size', Sizes.getDefaultSize())

  function showSettingsUi(message?: string) {
    message = message ? message : ''
    showUI(
      { title: 'Edit URL', height: 144, width: 240 },
      { label, url, message }
    )
  }

  function isUrlSet(): boolean {
    return getUrlType(url) !== UrlType.EMPTY
  }

  function isLabelSet(): boolean {
    return label.length > 0
  }

  function handleClick() {
    return new Promise(() => {
      if (isUrlSet()) {
        if (getUrlType(url) === UrlType.NODE_NAV) {
          let id = getNodeIdFromUrl(url)
          navigateToNode(id)
        }
        else {
          openUrl(url)
        }
      }
      else {
        showSettingsUi()
      }
    })
  }

  function openUrl(url: string) {
    const openLinkUIString = `<script>window.open('${url}', '_blank')</script>`
    figma.showUI(openLinkUIString, { visible: false })
    setTimeout(figma.closePlugin, 1000)
  }

  function navigateToNode(id: string | null) {
    let node = id ? figma.getNodeById(id) : null

    if (node && node.type === 'PAGE') {
      figma.currentPage = node
      figma.closePlugin()
    }

    if (node && node.type !== 'PAGE' && node.type !== 'DOCUMENT') {
      figma.currentPage = getParentPage(node as SceneNode)
      smoothScroll(node as SceneNode, 300).then(() => {
        figma.closePlugin()
      })
    }

    if (!node) {
      figma.notify(MSG_LAYER_DELETED)
      showSettingsUi(MSG_LAYER_DELETED)
    }
  }

  on(EVENT_LABEL_UPDATED, (data) => { setLabel(data.label) })

  on(EVENT_URL_UPDATED, (data) => {
    let url = formatUrl(data.url)
    let message = ''

    if (isURLFromThisFile(url)) {
      let nodeId = getNodeIdFromUrl(url)
      if (nodeId) url = createNodeNavUrl(nodeId)
      message = MSG_NAV_TO_LAYER
    }
    
    setUrl(url)
    emit(EVENT_URL_UPDATED, { url, message })
  })

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
        return new Promise<void>(() => {
          showSettingsUi(getUrlType(url) === UrlType.NODE_NAV ? MSG_NAV_TO_LAYER : '')
        })
      }
    },
  )

  function getButtonLabel(): string {
    let urlType = getUrlType(url)
    switch (urlType) {
      case UrlType.EMPTY: return MSG_SET_URL
      case UrlType.FIGMA: return isLabelSet() ? label : MSG_OPEN_LINK
      case UrlType.NODE_NAV: return isLabelSet() ? label : MSG_GO_TO_LAYER
      case UrlType.WEB: return isLabelSet() ? label : MSG_OPEN_LINK
    }
  }

  return (
    <AutoLayout
      name="Button"
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
        name="Button"
        effect={{
          type: "drop-shadow",
          color: isUrlSet() ? theme.primaryColor : "#d9d9d9",
          offset: { x: 0, y: size.shadowDepth },
          blur: 0,
          showShadowBehindNode: false,
        }}
        fill="#ffffff"
        hoverStyle={isUrlSet() ? {
          fill: theme.primaryColor
        } : {}}
        stroke={isUrlSet() ? theme.primaryColor : "#d9d9d9"}
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
          hoverStyle={isUrlSet() ? {
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
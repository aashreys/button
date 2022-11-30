/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable, Input } = widget
import { getNodeIdFromUrl, getParentPage, isThisFile, smoothScrollToNode as smoothScroll } from './utils'
import { Theme, Themes } from './themes'
import { Size, Sizes } from './sizes'
import { on, showUI } from '@create-figma-plugin/utilities'
import { LABEL_UPDATED, URL_UPDATED } from './events'
import { LINK_ICON } from './link_icon'

export default function () {
  figma.skipInvisibleInstanceChildren = true
  widget.register(Button)
}

function Button() {
  const [url, setUrl] = useSyncedState('url', '')
  const [label, setLabel] = useSyncedState('label', '')
  const [theme, setTheme] = useSyncedState('theme', Themes.getDefaultTheme())
  const [size, setSize] = useSyncedState('size', Sizes.getDefaultSize())

  function showSettingsUi() {
    showUI(
      { title: 'Edit URL', height: 144, width: 240 },
      { label, url }
    )
  }

  function isUrlSet(): boolean {
    return url.length > 0
  }

  function isLabelSet(): boolean {
    return label.length > 0
  }

  function handleClick() {
    return new Promise(() => {
      if (isUrlSet()) {
        if (isThisFile(url)) {
          navigateToNode(url)
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

  function navigateToNode(url: string) {
    let id = getNodeIdFromUrl(url)
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
      figma.notify('Target layer may have been deleted. Please update URL.')
      showSettingsUi()
    }
  }

  on(LABEL_UPDATED, (data) => { setLabel(data.label) })

  on(URL_UPDATED, (data) => { setUrl(data.url) })

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
          showSettingsUi()
        })
      }
    },
  )

  return (
    <AutoLayout
      name="Button"
      overflow="visible"
      direction="vertical"
      spacing={16}
      padding={{ bottom: size.shadowDepth}}
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
          {
            isUrlSet() 
            ? (isLabelSet() ? label : 'Open Link ->')
            : 'Configure Button ⚙️'
          }
        </Text>
      </AutoLayout>
    </AutoLayout>
  )
}
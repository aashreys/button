/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable, Input } = widget
import { getFormattedUrl } from './url_utils'
import { Theme, Themes } from './themes'
import { Size, Sizes } from './sizes'

const INPUT_FRAME_PROPS = {
  fill: "#ffffff",
  stroke: "#757575",
  cornerRadius: 16,
  padding: 20,
}

const LINK_ICON = `<svg class="svg" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.232 16.95l1.945-1.945.707.707-1.945 1.945c-1.269 1.27-3.327 1.27-4.596 0-1.27-1.27-1.27-3.327 0-4.596l1.945-1.945.707.707-1.945 1.945c-.878.878-.878 2.303 0 3.182.879.878 2.304.878 3.182 0zm5.48-4.066l-.707-.707 1.945-1.945c.878-.878.878-2.303 0-3.182-.879-.878-2.304-.878-3.182 0l-1.945 1.945-.707-.707 1.945-1.945c1.269-1.27 3.327-1.27 4.596 0 1.27 1.27 1.27 3.327 0 4.596l-1.945 1.945zm-5.45 1.62l4.242-4.242-.766-.766-4.242 4.242.766.766z" fill-rule="nonzero" fill-opacity="1" fill="#fff" stroke="none"></path></svg>`

const enum UiState { VISIBLE, HIDDEN }

export default function () {
  widget.register(Button)
}

function Button() {
  const placeholderLabel = 'I\'m a Button :)'
  const [url, setUrl] = useSyncedState('url', '')
  const [label, setLabel] = useSyncedState('label', '')
  const [editUiState, setEditUiState] = useSyncedState('editUiState', UiState.VISIBLE)
  const [theme, setTheme] = useSyncedState('theme', Themes.getDefaultTheme())
  const [size, setSize] = useSyncedState('size', Sizes.getDefaultSize())

  function updateButton(label: string, url: string) {
    setLabel(label)
    setUrl(getFormattedUrl(url))
  }

  function openUrl() {
    return new Promise(() => {
      if (url.length > 0) {
        const openLinkUIString = `<script>window.open('${url}', '_blank')</script>`
        figma.showUI(openLinkUIString, { visible: false })
        setEditUiState(UiState.HIDDEN)
      } else {
        setEditUiState(UiState.VISIBLE)
        figma.notify('Type or paste a URL to open')
      }
      setTimeout(figma.closePlugin, 1000)
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
          option: theme.color
        }}),
        selectedOption: theme.color
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
        itemType: 'toggle',
        tooltip: 'Change URL',
        propertyName: 'edit',
        isToggled: editUiState === UiState.VISIBLE,
        icon: LINK_ICON
      }
    ],
    (event) => { 
      if (event.propertyName === 'edit') {
        setEditUiState(editUiState === UiState.HIDDEN ? UiState.VISIBLE : UiState.HIDDEN) 
      }
      if (event.propertyName === 'color') {
        let theme: Theme = Themes.getAllThemes().find(
          theme => theme.color === event.propertyValue
        ) as Theme
        setTheme(theme)
      }
      if (event.propertyName === 'size') {
        let size: Size = Sizes.getAllSizes().find(
          size => size.name === event.propertyValue
        ) as Size
        setSize(size)
      }
    },
  )

  return (
    <AutoLayout
      name="Button"
      overflow="visible"
      direction="vertical"
      spacing={16}
      horizontalAlignItems="center"
    >
      <AutoLayout
      name="Config"
      width={500}
      overflow="visible"
      direction="vertical"
      spacing={4}
      horizontalAlignItems="center"
      hidden={editUiState === UiState.HIDDEN}
      >
        <Input
          value={label}
          placeholder="Type label"
          onTextEditEnd={(e) => {
            updateButton(e.characters, url)
          }}
          fontSize={24}
          fill="#372944"
          width="fill-parent"
          inputFrameProps={INPUT_FRAME_PROPS}
          inputBehavior="truncate"
        />
        <Input
          value={url}
          placeholder="Type or paste URL"
          onTextEditEnd={(e) => {
            updateButton(label, e.characters)
          }}
          fontSize={24}
          fill="#372944"
          width="fill-parent"
          inputFrameProps={INPUT_FRAME_PROPS}
          inputBehavior="truncate"
        />
      </AutoLayout>
      <AutoLayout
        name="Button"
        fill="#ffffff"
        stroke={theme.color}
        cornerRadius={size.cornerRadius}
        strokeWidth={size.strokeWidth}
        overflow="visible"
        padding={{
          vertical: size.verticalPadding,
          horizontal: size.horizontalPadding,
        }}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={openUrl}
      >
        <Text
          name="Label"
          fill="#372944"
          fontFamily="Inter"
          fontSize={size.fontSize}
          fontWeight={500}
        >
          {label.length > 0 ? label : placeholderLabel}
        </Text>
      </AutoLayout>
    </AutoLayout>
  )
}
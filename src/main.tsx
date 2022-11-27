/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable, Input } = widget
import { getFormattedUrl } from './url_utils'
import { Theme, Themes } from './themes'

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

  function updateButton(label: string, url: string) {
    setLabel(label)
    setUrl(getFormattedUrl(url))
  }

  function openUrl(url: string) {
    return new Promise(() => {
      if (url.length > 0) {
        const openLinkUIString = `<script>window.open('${url}')</script>`
        figma.showUI(openLinkUIString, { visible: false })
        setTimeout(figma.closePlugin, 1000)
      } else {
        setEditUiState(UiState.VISIBLE)
        figma.notify('Type or paste a URL to open')
      }      
    })
  }

  useStickable()

  usePropertyMenu(
    [
      {
        itemType: 'color-selector',
        tooltip: 'Select Color',
        propertyName: 'color',
        options: Themes.getAllThemes(),
        selectedOption: theme.option
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
        let newTheme: Theme = Themes.getAllThemes().find(
          element => element.option === event.propertyValue
        ) as Theme
        setTheme(newTheme)
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
        stroke={theme.option}
        cornerRadius={70}
        strokeWidth={4}
        overflow="visible"
        padding={{
          vertical: 24,
          horizontal: 48,
        }}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        onClick={() => { openUrl(url) }}
      >
        <Text
          name="Label"
          fill="#372944"
          fontFamily="Inter"
          fontSize={48}
          fontWeight={500}
        >
          {label.length > 0 ? label : placeholderLabel}
        </Text>
      </AutoLayout>
    </AutoLayout>
  )
}
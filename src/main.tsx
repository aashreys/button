/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, useStickable, Input } = widget
import { getFormattedUrl } from './url_utils'

const enum UiState { VISIBLE, HIDDEN }

const INPUT_PROPS_DEFAULT = {
  fill: "#F6ECFF",
  stroke: "#9B51E0",
  cornerRadius: 16,
  padding: 20,
}

const INPUT_TEXT_COLOR_DEFAULT = '#583777'

export default function () {
  widget.register(Button)
}

function Button() {
  const placeholderLabel = 'I\'m a Button :)'
  const [url, setUrl] = useSyncedState('url', '')
  const [label, setLabel] = useSyncedState('label', '')
  const [editUiState, setEditUiState] = useSyncedState('editUiState', UiState.VISIBLE)

  function updateButton(label: string, url: string) {
    setLabel(label)
    setUrl(getFormattedUrl(url))
  }

  function openUrl(url: string) {
    return new Promise(() => {
      const openLinkUIString = `<script>window.open('${url}')</script>`
      figma.showUI(openLinkUIString, { visible: false })
      setTimeout(figma.closePlugin, 100)
    })
  }

  useStickable()

  usePropertyMenu(
    [
      {
        itemType: 'toggle',
        tooltip: 'Edit Button',
        propertyName: 'string',
        isToggled: editUiState === UiState.VISIBLE,
      }
    ],
    () => { setEditUiState(editUiState === UiState.HIDDEN ? UiState.VISIBLE : UiState.HIDDEN) },
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
          fill={INPUT_TEXT_COLOR_DEFAULT}
          width="fill-parent"
          inputFrameProps={INPUT_PROPS_DEFAULT}
          inputBehavior="truncate"
        />
        <Input
          value={url}
          placeholder="Type url"
          onTextEditEnd={(e) => {
            updateButton(label, e.characters)
          }}
          fontSize={24}
          fill={INPUT_TEXT_COLOR_DEFAULT}
          width="fill-parent"
          inputFrameProps={INPUT_PROPS_DEFAULT}
          inputBehavior="truncate"
        />
      </AutoLayout>
      <AutoLayout
        name="Button"
        fill="#FFF"
        stroke="#9B51E0"
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
/** @jsx figma.widget.h */

const { widget } = figma
const { AutoLayout, Text, useSyncedState, usePropertyMenu, Input } = widget
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

  function updateButton(newLabel: string, newUrl: string) {
    if (newLabel.length === 0) newLabel = label
    setLabel(newLabel)
    newUrl = getFormattedUrl(newUrl)
    setUrl(newUrl)
  }

  function openUrl() {
    return new Promise(() => {
      const openLinkUIString = `<script>window.open('${url}','_blank');</script>`
      figma.showUI(openLinkUIString, { visible: false })
      setTimeout(figma.closePlugin, 100)
    })
  }

  if (editUiState === UiState.HIDDEN) {
    usePropertyMenu(
      [
        {
          itemType: 'action',
          tooltip: 'Edit',
          propertyName: 'edit',
        }
      ],
      () => {setEditUiState(UiState.VISIBLE)},
    )
  } else {
    usePropertyMenu(
      [
        {
          itemType: 'action',
          tooltip: 'Done',
          propertyName: 'done',
        }
      ],
      () => {setEditUiState(UiState.HIDDEN)},
    )
  }

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
        onClick={openUrl}
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
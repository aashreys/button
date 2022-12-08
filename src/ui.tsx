import {
  Container,
  render,
  Textbox,
  useInitialFocus,
  VerticalSpace,
  Text,
  Button,
  Columns
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { EVENT_ENABLE_NODE_BUTTON, EVENT_LABEL_UPDATED, EVENT_SELECTION_SET, EVENT_URL_UPDATED, EVENT_VIEW_SELECTED } from './constants'

function Plugin(props: 
  { label: string, 
    url: string, 
    message: string, 
    errorMessage: string 
  }) {

  const [label, setLabel] = useState(props.label)
  const [url, setUrl] = useState(props.url)
  const [enableNodeButton, setEnableNodeButton] = useState(false)

  const listeners: (() => void)[] = []

  function addListeners() {
    listeners.push(on(EVENT_URL_UPDATED, (data) => {
      setUrl(data.url)
    }))
    listeners.push(on(EVENT_ENABLE_NODE_BUTTON, (data) => {
      setEnableNodeButton(data.isEnabled)
    }))
  }

  function removeListeners() {
    while (listeners.length > 0) {
      let removeCallback = listeners.pop()
      if (removeCallback) removeCallback()
    }
  }

  useEffect(() => {
    addListeners()
    return () => removeListeners()
  }, [])

  return (
    <Container space="small">

      <VerticalSpace space="large" />

      <Textbox
        placeholder='Type label'
        value={label}
        onValueInput={(label) => {
          setLabel(label)
          emit(EVENT_LABEL_UPDATED, { label })
        }}
        variant="border" />

      <VerticalSpace space="large" />

      <Text>Open a URL...</Text>

      <VerticalSpace space="small" />

      <Textbox
        {...useInitialFocus()}
        placeholder='Paste layer, page or web URL'
        value={url}
        onValueInput={setUrl}
        validateOnBlur={(url) => {
          emit(EVENT_URL_UPDATED, { url })
          return url
        }}
        variant="border" />

      <VerticalSpace space="large" />

      <Text>Or navigate to selected layers...</Text>

      <VerticalSpace space="small" />

      <Columns space="extraSmall">

        <Button
          secondary={!enableNodeButton}
          fullWidth
          onClick={() => emit(EVENT_SELECTION_SET)}>
          {'Selection ->'}
        </Button>

        <Button
          fullWidth
          onClick={() => emit(EVENT_VIEW_SELECTED)}>
          {'Current View ->'}
        </Button>

      </Columns>

      <VerticalSpace space="extraLarge" />

    </Container>
  )
}

export default render(Plugin)
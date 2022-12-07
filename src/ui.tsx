import {
  Container,
  render,
  Textbox,
  useInitialFocus,
  VerticalSpace,
  Text,
  Button,
  Inline
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { BTN_NAVIGATE_SELECTION, BTN_NAVIGATE_VIEW, EVENT_ENABLE_NODE_BUTTON, EVENT_LABEL_UPDATED, EVENT_SELECTION_SET, EVENT_URL_UPDATED, EVENT_VIEW_SELECTED } from './constants'

function Plugin(props: 
  { label: string, 
    url: string, 
    message: string, 
    errorMessage: string 
  }) {

  const [label, setLabel] = useState(props.label)
  const [url, setUrl] = useState(props.url)
  const [message, setMessage] = useState(props.message)
  const [errorMessage, setErrorMessage] = useState(props.errorMessage)
  const [enableNodeButton, setEnableNodeButton] = useState(false)

  useEffect(() => {
    let removeUrlListener = on(EVENT_URL_UPDATED, (data) => {
      setUrl(data.url)
      setMessage(data.message ? data.message : '')
      setErrorMessage(data.errorMessage ? data.errorMessage : '')
    })
    let nodeButtonListener = on(EVENT_ENABLE_NODE_BUTTON, (data) => {
      setEnableNodeButton(data.isEnabled)
    })
    return () => {
      removeUrlListener()
      nodeButtonListener()
    }
  }, []);

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

      <VerticalSpace space="small" />

      <Textbox
        {...useInitialFocus()}
        placeholder='Type URL'
        value={url}
        onValueInput={setUrl}
        validateOnBlur={(url) => {
          emit(EVENT_URL_UPDATED, { url })
          return url
        }}
        variant="border" />

      <VerticalSpace space="small" />

      <Inline space="extraSmall">

        <Button
          disabled={!enableNodeButton}
          secondary={!enableNodeButton}
          onClick={() => emit(EVENT_SELECTION_SET)}>
          {BTN_NAVIGATE_SELECTION}
        </Button>

        <Button
          onClick={() => emit(EVENT_VIEW_SELECTED)}>
          {BTN_NAVIGATE_VIEW}
        </Button>

      </Inline>

      <VerticalSpace space="medium" />

      {
        message.length > 0 &&
        <Text
          align="center">
          {message}
        </Text>
      }

      {
        errorMessage.length > 0 &&
        <Text
          align="center"
          style={{ color: 'var(--figma-color-text-danger)' }}>
          {errorMessage}
        </Text>
      }

      <VerticalSpace space="medium" />

    </Container>
  )
}

export default render(Plugin)
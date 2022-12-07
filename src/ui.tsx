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
import { Fragment, h } from 'preact'
import { useEffect, useLayoutEffect, useState } from 'preact/hooks'
import { EVENT_ENABLE_NODE_BUTTON, EVENT_LABEL_UPDATED, EVENT_LAYOUT_UPDATED, EVENT_SELECTION_SET, EVENT_URL_UPDATED, EVENT_VIEW_SELECTED } from './constants'

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

  useLayoutEffect(() => {
    let height = document.getElementById('create-figma-plugin')?.clientHeight
    console.log('height: ' + height)
    emit(EVENT_LAYOUT_UPDATED, { height: height })
  })

  return (
    <Container space="small">

      <VerticalSpace space="medium" />

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
        placeholder='Paste layer, page or web URL'
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
          {'Selection ->'}
        </Button>

        <Button
          onClick={() => emit(EVENT_VIEW_SELECTED)}>
          {'Current View ->'}
        </Button>

      </Inline>

      {
        message.length > 0 &&
        <Fragment>
          <VerticalSpace space="medium" />
            <Text
              align="center">
              {message}
            </Text>
        </Fragment>
      }

      {
        errorMessage.length > 0 &&
        <Fragment>
          <VerticalSpace space="medium" />
            <Text
              align="center"
              style={{ color: 'var(--figma-color-text-danger)' }}>
              {errorMessage}
            </Text>
        </Fragment>
      }

      <VerticalSpace space="medium" />

    </Container>
  )
}

export default render(Plugin)
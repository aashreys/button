import {
  Container,
  render,
  Textbox,
  useInitialFocus,
  VerticalSpace,
  Text
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { Fragment, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { EVENT_LABEL_UPDATED, EVENT_URL_UPDATED } from './constants'

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

  useEffect(() => {
    let removeListener = on(EVENT_URL_UPDATED, (data) => {
      setUrl(data.url)
      setMessage(data.message ? data.message : '')
      setErrorMessage(data.errorMessage ? data.errorMessage : '')
    })
    return () => {
      removeListener()
    }
  }, []);

  return (
    <Container space="small">

      <VerticalSpace space="small" />

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
        placeholder='Type or paste web or Figma URL'
        value={url}
        onValueInput={setUrl}
        validateOnBlur={(url) => {
          emit(EVENT_URL_UPDATED, { url })
          return url
        }}
        variant="border" />

      <VerticalSpace space="small" />

      {
        message.length > 0 &&
        <Fragment>
            <Text>{message}</Text>
          <VerticalSpace space="small" />
        </Fragment>
      }

      {
        errorMessage.length > 0 &&
        <Fragment>
            <Text style={'color: var(--figma-color-text-danger)'}>
              {errorMessage}
            </Text>
          <VerticalSpace space="small" />
        </Fragment>
      }
      
    </Container>
  )
}

export default render(Plugin)
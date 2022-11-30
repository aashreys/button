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
import { useState } from 'preact/hooks'
import { EVENT_LABEL_UPDATED, EVENT_URL_UPDATED } from './constants'

function Plugin(props: { label: string, url: string, message: string }) {

  const [label, setLabel] = useState(props.label)
  const [url, setUrl] = useState(props.url)
  const [message, setMessage] = useState(props.message)

  on(EVENT_URL_UPDATED, (data) => {
    setUrl(data.url) 
    setMessage(data.message)
  })

  return (
    <Container space="small">

      <VerticalSpace space="small" />

      <Textbox
        placeholder='Type label'
        value={label}
        onValueInput={() => {
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
      
    </Container>
  )
}

export default render(Plugin)
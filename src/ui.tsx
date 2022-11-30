import {
  Container,
  render,
  Textbox,
  useInitialFocus,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useState } from 'preact/hooks'
import { LABEL_UPDATED, URL_UPDATED } from './events'
import { getFormattedUrl } from './utils'

function Plugin(props: { label: string, url: string }) {
  const [label, setLabel] = useState(props.label)
  const [url, setUrl] = useState(props.url)

  function updateLabel(label: string) {
    setLabel(label)
    emit(LABEL_UPDATED, { label })
  }

  function validateUrlOnBlur(url: string): string | boolean {
    url = getFormattedUrl(url)
    emit(URL_UPDATED, { url })
    return url
  }

  return (
    <Container space="small">

      <VerticalSpace space="small" />

      <Textbox
        placeholder='Type label'
        value={label}
        onValueInput={updateLabel}
        variant="border" />

      <VerticalSpace space="small" />

      <Textbox
        {...useInitialFocus()}
        placeholder='Type or paste web or Figma URL'
        value={url}
        onValueInput={setUrl}
        validateOnBlur={validateUrlOnBlur}
        variant="border" />

      <VerticalSpace space="small" />
      
    </Container>
  )
}

export default render(Plugin)
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
import { LABEL_UPDATED, URL_UPDATED } from './events'
import { createNodeNavigationUrl, formatUrl, getNodeIdFromUrl as getNodeIdFromFigmaUrl, isNodeNavigationUrl, isURLFromThisFile } from './utils'

function Plugin(props: { label: string, url: string }) {

  const FIGMA_LAYER_MESSAGE = 'Button will navigate to a Figma / FigJam layer.'

  const [label, setLabel] = useState(props.label)
  const [url, setUrl] = useState(props.url)

  on(URL_UPDATED, (data) => { setUrl(data.url) })

  return (
    <Container space="small">

      <VerticalSpace space="small" />

      <Textbox
        placeholder='Type label'
        value={label}
        onValueInput={() => {
          setLabel(label)
          emit(LABEL_UPDATED, { label })
        }}
        variant="border" />

      <VerticalSpace space="small" />

      <Textbox
        {...useInitialFocus()}
        placeholder='Type or paste web or Figma URL'
        value={url}
        onValueInput={setUrl}
        validateOnBlur={(url) => {
          emit(URL_UPDATED, { url })
          return url
        }}
        variant="border" />

      <VerticalSpace space="small" />

      {
        isNodeNavigationUrl(url) &&
        <Fragment>
          <Text>{FIGMA_LAYER_MESSAGE}</Text>
          <VerticalSpace space="small" />
        </Fragment>
      }
      
    </Container>
  )
}

export default render(Plugin)
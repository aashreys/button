import {
  Container,
  render,
  Textbox,
  useInitialFocus,
  VerticalSpace,
  Text,
  Button
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { Fragment, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { BTN_NAVIGATE_SELECTION, BTN_NAVIGATE_VIEW, EVENT_ENABLE_NODE_BUTTON, EVENT_LABEL_UPDATED, EVENT_SELECTION_SET, EVENT_URL_UPDATED, EVENT_VIEW_SELECTED } from './constants'
import styles from './styles.css'

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
    <div>
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
          placeholder='Type or paste web or Figma URL'
          value={url}
          onValueInput={setUrl}
          validateOnBlur={(url) => {
            emit(EVENT_URL_UPDATED, { url })
            return url
          }}
          variant="border" />

        {
          message.length > 0 &&
          <Fragment>
            <VerticalSpace space="small" />
            <Text>{message}</Text>            
          </Fragment>
          
        }

        {
          errorMessage.length > 0 &&
          <Fragment>
            <VerticalSpace space="small" />
            <Text style={'color: var(--figma-color-text-danger)'}>
              {errorMessage}
            </Text>
          </Fragment>
          
        }

        <VerticalSpace space="medium" />

      </Container>

      <hr class={styles.divider} />

      <Container space="small">

        <VerticalSpace space="medium" />

        <Button
        fullWidth 
        secondary
        disabled={!enableNodeButton}
        onClick={() => emit(EVENT_SELECTION_SET)}>
          {BTN_NAVIGATE_SELECTION}
        </Button>

        <VerticalSpace space="extraSmall" />

        <Button
        fullWidth
        secondary
        onClick={() => emit(EVENT_VIEW_SELECTED)}>
          {BTN_NAVIGATE_VIEW}
        </Button>

        <VerticalSpace space="small" />

      </Container>
    </div>
  )
}

export default render(Plugin)
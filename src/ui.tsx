import {
  Container,
  render,
  Textbox,
  useInitialFocus,
  VerticalSpace,
  Text,
  Button,
  Columns,
  IconButton,
  IconSmiley32
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { EVENT_ENABLE_NODE_BUTTON, EVENT_LABEL_UPDATED, EVENT_SELECTION_SET, EVENT_URL_UPDATED, EVENT_VIEW_SELECTED } from './constants'
import 'unicode-emoji-picker'
import { EmojiPickEvent, EmojiPickerElement } from 'unicode-emoji-picker'
import styles from './styles.css'
import './styles.css'

function Plugin(props: 
  { label: string, 
    url: string, 
    message: string, 
    errorMessage: string 
  }) {

  const [label, setLabel] = useState(props.label)
  const [url, setUrl] = useState(props.url)
  const [enableNodeButton, setEnableNodeButton] = useState(false)
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false)

  const emojiPicker = useRef<EmojiPickerElement>(null)

  const listeners: (() => void)[] = []

  // https://liuzhenglai.com/post/6137f9f039122f749415f256
  const emojiListener = useCallback((event: EmojiPickEvent) => {
    let newLabel = label + event.detail.emoji
    setLabel(newLabel)
    emit(EVENT_LABEL_UPDATED, { label: newLabel })
  }, [label])


  const escListener = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEmojiPickerVisible(false)
    }
  }

  const clickOutsideListner = useCallback((e: MouseEvent) => {
    if (emojiPicker.current && !emojiPicker.current.contains(e.target)) {
      if (isEmojiPickerVisible) {
        setEmojiPickerVisible(false)
      }
    }
  }, [isEmojiPickerVisible])

  useEffect(() => {
    listeners.push(on(EVENT_URL_UPDATED, (data) => { setUrl(data.url) }))
    listeners.push(on(EVENT_ENABLE_NODE_BUTTON, (data) => { setEnableNodeButton(data.isEnabled) }))
    return () => { 
      while (listeners.length > 0) {
        let removeCallback = listeners.pop()
        if (removeCallback) removeCallback()
      }
    }
  }, [])

  useEffect(() => {
    document.onkeydown = escListener
    document.addEventListener('click', clickOutsideListner)
    return () => { 
      document.onkeydown = null
      document.removeEventListener('click', clickOutsideListner)
    }
  }, [escListener, clickOutsideListner])

  useEffect(() => {
    if (emojiPicker.current) emojiPicker.current.addEventListener('emoji-pick', emojiListener)
    return () => {
      if (emojiPicker.current) emojiPicker.current.removeEventListener('emoji-pick', emojiListener)
    }
  }, [emojiListener])

  return (
    <Container space="small">

      <VerticalSpace space="large" />

      <div style={'display: flex; width: 100%;'}>

        <div style={'flex: 1; margin-right: 4px'}>
          <Textbox
            placeholder='Type a label'
            value={label}
            onValueInput={(input) => {
              setLabel(input)
              emit(EVENT_LABEL_UPDATED, { label: input })
            }}
            variant="border" />
        </div>

        <div>

          <IconButton onClick={() => {
            setEmojiPickerVisible(!isEmojiPickerVisible)
          }}>
            <IconSmiley32 />
          </IconButton>

        </div>

      </div>

      <div
        class={styles.emojiContainer}
        style={isEmojiPickerVisible ? 'display: block' : 'display: none'}>
        <unicode-emoji-picker
          version="14"
          ref={emojiPicker}
          filters-position="top"
          default-group="search" />
      </div>

      <VerticalSpace space="extraLarge" />

      <Text style={'font-weight: bold;'}>Open a webpage</Text>

      <VerticalSpace space="small" />

      <Text style={'color: var(--figma-color-text-secondary)'}>
        Viewers and editors can click this button to open a webpage.
      </Text>

      <VerticalSpace space="small" />

      <Textbox
        {...useInitialFocus()}
        placeholder='Type or paste a link'
        value={url}
        onValueInput={setUrl}
        validateOnBlur={(url) => {
          emit(EVENT_URL_UPDATED, { url })
          return url
        }}
        variant="border" />

      <VerticalSpace space="extraLarge" />

      <Text style={'font-weight: bold;'}>Or navigate this file</Text>

      <VerticalSpace space="small" />

      <Text style={'color: var(--figma-color-text-secondary)'}>
        Only editors can click this button to navigate this file.
      </Text>

      <VerticalSpace space="small" />

      <Columns space="extraSmall">

        <Button
          secondary={!enableNodeButton}
          fullWidth
          onClick={() => emit(EVENT_SELECTION_SET)}>
          {'To Selection'}
        </Button>

        <Button
          fullWidth
          onClick={() => emit(EVENT_VIEW_SELECTED)}>
          {'To Current View'}
        </Button>

      </Columns>

      <VerticalSpace space="large" />

    </Container>
   
  )
}

export default render(Plugin)
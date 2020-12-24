import React from 'react'
import { omitBy } from 'lodash'
import { Text } from './Text'

interface Props {
  content?: string
  disabled?: boolean
  onBlur?: (event: React.FocusEvent, value: string) => void
  onChange?: (event: React.KeyboardEvent, value: string) => void
  onKeyPress?: (event: React.KeyboardEvent, value: string) => void
  onKeyUp?: (event: React.KeyboardEvent, value: string) => void
  onKeyDown?: (event: React.KeyboardEvent, value: string) => void
}

type MostTextProps = Omit<
  React.ComponentProps<typeof Text>,
  'onChange' | 'onInput' | 'onKeyDown' | 'onKeyPress' | 'onKeyUp' | 'onPaste'
>

export class ContentEditableText extends React.Component<Props & MostTextProps> {
  elementRef = React.createRef<HTMLSpanElement>()

  componentDidMount(): void {
    if (this.props.autoFocus) {
      this.focusInput()
    }
  }

  componentDidUpdate(prevProps: Props & MostTextProps): void {
    if (this.props.autoFocus && !prevProps.autoFocus) {
      this.focusInput()
    }
  }

  focusInput = (): void => {
    if (this.elementRef.current) {
      this.elementRef.current.focus()
    }
  }

  resetInput = (content: string): void => {
    if (this.elementRef.current) {
      this.elementRef.current.innerText = content
    }
  }

  shouldComponentUpdate(nextProps: Props & MostTextProps): boolean {
    const props = omitBy(nextProps, (_value, key) => key.startsWith('on') || key === 'content')
    const hasPropChanges = Object.entries(props).some(([key, _value]) => {
      return props[key] !== this.props[key]
    })
    return !this.elementRef.current || hasPropChanges || nextProps.content !== this.elementRef.current.innerText
  }

  onBlur = (event: React.FocusEvent<HTMLSpanElement>): void => {
    const value = this.elementRef.current?.innerText || ''

    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event, value)
    }
  }

  onInput = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
    const value = this.elementRef.current?.innerText || ''

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, value)
    }
  }

  onKeyPress = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
    const value = this.elementRef.current?.innerText || ''

    if (typeof this.props.onKeyPress === 'function') {
      this.props.onKeyPress(event, value)
    }
  }

  onKeyUp = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
    const value = this.elementRef.current?.innerText || ''

    if (typeof this.props.onKeyUp === 'function') {
      this.props.onKeyUp(event, value)
    }
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>): void => {
    const value = this.elementRef.current?.innerText || ''

    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(event, value)
    }
  }

  onPaste = (event: React.ClipboardEvent<HTMLSpanElement>): void => {
    event.preventDefault()

    const text = event.clipboardData.getData('text')
    document.execCommand('insertText', false, text)

    if (typeof this.props.onPaste === 'function') {
      this.props.onPaste(event)
    }
  }

  render(): JSX.Element {
    const { content = '', disabled, onBlur, onChange, onKeyPress, onKeyUp, onKeyDown, onPaste, ...props } = this.props

    return (
      <Text
        {...props}
        ref={this.elementRef}
        contentEditable={!disabled}
        dangerouslySetInnerHTML={{ __html: content }}
        onBlur={this.onBlur}
        onInput={this.onInput}
        onKeyPress={this.onKeyPress}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
      />
    )
  }
}

import React from 'react'
import { Text } from './Text'

interface Props {
  content?: string
  disabled?: boolean
  onChange?: (event: React.KeyboardEvent, value: string) => void
  onKeyPress?: (event: React.KeyboardEvent, value: string) => void
  onKeyUp?: (event: React.KeyboardEvent, value: string) => void
  onKeyDown?: (event: React.KeyboardEvent, value: string) => void
}

type MostTextProps = Omit<React.ComponentProps<typeof Text>, 'onChange' | 'onInput' | 'onKeyDown' | 'onKeyPress' | 'onKeyUp' | 'onPaste'>

export class ContentEditableText extends React.Component<Props & MostTextProps> {
  elementRef = React.createRef<HTMLSpanElement>()

  componentDidMount() {
    if (this.elementRef.current && this.props.autoFocus) {
      this.elementRef.current.focus()
    }
  }

  shouldComponentUpdate(nextProps: Props & MostTextProps) {
    // if (
    //   this.elementRef.current &&
    //   nextProps.content !== this.elementRef.current.innerText
    // ) {
    //   console.log(`content: ${nextProps.content}`, `innerText: ${this.elementRef.current.innerText}`)
    // }

    return (
      !this.elementRef.current ||
      nextProps.content !== this.elementRef.current.innerText
    )
  }

  onInput = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const value = this.elementRef.current!.innerText

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, value)
    }
  }

  onKeyPress = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const value = this.elementRef.current!.innerText

    if (typeof this.props.onKeyPress === 'function') {
      this.props.onKeyPress(event, value)
    }
  }

  onKeyUp = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const value = this.elementRef.current!.innerText

    if (typeof this.props.onKeyUp === 'function') {
      this.props.onKeyUp(event, value)
    }
  }

  onKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    const value = this.elementRef.current!.innerText

    if (typeof this.props.onKeyDown === 'function') {
      this.props.onKeyDown(event, value)
    }
  }

  onPaste = (event: React.ClipboardEvent<HTMLSpanElement>) => {
    event.preventDefault()

    const text = event.clipboardData.getData('text')
    document.execCommand('insertText', false, text)

    if (typeof this.props.onPaste === 'function') {
      this.props.onPaste(event)
    }
  }

  render() {
    const {
      content,
      disabled,
      onChange,
      onKeyPress,
      onKeyUp,
      onKeyDown,
      onPaste,
      ...props
    } = this.props

    return (
      <Text
        {...props}
        ref={this.elementRef as any}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={this.onInput}
        onKeyPress={this.onKeyPress}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        onPaste={this.onPaste}
      >
        {content}
      </Text>
    )
  }
}

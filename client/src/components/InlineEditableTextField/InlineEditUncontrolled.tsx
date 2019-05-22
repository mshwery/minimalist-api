import React from 'react'
import Box from 'ui-box'

export interface InlineEditProps {
  editView: React.ReactNode
  readView: React.ReactNode
  onCancel: () => void
  onConfirm: () => void
  isEditing: boolean
  onEditRequested: (event: React.SyntheticEvent) => void
}

interface State {
  wrapperFocused: boolean
}

export default class InlineEditUncontrolled extends React.Component<InlineEditProps, State> {
  confirmOnBlur = () => {
    // if the wrapper receives blur we should trigger the confirm handler
    if (!this.state.wrapperFocused) {
      this.props.onConfirm()
    }
  }

  onWrapperBlur = () => {
    if (!this.props.isEditing) {
      return
    }

    this.setState({ wrapperFocused: false }, () => this.confirmOnBlur())
  }

  onWrapperClick = (event: React.SyntheticEvent) => {
    if (!this.props.isEditing) {
      this.props.onEditRequested(event)
    }
  }

  onWrapperFocus = () => {
    this.setState({ wrapperFocused: true })
  }

  render() {
    const { editView, readView, isEditing } = this.props

    return (
      <Box onBlur={this.onWrapperBlur} onFocus={this.onWrapperFocus}>
        {isEditing
          ? editView
          : <Box onClick={this.onWrapperClick}>{readView}</Box>
        }
      </Box>
    )
  }
}

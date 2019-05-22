import React from 'react'
import InlineEditUncontrolled, { InlineEditProps } from './InlineEditUncontrolled'
import { Omit } from '../../@types/type-helpers'

type Props = Omit<InlineEditProps,
  | 'onCancel'
  | 'isEditing'
  | 'onEditRequested'
>

interface State {
  isEditing: boolean
}

export default class InlineEdit extends React.Component<Props, State> {
  state = {
    isEditing: false
  }

  onConfirm = () => {
    this.setState({ isEditing: false })
    this.props.onConfirm()
  }

  onCancel = () => {
    this.setState({ isEditing: false })
  }

  onEditRequested = () => {
    this.setState({ isEditing: true })
  }

  render() {
    return (
      <InlineEditUncontrolled
        {...this.props}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        isEditing={this.state.isEditing}
        onEditRequested={this.onEditRequested}
      />
    )
  }
}

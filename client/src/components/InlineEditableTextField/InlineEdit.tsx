import React, { useState } from 'react'
import InlineEditUncontrolled, { InlineEditProps } from './InlineEditUncontrolled'
import { BaseUIProps } from '../../base-ui/types'

type Props = Omit<InlineEditProps,
  | 'onCancel'
  | 'isEditing'
  | 'onEditRequested'
>

const InlineEdit: React.FunctionComponent<Props & BaseUIProps> = (props) => {
  const [isEditing, setEditMode] = useState(false)

  return (
    <InlineEditUncontrolled
      {...props}
      onConfirm={() => {
        setEditMode(false)
        props.onConfirm()
      }}
      onCancel={() => setEditMode(false)}
      isEditing={isEditing}
      onEditRequested={() => setEditMode(true)}
    />
  )
}

export default InlineEdit

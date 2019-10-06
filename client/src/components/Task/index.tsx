import React from 'react'
import { Checkbox, Pane, Text, scale } from '../../base-ui'
import InlineEdit from '../InlineEditableTextField'
import Box from 'ui-box'

interface Props {
  id?: string
  content?: string
  isCompleted?: boolean
  createdAt?: string
  updatedAt?: string
  completedAt?: string
  onContentChange?: (content: string) => void
  onMarkComplete?: (event: React.SyntheticEvent) => void
  onMarkIncomplete?: (event: React.SyntheticEvent) => void
}

const IncompletedContent: React.FunctionComponent<{ content?: string }> = ({ content }) => (
  <Box minHeight={20}>
    <Text>{content}</Text>
  </Box>
)

const CompletedContent: React.FunctionComponent<{ content?: string }> = ({ content }) => (
  <Box minHeight={20} color='#787A87' textDecoration='line-through'>
    <Text>{content}</Text>
  </Box>
)

export default class Task extends React.PureComponent<Props> {
  contentRef = React.createRef<HTMLInputElement>()

  handleContentChange = () => {
    if (!this.contentRef.current) {
      return
    }

    const content = this.contentRef.current.value
    if (content && this.props.content !== content && typeof this.props.onContentChange === 'function') {
      this.props.onContentChange(content)
    }
  }

  render() {
    return (
      <Pane display='flex' minHeight={30} alignItems='center'>
        <Checkbox
          checked={this.props.isCompleted}
          onChange={this.props.isCompleted ? this.props.onMarkIncomplete : this.props.onMarkComplete}
          flex='none'
          marginRight={scale(1)}
        />
        <InlineEdit
          flex='1'
          minHeight={20}
          editView={(
            <Box
              innerRef={this.contentRef as any}
              is='input'
              type='text'
              defaultValue={this.props.content}
              autoFocus
              width='100%'
              padding={0}
              border='none'
              fontSize='inherit'
              fontWeight='inherit'
              color='inherit'
              style={{ outline: 'none' }}
            />
          )}
          readView={this.props.isCompleted
            ? <CompletedContent content={this.props.content} />
            : <IncompletedContent content={this.props.content} />
          }
          onConfirm={this.handleContentChange}
        />
      </Pane>
    )
  }
}

import React, { useState, useMemo } from 'react'
import { Node, createEditor } from 'slate'
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react'
import { withHistory } from 'slate-history'
import { Link } from './Link'
import { Text } from './Text'
import { withLinks } from './withLinks'

interface Props {
  content?: string
}

const handleContentEditableClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
  const url = event.currentTarget.href
  if (url) {
    window.open(url, '_blank')
  }
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'link':
      return (
        <Link {...attributes} href={element.url} onClick={handleContentEditableClick}>
          {children}
        </Link>
      )
    default:
      return <Text {...attributes}>{children}</Text>
  }
}

export const RichInput: React.FC<Props> = (_props) => {
  const [value, setValue] = useState<Node[]>([{ children: [{ text: '' }] }])
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable placeholder="Enter something" renderElement={Element} />
    </Slate>
  )
}

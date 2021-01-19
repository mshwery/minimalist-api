import isUrl from 'is-url'
import { Editor, Element as SlateElement, Transforms, Range } from 'slate'
import { ReactEditor } from 'slate-react'

export interface CustomElement extends SlateElement {
  type?: 'link'
}

const wrapLink = (editor: Editor, url: string): void => {
  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

export const withLinks = (editor: Editor & ReactEditor): Editor & ReactEditor => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element: CustomElement): boolean => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.insertText = (text: string): void => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

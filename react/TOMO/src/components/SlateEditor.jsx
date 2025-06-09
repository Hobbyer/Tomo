import React, { Children, useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import {
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'
import { Toolbar } from '.'

const HOTKEYS = {
  // mod = Command 키 (macOS) 또는 Ctrl 키 (Windows/Linux)
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable' },
      { text: 'rich', bold: true },
    ]
  },
  {
    type: 'paragraph',
    children: [
      { text: 'You can use ' },
      { text: 'Markdown', italic: true },
      { text: ' syntax like ' },
      { text: '`inline code`', code: true },
      { text: ' or ' },
      { text: '**bold**', bold: true },
      { text: ', and even ' },
      { text: '*lists*', italic: true },
    ]
  }
]

const SlateEditor = () => {

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  };

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  };

  const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(
      editor,
      format,
      isAlignType(format) ? 'align' : 'type'
    )
    const isList = isListType(format)

    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) && 
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
      split: true,
    })

    let newProperties
    if (isAlignType(format)) {
      newProperties = {
        align: isActive ? undefined : format,
      }
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      }
    }

    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
  };

  const isBlockActive = (editor, format, blockType = 'type') => {
    const { selection } = editor
    if (!selection) return false
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => {
          if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
            if (blockType === 'align' && isAlignElement(n)) {
              return n.align === format
            }
            return n.type === format
          }
          return false
        },
      })
    )
    return !!match
  };

  const isAlignType = format => {
    return TEXT_ALIGN_TYPES.includes(format)
  };
  const isAlignElement = element => {
    return 'align' in element
  };
  const isListType = format => {
    return LIST_TYPES.includes(format)
  };

  const Element = ({ attributes, children, element }) => {
    const style = {}
    if (isAlignElement(element)) {
      style.textAlign = element.align
    }
    switch (element.type) {
      case 'heading-one':
        return <h1 {...attributes} style={style}>
          {children}
        </h1>
      case 'heading-two':
        return <h2 {...attributes} style={style}>
          {children}
        </h2>
      case 'heading-three':
        return <h3 {...attributes} style={style}>
          {children}
        </h3>
      case 'heading-four':
        return <h4 {...attributes} style={style}>
          {children}
        </h4>
      case 'heading-five':
        return <h5 {...attributes} style={style}>
          {children}
        </h5>
      case 'heading-six':
        return <h6 {...attributes} style={style}>
          {children}
        </h6>
      case 'block-quote':
        return <blockquote {...attributes} style={style}>
          {children}
        </blockquote>
      case 'bulleted-list':
        return <ul {...attributes} style={style}>
          {children}
        </ul>
      case 'numbered-list':
        return <ol {...attributes} style={style}>
          {children}
        </ol>
      case 'list-item':
        return <li {...attributes} style={style}>
          {children}
        </li>
      case 'code-block':
        return <pre {...attributes} style={style}>
          {children}
        </pre>
      case 'todo':
        return (
          <div {...attributes} style={{ display: 'flex', alignItems: 'center' }}>
            <span contentEditable={false}>
              <input type="checkbox" style={{ marginRight: '0.5rem' }} />
            </span>
            {children}
          </div>
        )
      default:
        return <p {...attributes} style={style}>
          {children}
        </p>
    }
  };

  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
    if (leaf.italic) {
      children = <em>{children}</em>
    }
    if (leaf.underline) {
      children = <u>{children}</u>
    }
    if (leaf.code) {
      children = <code>{children}</code>
    }
    return <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}>
      {children}
    </span>
  };

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        
      </Toolbar>
      <Editable 
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
        onKeyDown={(e) => {
          if (isHotkey('enter', e)) {
            e.preventDefault()
            Transforms.insertText(editor, '\n')
          }

          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, e)) {
              e.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor,mark)
            }
          }
        }}
      />
    </Slate>
  )
}

export default SlateEditor
import React, { useCallback, useState } from 'react';
import { createEditor, Editor, Element, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  }
]

const Test1 = () => {

  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  })

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable 
        renderElement={renderElement}
        onKeyDown={e => {
          if (!e.ctrlKey) {
            return;
          }

          switch (e.key) {
            case '`': {
              e.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: n => n.type === 'code',
              })
              Transforms.setNodes(
                editor,
                { type: match ? 'paragraph' : 'code' },
                {
                  match: n => Element.isElement(n) && Editor.isBlock(editor, n),
                }
              )
              break;
            }

            case 'b': {
              e.preventDefault();
              Editor.addMark(editor, 'bold', true);
              break;
            }
          }
        }}
      />
    </Slate>
  )
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return (
    <p {...props.attributes}>
      {props.children}
    </p>
  )
}

const Leaf = props => {
  return (
    <span
    {...props.attributes}
    style={{ fontweight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

export default Test1
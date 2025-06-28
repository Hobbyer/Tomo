import React from 'react';
import { Rnd  } from 'react-rnd';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';

export default function ImageElement({element, attributes}) {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const {url, width, height} = element;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <Rnd
          size={{ width, height }}
          onResizeStop={(_, __, ref) => {
            Transforms.setNodes(
              editor,
              { width: parseInt(ref.style.width), height: parseInt(ref.style.height) },
              { at: path }
            );
          }}
        >
          <img src={url} alt="" style={{ width: '100%', height: '100%' }} />
        </Rnd>
      </div>
    </div>
  );
};
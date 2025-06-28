import React, { useRef } from 'react';
import { useSlateStatic, ReactEditor } from 'slate-react';
import { Transforms } from 'slate';
import { CodeIcon } from 'lucide-react';

export default function ImageButton({ icon }) {
  const editor = useSlateStatic();
  const inputRef = useRef();

  const handleFiles = files => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/'))
        return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result;
        Transforms.insertNodes(editor, {
          type: 'image',
          url,
          width: 300,
          height: 200,
          children: [{text: ''}],
        });
        // 삽입 후 곧받로 포커스
        ReactEditor.focus(editor);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <button
        onMouseDown={e => {
          e.preventDefault();
          inputRef.current.click();
        }}
        title="Insert Image"
      >
        {icon}
      </button>
      <input
        type='file'
        ref={inputRef}
        style={{display: 'none'}}
        accept='image/*'
        onChange={e => handleFiles(e.target.files)}
      />
    </>
  )
};
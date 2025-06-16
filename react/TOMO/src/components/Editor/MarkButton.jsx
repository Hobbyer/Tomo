import React from 'react';
import { useSlate } from 'slate-react';
import { Editor } from 'slate';

export default function MarkButton({ format, icon }) {
  const editor = useSlate();
  const marks = Editor.marks(editor) || {};
  const active = marks[format] === true;
  return (
    <button
      onMouseDown={e => {
        e.preventDefault();
        active
          ? Editor.removeMark(editor, format)
          : Editor.addMark(editor, format, true);
      }}
    >
      {icon}
    </button>
  );
};
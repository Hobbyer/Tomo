import React from 'react';
import { useSlate } from 'slate-react';
import { isBlockActive, toggleBlock } from '../utils/editor';

export default function BlockButton({ format, icon }) {
  const editor = useSlate();
  const active = isBlockActive(editor, format);
  return (
    <button
      onMouseDown={e => {
        e.preventDefault();
        toggleBlock(editor, format)
      }}
    >{icon}</button>
  );
};